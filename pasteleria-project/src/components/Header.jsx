import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo01 from "../assets/logo01.png";
import "./Header.css";

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-area">
          <img src={logo01} alt="Pastelería MilSabores" className="logo-img" />
          <h1 className="logo-text">Pastelería MilSabores</h1>
        </div>

        <nav className="nav">
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Inicio
          </Link>
          <Link
            to="/productos"
            className={location.pathname === "/productos" ? "active" : ""}
          >
            Productos
          </Link>
          <Link
            to="/nosotros"
            className={location.pathname === "/nosotros" ? "active" : ""}
          >
            Nosotros
          </Link>
          <Link
            to="/contacto"
            className={location.pathname === "/contacto" ? "active" : ""}
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;