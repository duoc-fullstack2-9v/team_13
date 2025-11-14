import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    console.log('Login exitoso:', userData);
    // Redirigir al usuario después del login exitoso
    navigate('/');
  };

  const handleLoginError = (error) => {
    console.error('Error en login:', error);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>🍰 Bienvenido de vuelta</h1>
            <p>Inicia sesión para acceder a tu cuenta</p>
          </div>
          
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
          
          <div className="auth-footer">
            <p>
              ¿No tienes cuenta? 
              <button 
                className="link-button"
                onClick={() => navigate('/registro')}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
        
        <div className="auth-background">
          <div className="auth-bg-content">
            <h2>🎂 Pastelería Mil Sabores</h2>
            <p>50 años creando momentos dulces</p>
            <div className="auth-features">
              <div className="feature">
                <span className="feature-icon">🍰</span>
                <span>Productos artesanales</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span>Entrega a domicilio</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💝</span>
                <span>Descuentos especiales</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;