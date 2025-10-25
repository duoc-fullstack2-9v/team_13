import React from "react";
import LoginForm from "../components/LoginForm";
import "../styles/LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-page-container">
        <div className="login-hero">
          <h1>Bienvenido de vuelta</h1>
          <p>Ingresa a tu cuenta para acceder a beneficios exclusivos y gestionar tus pedidos</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;