import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/NosotrosPage.css";

const NosotrosPage = () => {
  return (
    <div className="nosotros-page">
      <Header />
      
      <main className="nosotros-main">
        <section className="nosotros-hero">
          <div className="container">
            <h1>Nuestra Historia</h1>
            <p>50 años endulzando vidas con tradición y calidad</p>
          </div>
        </section>

        <section className="historia-section">
          <div className="container">
            <div className="historia-content">
              <div className="historia-text">
                <h2>Pastelería Mil Sabores</h2>
                <p>
                  Desde 1974, hemos sido parte de las celebraciones más importantes 
                  de nuestros clientes. Lo que comenzó como un pequeño negocio familiar, 
                  se ha convertido en una tradición de excelencia y sabor.
                </p>
                <p>
                  Nuestro compromiso con la calidad nos ha llevado a usar solo los 
                  mejores ingredientes, manteniendo recetas tradicionales que han 
                  pasado de generación en generación.
                </p>
                <p>
                  Cada torta, cada pan dulce, cada delicia que sale de nuestro horno 
                  lleva el amor y la dedicación de más de cinco décadas de experiencia.
                </p>
              </div>
              <div className="historia-image">
                <div className="image-placeholder">
                  <span>🏪</span>
                  <p>Nuestra panadería desde 1974</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="valores-section">
          <div className="container">
            <h2>Nuestros Valores</h2>
            <div className="valores-grid">
              <div className="valor-card">
                <div className="valor-icon">👨‍👩‍👧‍👦</div>
                <h3>Tradición Familiar</h3>
                <p>Recetas transmitidas de generación en generación con el mismo amor de siempre.</p>
              </div>
              <div className="valor-card">
                <div className="valor-icon">🌟</div>
                <h3>Calidad Premium</h3>
                <p>Utilizamos solo los mejores ingredientes para garantizar sabores excepcionales.</p>
              </div>
              <div className="valor-card">
                <div className="valor-icon">❤️</div>
                <h3>Pasión por el Detalle</h3>
                <p>Cada producto es elaborado con dedicación y cuidado artesanal.</p>
              </div>
              <div className="valor-card">
                <div className="valor-icon">🎂</div>
                <h3>Momentos Especiales</h3>
                <p>Creamos dulces recuerdos para las celebraciones más importantes.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="equipo-section">
          <div className="container">
            <h2>Nuestro Equipo</h2>
            <p className="equipo-intro">
              Un equipo apasionado de maestros pasteleros y artesanos dedicados 
              a crear experiencias dulces inolvidables.
            </p>
            <div className="equipo-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Años de experiencia</span>
              </div>
              <div className="stat">
                <span className="stat-number">15</span>
                <span className="stat-label">Maestros pasteleros</span>
              </div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Clientes satisfechos</span>
              </div>
              <div className="stat">
                <span className="stat-number">365</span>
                <span className="stat-label">Días al año creando</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NosotrosPage;