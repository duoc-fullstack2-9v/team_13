import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterForm.css";

const RegisterForm = ({ onSuccess, onError }) => {
  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Información personal
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",

    // Paso 2: Credenciales
    nombreUsuario: "",
    password: "",
    confirmPassword: "",
    codigoDescuento: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedBenefits, setDetectedBenefits] = useState([]);

  // Validaciones en tiempo real con useEffect
  useEffect(() => {
    validateCurrentStep();
    detectBenefits();
  }, [formData, step]);

  const validateCurrentStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.nombres.trim()) {
        newErrors.nombres = "Los nombres son obligatorios";
      } else if (formData.nombres.length < 2) {
        newErrors.nombres = "Los nombres deben tener al menos 2 caracteres";
      }

      if (!formData.apellidos.trim()) {
        newErrors.apellidos = "Los apellidos son obligatorios";
      }

      if (!formData.email.trim()) {
        newErrors.email = "El email es obligatorio";
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = "El formato del email no es válido";
      }

      if (formData.telefono && !isValidPhone(formData.telefono)) {
        newErrors.telefono = "Formato de teléfono inválido (9 1234 5678)";
      }

      if (formData.fechaNacimiento && !isValidDate(formData.fechaNacimiento)) {
        newErrors.fechaNacimiento = "Formato de fecha inválido (DD/MM/AAAA)";
      }
    }

    if (step === 2) {
      if (!formData.nombreUsuario.trim()) {
        newErrors.nombreUsuario = "El nombre de usuario es obligatorio";
      } else if (formData.nombreUsuario.length < 4) {
        newErrors.nombreUsuario = "Mínimo 4 caracteres";
      }

      if (!formData.password) {
        newErrors.password = "La contraseña es obligatoria";
      } else if (!isValidPassword(formData.password)) {
        newErrors.password =
          "Mínimo 8 caracteres, una mayúscula, una minúscula y un número";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
  };

  const detectBenefits = () => {
    const benefits = [];

    if (isOver50(formData.fechaNacimiento)) {
      benefits.push("50% de descuento para mayores de 50 años");
    }

    if (formData.codigoDescuento === "FELICES50") {
      benefits.push("10% de descuento de por vida");
    }

    if (isStudentEmail(formData.email)) {
      benefits.push("Torta gratis en tu cumpleaños");
    }

    setDetectedBenefits(benefits);
  };

  // Funciones de validación
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^9\s?\d{4}\s?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const isValidDate = (date) => {
    const dateRegex =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    return dateRegex.test(date);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const isOver50 = (birthDate) => {
    if (!isValidDate(birthDate)) return false;
    const parts = birthDate.split("/");
    const year = parseInt(parts[2]);
    const currentYear = new Date().getFullYear();
    return currentYear - year >= 50;
  };

  const isStudentEmail = (email) => {
    return email.endsWith("@duoc.cl") || email.endsWith("@duocuc.cl");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStepValid = () => {
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Registrar usuario con Firebase
      const additionalData = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        direccion: formData.direccion,
        nombreUsuario: formData.nombreUsuario,
        codigoDescuento: formData.codigoDescuento,
        benefits: detectedBenefits,
        registrationDate: new Date().toISOString()
      };

      await signUp(formData.email, formData.password, additionalData);
      
      // Registro exitoso
      if (onSuccess) {
        onSuccess({ ...formData, ...additionalData });
      }
      
      // Redirigir al usuario
      navigate('/');
      
    } catch (error) {
      console.error('Error en registro:', error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      if (onError) {
        onError(new Error(errorMessage));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado. Intenta iniciar sesión.';
      case 'auth/invalid-email':
        return 'El formato del email no es válido.';
      case 'auth/operation-not-allowed':
        return 'El registro con email no está habilitado.';
      case 'auth/weak-password':
        return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
      default:
        return 'Error al registrar usuario. Por favor, intenta nuevamente.';
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      if (onSuccess) {
        onSuccess({ provider: 'google' });
      }
      navigate('/');
    } catch (error) {
      console.error('Error en registro con Google:', error);
      if (onError) {
        onError(new Error('Error al registrarse con Google. Intenta nuevamente.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-form">
      {/* Opción de registro rápido con Google */}
      <div className="google-register-section">
        <h3>Registro Rápido</h3>
        <button 
          type="button"
          onClick={handleGoogleRegister}
          className="google-register-btn"
          disabled={isSubmitting}
        >
          <span className="google-icon">G</span>
          {isSubmitting ? 'Registrando...' : 'Registrarse con Google'}
        </button>
        <div className="divider">
          <span>o registrarse con email</span>
        </div>
      </div>

      <div className="step-indicator">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <span>1</span>
          <p>Información Personal</p>
        </div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <span>2</span>
          <p>Credenciales</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-step">
            <h3>Información Personal</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Nombres *</label>
                <input
                  type="text"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange("nombres", e.target.value)}
                  className={errors.nombres ? "error" : ""}
                  placeholder="Ingresa tus nombres"
                />
                {errors.nombres && (
                  <span className="error-text">{errors.nombres}</span>
                )}
              </div>

              <div className="form-group">
                <label>Apellidos *</label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) =>
                    handleInputChange("apellidos", e.target.value)
                  }
                  className={errors.apellidos ? "error" : ""}
                  placeholder="Ingresa tus apellidos"
                />
                {errors.apellidos && (
                  <span className="error-text">{errors.apellidos}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "error" : ""}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
              {isStudentEmail(formData.email) && (
                <span className="success-text">
                  ✅ Correo institucional detectado
                </span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  placeholder="9 1234 5678"
                  value={formData.telefono}
                  onChange={(e) =>
                    handleInputChange("telefono", e.target.value)
                  }
                  className={errors.telefono ? "error" : ""}
                />
                {errors.telefono && (
                  <span className="error-text">{errors.telefono}</span>
                )}
              </div>

              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={formData.fechaNacimiento}
                  onChange={(e) =>
                    handleInputChange("fechaNacimiento", e.target.value)
                  }
                  className={errors.fechaNacimiento ? "error" : ""}
                />
                {errors.fechaNacimiento && (
                  <span className="error-text">{errors.fechaNacimiento}</span>
                )}
                {isOver50(formData.fechaNacimiento) && (
                  <span className="success-text">
                    ✅ Elegible para 50% de descuento
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                placeholder="Ingresa tu dirección completa"
              />
            </div>

            <button
              type="button"
              className="btn-next"
              onClick={() => setStep(2)}
              disabled={!isStepValid()}
            >
              Siguiente Paso
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3>Credenciales de Acceso</h3>

            <div className="form-group">
              <label>Nombre de Usuario *</label>
              <input
                type="text"
                value={formData.nombreUsuario}
                onChange={(e) =>
                  handleInputChange("nombreUsuario", e.target.value)
                }
                className={errors.nombreUsuario ? "error" : ""}
                placeholder="Elige un nombre de usuario único"
              />
              {errors.nombreUsuario && (
                <span className="error-text">{errors.nombreUsuario}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contraseña *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={errors.password ? "error" : ""}
                  placeholder="Crea una contraseña segura"
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label>Confirmar Contraseña *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={errors.confirmPassword ? "error" : ""}
                  placeholder="Repite tu contraseña"
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Código de Descuento</label>
              <input
                type="text"
                placeholder="Ej: FELICES50"
                value={formData.codigoDescuento}
                onChange={(e) =>
                  handleInputChange("codigoDescuento", e.target.value)
                }
              />
              {formData.codigoDescuento === "FELICES50" && (
                <span className="success-text">
                  ✅ 10% de descuento de por vida activado
                </span>
              )}
            </div>

            {/* Mostrar beneficios detectados */}
            {detectedBenefits.length > 0 && (
              <div className="benefits-detected">
                <h4>🎁 ¡Beneficios Activados!</h4>
                {detectedBenefits.map((benefit, index) => (
                  <div key={index} className="benefit-detected-item">
                    {benefit}
                  </div>
                ))}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn-back"
                onClick={() => setStep(1)}
              >
                Volver
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Creando Cuenta...
                  </>
                ) : (
                  "Crear Mi Cuenta"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
