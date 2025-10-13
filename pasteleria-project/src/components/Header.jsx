import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Inicio
          </Link>
          <Link 
            to="/productos" 
            className={`nav-link ${location.pathname === '/productos' ? 'active' : ''}`}
          >
            Productos
          </Link>
          <Link 
            to="/nosotros" 
            className={`nav-link ${location.pathname === '/nosotros' ? 'active' : ''}`}
          >
            Nosotros
          </Link>
          <Link 
            to="/contacto" 
            className={`nav-link ${location.pathname === '/contacto' ? 'active' : ''}`}
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;