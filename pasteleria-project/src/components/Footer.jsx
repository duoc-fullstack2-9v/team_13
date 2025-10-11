import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>Contacto</h4>
        <p>📞 +56 9 1234 5678</p>
        <p>✉️ contacto@pmilsabores.cl</p>
      </div>

      <div className="footer-section">
        <h4>Información</h4>
        <p>Preguntas frecuentes</p>
        <p>Nuestros locales</p>
        <p>Ventas por mayor</p>
      </div>

      <div className="footer-section">
        <h4>Síguenos</h4>
        <p>Instagram</p>
        <p>Facebook</p>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Pastelería mil Sabores. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;