import React from 'react';

const FirebaseErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (error) => {
      console.error('Firebase Error:', error);
      setHasError(true);
      setError(error);
    };

    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.code && event.reason.code.includes('firebase')) {
        handleError(event.reason);
        event.preventDefault();
      }
    });

    return () => {
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{
        padding: '20px',
        margin: '20px',
        border: '2px solid #ffc0cb',
        borderRadius: '8px',
        backgroundColor: '#fff5e1',
        color: '#884513'
      }}>
        <h3>🔥 Firebase no está configurado</h3>
        <p>El proyecto está funcionando en modo de desarrollo.</p>
        <p><strong>Para usar Firebase:</strong></p>
        <ol>
          <li>Crear un proyecto en <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
          <li>Habilitar Authentication con Google</li>
          <li>Actualizar las variables de entorno en el archivo <code>.env</code></li>
        </ol>
        <button 
          onClick={() => setHasError(false)}
          style={{
            background: '#ffc0cb',
            color: '#884513',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Continuar sin Firebase
        </button>
      </div>
    );
  }

  return children;
};

export default FirebaseErrorBoundary;