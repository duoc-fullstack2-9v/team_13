import React from "react";
import "./header.css";

function Header() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        🍰 Vive al máximo tus momentos dulces
      </div>

      <nav className="navbar-links">
        <a href="#" className="nav-item">Inicio</a>
        <a href="#" className="nav-item">Productos</a>
        <a href="#" className="nav-item">Nosotros</a>
        <a href="#" className="nav-item">Contacto</a>
      </nav>
    </header>
  );
}

export default Header;