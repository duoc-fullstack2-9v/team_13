import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ContactoPage.css";

const ContactoPage = () => {
  return (
    <div className="contacto-page">
      <Header />
      
      <main className="contacto-main">
        <section className="contacto-hero">
          <div className="container">
            <h1>Contáctanos</h1>
            <p>Estamos aquí para hacer realidad tus ideas dulces</p>
          </div>
        </section>

        <section className="contacto-content">
          <div className="container">
            <div className="contacto-grid">
              
              {/* Información de contacto */}
              <div className="contacto-info">
                <h2>Información de Contacto</h2>
                
                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div className="info-text">
                    <h3>Dirección</h3>
                    <p>Av. Los Carrera 500<br />Quilpué, Chile</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📞</div>
                  <div className="info-text">
                    <h3>Teléfono</h3>
                    <p>+56 2 2234 5678</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div className="info-text">
                    <h3>Email</h3>
                    <p>team13@gruporeact.duocuc.cl</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">🕒</div>
                  <div className="info-text">
                    <h3>Horarios de Atención</h3>
                    <p>
                      Lunes a Viernes: 8:00 - 20:00<br />
                      Sábados: 8:00 - 18:00<br />
                      Domingos: 9:00 - 15:00
                    </p>
                  </div>
                </div>

                <div className="redes-sociales">
                  <h3>Síguenos</h3>
                  <div className="redes-links">
                    <a href="#" className="red-social facebook">📘 Facebook</a>
                    <a href="#" className="red-social instagram">📸 Instagram</a>
                    <a href="#" className="red-social whatsapp">💬 WhatsApp</a>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="contacto-form">
                <h2>¿Cómo podemos ayudarte?</h2>
                <p>
                  Puedes escribirnos o llamarnos directamente. Nuestro equipo responde
                  todas las consultas y pedidos especiales durante el horario de atención.
                </p>

                <div className="contacto-highlights">
                  <div className="highlight-card">
                    <h3>Correo electrónico</h3>
                    <p>team13@gruporeact.duocuc.cl</p>
                  </div>
                  <div className="highlight-card">
                    <h3>Teléfono</h3>
                    <p>+56 2 2234 5678</p>
                  </div>
                  <div className="highlight-card">
                    <h3>Dirección</h3>
                    <p>Av. Los Carrera 500, Quilpué</p>
                  </div>
                </div>

                <p className="contacto-note">
                  También puedes visitarnos para coordinar pedidos personalizados,
                  reuniones para eventos o degustaciones privadas. ¡Te esperamos!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mapa-section">
          <div className="container">
            <h2>Nuestra Ubicación</h2>
            <div className="mapa-placeholder">
              <div className="mapa-info">
                <span>🗺️</span>
                <p>Nos encontramos en el corazón de Quilpué</p>
                <p>Fácil acceso en transporte público y estacionamiento disponible</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactoPage;
