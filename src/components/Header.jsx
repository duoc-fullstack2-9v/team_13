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
            <li>
              <Link
                to="/registro"
                className={`register-btn-nav ${
                  location.pathname === "/registro" ? "active" : ""
                }`}
              >
                Registrarse
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
