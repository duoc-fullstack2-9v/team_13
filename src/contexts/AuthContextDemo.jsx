import React, { createContext, useContext, useState } from 'react';

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

  // Simulated Firebase functions for demo
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        uid: 'demo-user-123',
        email: 'usuario@demo.com',
        displayName: 'Usuario Demo',
        photoURL: 'https://via.placeholder.com/40x40?text=U',
        provider: 'google'
      };
      
      setUser(mockUser);
      return { user: mockUser };
    } catch (err) {
      setError('Error al iniciar sesión con Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        uid: 'demo-user-' + Date.now(),
        email: email,
        displayName: additionalData.nombres + ' ' + additionalData.apellidos,
        photoURL: null,
        provider: 'email',
        ...additionalData
      };
      
      setUser(mockUser);
      return { user: mockUser };
    } catch (err) {
      setError('Error al crear cuenta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        uid: 'demo-user-signin',
        email: email,
        displayName: 'Usuario Registrado',
        photoURL: null,
        provider: 'email'
      };
      
      setUser(mockUser);
      return { user: mockUser };
    } catch (err) {
      setError('Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
    } catch (err) {
      setError('Error al cerrar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(prev => ({ ...prev, ...userData }));
    } catch (err) {
      setError('Error al actualizar perfil');
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