import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simular persistencia con localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular diálogo de selección de cuenta de Google
      const email = prompt('Ingresa tu email para simular login con Google:');
      if (!email) {
        throw new Error('Login cancelado');
      }

      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Determinar tipo de usuario
      const userType = email === 'admin@pasteleria.com' ? 'admin' : 'customer';
      
      const mockUser = {
        uid: 'mock-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=884513&color=fff`,
        provider: 'google',
        userType: userType,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      return { user: mockUser };
    } catch (err) {
      setError('Error al iniciar sesión con Google: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de registro
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userType = email === 'admin@pasteleria.com' ? 'admin' : 'customer';
      
      const mockUser = {
        uid: 'mock-' + Date.now(),
        email: email,
        displayName: additionalData.nombres + ' ' + additionalData.apellidos,
        photoURL: null,
        provider: 'email',
        userType: userType,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ...additionalData
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      return { user: mockUser };
    } catch (err) {
      setError('Error al registrar usuario: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userType = email === 'admin@pasteleria.com' ? 'admin' : 'customer';
      
      const mockUser = {
        uid: 'mock-signin-' + Date.now(),
        email: email,
        displayName: 'Usuario Registrado',
        photoURL: null,
        provider: 'email',
        userType: userType,
        lastLogin: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      return { user: mockUser };
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de logout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('mockUser');
    } catch (err) {
      setError('Error al cerrar sesión: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de actualización
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    } catch (err) {
      setError('Error al actualizar perfil: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
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