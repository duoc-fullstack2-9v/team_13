import React from "react";
import "./header.css";

function Header() {
  const handleClick = (e) => {
    if (e.target.getAttribute("href") === "#") {
      e.preventDefault();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        🍰 Vive al máximo tus momentos dulces
      </div>

      <nav className="navbar-links" onClick={handleClick}>
        <a href="#inicio" className="nav-item">Inicio</a>
        <a href="#productos" className="nav-item">Productos</a>
        <a href="#nosotros" className="nav-item">Nosotros</a>
        <a href="#contacto" className="nav-item">Contacto</a>
      </nav>
    </header>
  );
}

export default Header;