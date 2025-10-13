import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RegisterForm from "../components/RegisterForm";
import ResultModal from "../components/ResultModal";
import "../styles/RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showResultModal, setShowResultModal] = useState(false);
  const [modalData, setModalData] = useState({
    type: "success", // 'success' o 'error'
    title: "",
    message: "",
    onClose: null,
  });

  const handleRegisterSuccess = (userData) => {
    console.log("Registro exitoso:", userData);

    setModalData({
      type: "success",
      title: "¡Registro Exitoso! 🎉",
      message:
        "Tu cuenta ha sido creada correctamente. Te hemos enviado un email de confirmación.",
      onClose: () => {
        setShowResultModal(false);
        navigate("/"); // Redirigir al home después de cerrar el modal
      },
    });
    setShowResultModal(true);
  };

  const handleRegisterError = (error) => {
    console.error("Error en registro:", error);

    setModalData({
      type: "error",
      title: "Error en el Registro ❌",
      message:
        error.message ||
        "Ha ocurrido un error al crear tu cuenta. Por favor, intenta nuevamente.",
      onClose: () => setShowResultModal(false),
    });
    setShowResultModal(true);
  };

  return (
    <div className="register-page">
      <Header />

      <main className="register-main">
        <div className="register-container">
          <div className="register-header">
            <h1>Crear Cuenta</h1>
            <p>Únete a nuestra familia y disfruta de beneficios exclusivos</p>
          </div>

          <div className="register-content">
            <div className="register-form-section">
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onError={handleRegisterError}
              />
            </div>

            <div className="register-benefits-section">
              <div className="benefits-card">
                <h3>🎁 Beneficios Exclusivos</h3>
                <div className="benefits-list">
                  <div className="benefit-item">
                    <span className="benefit-icon">👵</span>
                    <div className="benefit-text">
                      <strong>50% de Descuento</strong>
                      <p>Para usuarios mayores de 50 años</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">⭐</span>
                    <div className="benefit-text">
                      <strong>10% de Por Vida</strong>
                      <p>Usa el código FELICES50</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">🎓</span>
                    <div className="benefit-text">
                      <strong>Torta Gratis</strong>
                      <p>Para estudiantes Duoc en cumpleaños</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de Resultado */}
      {showResultModal && (
        <ResultModal
          type={modalData.type}
          title={modalData.title}
          message={modalData.message}
          onClose={modalData.onClose}
        />
      )}
    </div>
  );
};

export default RegisterPage;
