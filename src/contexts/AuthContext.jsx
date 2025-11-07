import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';
import adminService from '../services/adminService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verificar si el usuario es administrador
          const isAdmin = await adminService.isAdmin(firebaseUser.email);
          const userType = isAdmin ? 'admin' : 'customer';
          
          // Obtener información adicional del usuario desde Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            userType: userType, // Determinado por consulta a Firebase
            isAdmin: isAdmin,
            ...userData
          });

          // Si es primera vez que se loguea, crear/actualizar documento
          if (!userDoc.exists() && firebaseUser.providerData[0]?.providerId === 'google.com') {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              provider: 'google',
              userType: userType,
              isAdmin: isAdmin,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
          } else {
            // Actualizar último login y tipo de usuario
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              userType: userType,
              isAdmin: isAdmin,
              lastLogin: serverTimestamp()
            }, { merge: true });
          }
        } catch (err) {
          console.error('Error al obtener datos del usuario:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            userType: 'customer',
            isAdmin: false
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Verificar si es administrador consultando Firebase
      const isAdmin = await adminService.isAdmin(firebaseUser.email);
      const userType = isAdmin ? 'admin' : 'customer';
      
      // Guardar información adicional en Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        provider: 'google',
        userType: userType,
        isAdmin: isAdmin,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      }, { merge: true });

      return result;
    } catch (err) {
      console.error('Error en login con Google:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, additionalData = {}) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      
      // Verificar si es administrador consultando Firebase
      const isAdmin = await adminService.isAdmin(email);
      const userType = isAdmin ? 'admin' : 'customer';
      
      // Guardar información adicional en Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        provider: 'email',
        userType: userType,
        isAdmin: isAdmin,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        ...additionalData
      });

      return result;
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Actualizar último login
      await setDoc(doc(db, 'users', result.user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });

      return result;
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Error en logout:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        // Actualizar estado local
        setUser(prev => ({ ...prev, ...userData }));
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signUp,
    signIn,
    signOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;