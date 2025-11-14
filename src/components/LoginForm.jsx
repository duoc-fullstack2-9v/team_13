import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginForm.css';

const LoginForm = ({ onSuccess, onError, onClose }) => {
  const { signIn, signInWithGoogle } = useAuth();
  const { showSuccess, showError } = useAlert();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Intentar login con Firebase
      await signIn(formData.email.trim().toLowerCase(), formData.password);
      
      // Login exitoso
      if (onSuccess) {
        onSuccess({ email: formData.email });
      }
      
      // Mostrar mensaje de éxito
      showSuccess('¡Inicio de sesión exitoso! Bienvenido de vuelta.');
      
      // Cerrar modal si existe
      if (onClose) {
        onClose();
      }
      
      // Redirigir al usuario
      navigate('/');
      
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      
      if (onError) {
        onError(new Error(errorMessage));
      }
      
      showError('Error al iniciar sesión: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      
      if (onSuccess) {
        onSuccess({ provider: 'google' });
      }
      
      showSuccess('¡Inicio de sesión con Google exitoso!');
      
      if (onClose) {
        onClose();
      }
      
      navigate('/');
      
    } catch (error) {
      console.error('Error en login con Google:', error);
      const errorMessage = 'Error al iniciar sesión con Google. Por favor, intenta nuevamente.';
      
      if (onError) {
        onError(new Error(errorMessage));
      }
      
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No existe una cuenta con este email.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/invalid-email':
        return 'El formato del email no es válido.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas. Verifica tu email y contraseña.';
      default:
        return 'Error al iniciar sesión. Por favor, intenta nuevamente.';
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-header">
          <h2>🍰 Iniciar Sesión</h2>
          <p>Accede a tu cuenta de la panadería</p>
          {onClose && (
            <button type="button" className="close-btn" onClick={onClose}>×</button>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            📧 Email
            <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="tu@ejemplo.com"
            className={errors.email ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            🔒 Contraseña
            <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Tu contraseña"
            className={errors.password ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>

          <div className="divider">
            <span>O</span>
          </div>

          <button 
            type="button" 
            className="btn-google"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            🌟 Continuar con Google
          </button>
        </div>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta? 
            <Link to="/registro" onClick={onClose}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;