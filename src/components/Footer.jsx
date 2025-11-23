import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Pastelería Mil Sabores</h3>
          <p>Celebrando la dulzura de la vida desde 1974</p>
          <p>Récord Guinness 1995 - Torta más grande del mundo</p>
        </div>
        <div className="footer-section">
          <h4>Contáctanos</h4>
          <p>Email: team13@gruporeact.duocuc.cl</p>
          <p>Teléfono: +56 2 2234 5678</p>
          <p>Dirección: Av. Los Carrera 500, Quilpué</p>
        </div>
        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2024 Pastelería Mil Sabores. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
