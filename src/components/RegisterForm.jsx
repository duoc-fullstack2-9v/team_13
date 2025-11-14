import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterForm.css";

const RegisterForm = ({ onSuccess, onError }) => {
  const { signUp, signInWithGoogle } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showAlert("Por favor corrige los errores en el formulario", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await signUp(formData.email, formData.password, {
        nombre: formData.nombre,
        apellido: formData.apellido
      });

      showAlert("¡Registro exitoso! Bienvenido/a", "success");
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
      
    } catch (error) {
      console.error("Error en registro:", error);
      
      let errorMessage = "Error al crear la cuenta";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este email ya está registrado";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña es muy débil";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "El email no es válido";
      }

      showAlert(errorMessage, "error");
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      showAlert("¡Registro con Google exitoso!", "success");
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error en registro con Google:", error);
      showAlert("Error al registrarse con Google", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Crear Cuenta</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Tu nombre"
            disabled={isSubmitting}
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label>Apellido *</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            placeholder="Tu apellido"
            disabled={isSubmitting}
          />
          {errors.apellido && <span className="error-message">{errors.apellido}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="tu@email.com"
            disabled={isSubmitting}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Contraseña *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Mínimo 6 caracteres"
            disabled={isSubmitting}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirmar Contraseña *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Repite tu contraseña"
            disabled={isSubmitting}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
      </form>

      <div className="divider">
        <span>o</span>
      </div>

      <button 
        type="button"
        className="google-btn"
        onClick={handleGoogleSignUp}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Registrando..." : "Registrarse con Google"}
      </button>

      <p className="login-link">
        ¿Ya tienes cuenta? <span onClick={() => navigate("/login")} className="link">Inicia sesión</span>
      </p>
    </div>
  );
};

export default RegisterForm;
