// Mock Firebase functions for development when Firebase is not configured
export const createMockFirebaseContext = () => {
  return {
    user: null,
    loading: false,
    error: null,
    signInWithGoogle: async () => {
      // Simulate Google sign in
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = {
            uid: 'demo-user-123',
            email: 'usuario@demo.com',
            displayName: 'Usuario Demo',
            photoURL: null,
            provider: 'google'
          };
          resolve({ user: mockUser });
        }, 1000);
      });
    },
    signUp: async (email, password, additionalData) => {
      // Simulate email signup
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = {
            uid: 'demo-user-' + Date.now(),
            email: email,
            displayName: additionalData.nombres + ' ' + additionalData.apellidos,
            photoURL: null,
            provider: 'email',
            ...additionalData
          };
          resolve({ user: mockUser });
        }, 1500);
      });
    },
    signIn: async (email, password) => {
      // Simulate email signin
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = {
            uid: 'demo-user-signin',
            email: email,
            displayName: 'Usuario Registrado',
            photoURL: null,
            provider: 'email'
          };
          resolve({ user: mockUser });
        }, 1000);
      });
    },
    signOut: async () => {
      // Simulate sign out
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    updateUserProfile: async (userData) => {
      // Simulate profile update
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    }
  };
};