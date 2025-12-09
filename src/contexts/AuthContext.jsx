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
import apiService from '../services/apiService';

const AuthContext = createContext();

const DEFAULT_USER_AGE = 25;

// Función para traducir códigos de error de Firebase al español
const translateFirebaseError = (errorCode) => {
  const errorMessages = {
    // Errores de autenticación
    'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
    'auth/wrong-password': 'La contraseña es incorrecta. Por favor, inténtalo de nuevo.',
    'auth/invalid-email': 'El formato del correo electrónico no es válido.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Contacta al administrador.',
    'auth/email-already-in-use': 'Este correo electrónico ya está registrado. Intenta iniciar sesión.',
    'auth/weak-password': 'La contraseña es muy débil. Debe tener al menos 6 caracteres.',
    'auth/invalid-credential': 'Las credenciales son inválidas. Verifica tu correo y contraseña.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Por favor, espera unos minutos e inténtalo nuevamente.',
    'auth/operation-not-allowed': 'Esta operación no está permitida. Contacta al administrador.',
    
    // Errores de Google Sign-In
    'auth/unauthorized-domain': 'Este dominio no está autorizado para usar Google Sign-In.',
    'auth/popup-blocked': 'El popup de login fue bloqueado por tu navegador. Permite popups para este sitio.',
    'auth/popup-closed-by-user': 'Cerraste la ventana de login antes de completar el proceso.',
    'auth/cancelled-popup-request': 'Se canceló la solicitud de login.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
    
    // Errores de sesión
    'auth/requires-recent-login': 'Por seguridad, debes iniciar sesión nuevamente para realizar esta acción.',
    'auth/invalid-user-token': 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    'auth/user-token-expired': 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    
    // Error genérico
    'default': 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente.'
  };
  
  return errorMessages[errorCode] || errorMessages['default'];
};

const calculateAgeFromBirthdate = (dateString) => {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  if (isNaN(parsed.getTime())) return null;
  const diffMs = Date.now() - parsed.getTime();
  const ageDate = new Date(diffMs);
  const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
  return calculatedAge > 0 ? calculatedAge : null;
};

const normalizeAgeValue = (value) => {
  const numericValue = Number(value);
  if (Number.isFinite(numericValue) && numericValue > 0) {
    return Math.min(110, Math.round(numericValue));
  }
  return DEFAULT_USER_AGE;
};

const resolveUserAge = (profile = {}) => {
  if (profile.edad !== undefined && profile.edad !== null) {
    return normalizeAgeValue(profile.edad);
  }
  const calculated = calculateAgeFromBirthdate(profile.fechaNacimiento);
  if (calculated) {
    return normalizeAgeValue(calculated);
  }
  return DEFAULT_USER_AGE;
};

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
          
          // Sincronizar usuario con la API backend
          let apiUserData = {};
          try {
            console.log('🔍 Buscando usuario en API:', firebaseUser.email);
            apiUserData = await apiService.getUserByEmail(firebaseUser.email);
            console.log('✅ Usuario encontrado en API:', apiUserData);
          } catch (error) {
            console.warn('⚠️ Usuario no existe en API, creándolo automáticamente...');
            // Si el usuario no existe en la API, crearlo automáticamente
            try {
              const resolvedAge = resolveUserAge(userData || {});
              const newUserData = {
                email: firebaseUser.email,
                nombre: firebaseUser.displayName?.split(' ')[0] || userData.nombre || 'Usuario',
                apellido: firebaseUser.displayName?.split(' ').slice(1).join(' ') || userData.apellido || '',
                password: 'firebase_auth_user', // Password temporal para usuarios de Firebase
                telefono: userData.telefono || '',
                fechaNacimiento: userData.fechaNacimiento || null,
                userType: userType,
                edad: resolvedAge,
                esEstudianteDuoc: Boolean(userData?.esEstudianteDuoc ?? false)
              };
              
              console.log('📝 Creando usuario en API:', newUserData);
              const createResponse = await apiService.createUser(newUserData);
              apiUserData = newUserData;
              console.log('✅ Usuario creado exitosamente en la API:', createResponse);
            } catch (createError) {
              console.error('❌ Error al crear usuario en API:', createError);
              // Intentar con datos mínimos
              try {
                const minimalUserData = {
                  email: firebaseUser.email,
                  nombre: 'Usuario',
                  apellido: 'Firebase',
                  password: 'temp123',
                  userType: userType,
                  edad: DEFAULT_USER_AGE,
                  esEstudianteDuoc: false
                };
                console.log('🔄 Reintentando con datos mínimos:', minimalUserData);
                await apiService.createUser(minimalUserData);
                apiUserData = minimalUserData;
                console.log('✅ Usuario creado con datos mínimos');
              } catch (secondError) {
                console.error('❌ Error definitivo al crear usuario:', secondError);
              }
            }
          }
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            userType: userType, // Determinado por consulta a Firebase
            isAdmin: isAdmin,
            // Información adicional de la API
            nombre: apiUserData?.nombre || null,
            apellido: apiUserData?.apellido || null,
            telefono: apiUserData?.telefono || null,
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
      
      // Manejo especial de errores de Google Auth
      let errorMessage = translateFirebaseError(err.code);
      
      // Error específico cuando el dominio no está autorizado
      if (err.code === 'auth/unauthorized-domain') {
        errorMessage = 'El dominio actual no está autorizado para Google Sign-In. Debes agregar este dominio en Firebase Console.';
      }
      
      setError(errorMessage);
      
      // Crear error con mensaje traducido
      const translatedError = new Error(errorMessage);
      translatedError.code = err.code;
      throw translatedError;
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
      const errorMessage = translateFirebaseError(err.code);
      setError(errorMessage);
      
      // Crear error con mensaje traducido
      const translatedError = new Error(errorMessage);
      translatedError.code = err.code;
      throw translatedError;
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
      const errorMessage = translateFirebaseError(err.code);
      setError(errorMessage);
      
      // Crear error con mensaje traducido
      const translatedError = new Error(errorMessage);
      translatedError.code = err.code;
      throw translatedError;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Cerrar sesión en Firebase
      await firebaseSignOut(auth);
      
      // Limpiar estado local
      setUser(null);
      
      console.log('✅ Sesión cerrada correctamente');
      
      // Forzar redirección a la página principal
      window.location.href = '/';
    } catch (err) {
      console.error('Error en logout:', err);
      setError(err.message);
      
      // Incluso si hay error, limpiar sesión localmente
      setUser(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
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
