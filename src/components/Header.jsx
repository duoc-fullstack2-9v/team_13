import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const location = useLocation();

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
              <a href="#categorias">Categorías</a>
            </li>
            <li>
              <a href="#nosotros">Nosotros</a>
            </li>
            <li>
              <a href="#contacto">Contacto</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
