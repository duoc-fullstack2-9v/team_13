import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const location = useLocation();
  const { user, signOut, signInWithGoogle } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Pastelería Mil Sabores</h1>
            <p>Celebrando 50 años de dulzura</p>
          </Link>
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
            {user && user.userType === 'admin' && (
              <li>
                <Link
                  to="/admin/productos"
                  className={location.pathname === "/admin/productos" ? "active" : ""}
                >
                  Admin
                </Link>
              </li>
            )}
            {user ? (
              <>
                <li className="user-greeting">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Usuario" 
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 
                       user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="user-name">
                    ¡Hola, {user.displayName ? 
                      user.displayName.split(' ').slice(0, 2).join(' ') : 
                      user.email?.split('@')[0] || 'Usuario'}!
                  </span>
                </li>
                <li>
                  <button 
                    onClick={signOut}
                    className="logout-btn"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="auth-buttons">
                <button 
                  onClick={signInWithGoogle}
                  className="google-login-btn"
                >
                  <span className="google-icon">G</span>
                  Iniciar con Google
                </button>
                <Link
                  to="/registro"
                  className={`register-btn-nav ${
                    location.pathname === "/registro" ? "active" : ""
                  }`}
                >
                  Registrarse
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
