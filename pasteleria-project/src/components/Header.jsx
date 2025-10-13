import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* SOLO navegación - sin título */}
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Inicio
          </Link>
          <Link 
            to="/productos" 
            className={`nav-link ${isActive('/productos') ? 'active' : ''}`}
          >
            Productos
          </Link>
          <Link 
            to="/nosotros" 
            className={`nav-link ${isActive('/nosotros') ? 'active' : ''}`}
          >
            Nosotros
          </Link>
          <Link 
            to="/contacto" 
            className={`nav-link ${isActive('/contacto') ? 'active' : ''}`}
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
