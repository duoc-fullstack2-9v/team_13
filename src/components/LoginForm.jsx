import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ResultModal from "./ResultModal";
import "../styles/LoginForm.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular validación con "base de datos" temporal
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Usuarios de prueba (en producción esto vendría de tu backend)
      const testUsers = [
        { username: "admin", password: "admin123", role: "admin", email: "admin@pasteleria.com" },
        { username: "usuario", password: "user123", role: "user", email: "usuario@pasteleria.com" },
        { username: "cliente", password: "cliente123", role: "user", email: "cliente@gmail.com" }
      ];

      const foundUser = testUsers.find(
        user => user.username === formData.username && user.password === formData.password
      );

      if (foundUser) {
        login({
          username: foundUser.username,
          email: foundUser.email,
          role: foundUser.role
        });
        setShowModal(true);
        // Redireccionar después de 2 segundos
        setTimeout(() => {
          setShowModal(false);
          navigate('/');
        }, 2000);
      } else {
        setErrors({ general: "Credenciales incorrectas. Por favor, verifica tu usuario y contraseña." });
      }
    } catch (error) {
      setErrors({ general: "Error al iniciar sesión. Intenta nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <p className="login-subtitle">Ingresa a tu cuenta de Pastelería Mil Sabores</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario *</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={errors.username ? "error" : ""}
              placeholder="Ingresa tu nombre de usuario"
              disabled={isSubmitting}
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={errors.password ? "error" : ""}
              placeholder="Ingresa tu contraseña"
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            className="btn-login"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Iniciando Sesión...
              </>
            ) : (
              "Ingresar a Mi Cuenta"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes una cuenta? <a href="/registro">Regístrate aquí</a></p>
          <p>
            <a href="#olvidaste-contraseña" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
          
          <div className="demo-accounts">
            <h4>Cuentas de Demo:</h4>
            <div className="demo-account">
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="demo-account">
              <strong>Usuario:</strong> usuario / user123
            </div>
          </div>
        </div>
      </div>
      <ResultModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="¡Inicio de sesión exitoso!"
        message={`Bienvenido/a de nuevo. Redirigiendo al inicio...`}
        type="success"
      />
    </div>
  );
};

export default LoginForm;