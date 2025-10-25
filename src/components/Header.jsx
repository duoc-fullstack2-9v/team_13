import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Pastelería Mil Sabores</h1>
            <p>Celebrando 50 años de dulzura</p>
          </Link>
        </div>

        {/* Estado del usuario */}
        <div className="user-actions">
          {isAuthenticated ? (
            <div className="user-info">
              <span>Hola, {user?.username}</span>
              <span className="user-role">({user?.role})</span>
              {user?.role === 'admin' && (
                <Link to="/admin" className="admin-link">
                  Panel Admin
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Ingresar
              </Link>
              <Link to="/registro" className="register-btn">
                Registrarse
              </Link>
            </div>
          )}
        </div>

        <nav className="nav">
          <ul>
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/productos"
                className={location.pathname === "/productos" ? "active" : ""}
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                to="/nosotros"
                className={location.pathname === "/nosotros" ? "active" : ""}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className={location.pathname === "/contacto" ? "active" : ""}
              >
                Contacto
              </Link>
            </li>
            {/* Los botones de autenticación se movieron a la sección superior */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;