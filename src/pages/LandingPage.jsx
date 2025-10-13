import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carrusel from "../components/Carrusel";
import "../styles/LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />

      <main>
        {/* Hero Section con Carrusel */}
        <section className="hero-section">
          <Carrusel />
        </section>

        {/* Sección de Aniversario */}
        <section className="anniversary-section">
          <div className="container">
            <div className="anniversary-content">
              <div className="anniversary-text">
                <h2>🎉 50 Años Endulzando Momentos</h2>
                <p>
                  Desde 1974, hemos sido parte de las celebraciones más
                  importantes de Chile. Con más de medio siglo de experiencia,
                  seguimos creando momentos inolvidables con el sabor de
                  siempre.
                </p>
                <div className="anniversary-stats">
                  <div className="stat">
                    <h3>50+</h3>
                    <p>Años de Experiencia</p>
                  </div>
                  <div className="stat">
                    <h3>10K+</h3>
                    <p>Tortas Entregadas</p>
                  </div>
                  <div className="stat">
                    <h3>Récord</h3>
                    <p>Guinness 1995</p>
                  </div>
                </div>
              </div>
              <div className="anniversary-image">
                <div className="placeholder-image">🎂</div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Beneficios */}
        <section className="benefits-section">
          <div className="container">
            <h2>Beneficios Exclusivos</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🎁</div>
                <h3>50% de Descuento</h3>
                <p>
                  Para usuarios mayores de 50 años en todos nuestros productos
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">⭐</div>
                <h3>10% de Por Vida</h3>
                <p>Usa el código FELICES50 al registrarte</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🎓</div>
                <h3>Torta de Cumpleaños Gratis</h3>
                <p>Para estudiantes Duoc con correo institucional</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Testimonios */}
        <section className="testimonials-section">
          <div className="container">
            <h2>Lo que Dicen Nuestros Clientes</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-text">
                  "La mejor torta de chocolate que he probado. ¡Mi familia está
                  encantada!"
                </div>
                <div className="testimonial-author">
                  <strong>María González</strong>
                  <span>Cliente desde 2010</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-text">
                  "Como estudiante Duoc, recibí mi torta de cumpleaños gratis.
                  ¡Increíble servicio!"
                </div>
                <div className="testimonial-author">
                  <strong>Carlos López</strong>
                  <span>Estudiante</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-text">
                  "50 años de calidad y sabor inigualable. ¡Siempre mi primera
                  opción!"
                </div>
                <div className="testimonial-author">
                  <strong>Ana Martínez</strong>
                  <span>Cliente frecuente</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿Listo para Endulzar tu Vida?</h2>
              <p>
                Descubre nuestra amplia variedad de productos y benefíciate de
                nuestras promociones exclusivas
              </p>
              <div className="cta-buttons">
                <Link to="/productos" className="cta-btn primary">
                  Ver Productos
                </Link>
                <button className="cta-btn secondary">Contactar</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
