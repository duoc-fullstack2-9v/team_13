import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CartIcon from "./CartIcon";
import "../styles/Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, signInWithGoogle } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Pastelería Mil Sabores</h1>
            <p>50 años de dulzura</p>
          </Link>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/productos"
                className={location.pathname === "/productos" ? "active" : ""}
              >
                🍰 Catálogo
              </Link>
            </li>
            <li>
              <Link
                to="/nosotros"
                className={location.pathname === "/nosotros" ? "active" : ""}
              >
                👥 Nosotros
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className={location.pathname === "/contacto" ? "active" : ""}
              >
                📞 Contacto
              </Link>
            </li>
            {user && user.userType === 'admin' && (
              <li 
                className="admin-dropdown"
                onMouseEnter={() => setShowAdminDropdown(true)}
                onMouseLeave={() => setShowAdminDropdown(false)}
              >
                <Link
                  to="/admin"
                  className={location.pathname.startsWith("/admin") ? "active" : ""}
                >
                  ⚙️ Admin <span className="dropdown-arrow">▼</span>
                </Link>
                <div className={`dropdown-content ${showAdminDropdown ? 'show' : ''}`}>
                  <Link 
                    to="/admin" 
                    onClick={() => {
                      navigate('/admin');
                      setShowAdminDropdown(false);
                    }}
                  >
                    📊 Dashboard
                  </Link>
                  <Link 
                    to="/admin/productos"
                    onClick={() => {
                      navigate('/admin/productos');
                      setShowAdminDropdown(false);
                    }}
                  >
                    🍰 Productos
                  </Link>
                  <Link 
                    to="/admin/pedidos"
                    onClick={() => {
                      navigate('/admin/pedidos');
                      setShowAdminDropdown(false);
                    }}
                  >
                    📋 Pedidos
                  </Link>
                  <Link 
                    to="/admin/usuarios"
                    onClick={() => {
                      navigate('/admin/usuarios');
                      setShowAdminDropdown(false);
                    }}
                  >
                    👥 Lista Usuarios
                  </Link>
                  <Link 
                    to="/admin/mantenedor-usuarios"
                    onClick={() => {
                      navigate('/admin/mantenedor-usuarios');
                      setShowAdminDropdown(false);
                    }}
                  >
                    ⚙️ Gestión Usuarios
                  </Link>
                  <Link 
                    to="/admin/ventas"
                    onClick={() => {
                      navigate('/admin/ventas');
                      setShowAdminDropdown(false);
                    }}
                  >
                    💰 Ventas
                  </Link>
                  <Link 
                    to="/admin/reportes"
                    onClick={() => {
                      navigate('/admin/reportes');
                      setShowAdminDropdown(false);
                    }}
                  >
                    📈 Reportes
                  </Link>
                </div>
              </li>
            )}
            {user && (
              <li>
                <Link
                  to="/mis-pedidos"
                  className={location.pathname === "/mis-pedidos" ? "active" : ""}
                >
                  📦 Mis Pedidos
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
                    ¡Hola, {user.nombre && user.apellido ? 
                      `${user.nombre} ${user.apellido}` : 
                      user.displayName ? 
                        user.displayName.split(' ').slice(0, 2).join(' ') : 
                        user.email?.split('@')[0] || 'Usuario'}!
                  </span>
                </li>
                <li>
                  <CartIcon />
                </li>
                <li>
                  <button 
                    onClick={async () => {
                      try {
                        await signOut();
                      } catch (error) {
                        console.error('Error al cerrar sesión:', error);
                        // Forzar redirección incluso si hay error
                        window.location.href = '/';
                      }
                    }}
                    className="logout-btn"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <CartIcon />
                </li>
                <li className="auth-buttons">
                  <Link
                    to="/login"
                    className={`login-btn-nav ${
                      location.pathname === "/login" ? "active" : ""
                    }`}
                  >
                    🔐 Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
                    className={`register-btn-nav ${
                      location.pathname === "/registro" ? "active" : ""
                    }`}
                  >
                    ✨ Registrarse
                  </Link>
                </li>
                <li className="google-auth">
                  <button 
                    onClick={signInWithGoogle}
                    className="google-login-btn"
                    title="Iniciar sesión con Google"
                  >
                    <span className="google-icon">G</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
