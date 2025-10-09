import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carrusel from "../components/Carrusel";
import Categorias from "../components/Categorias";
import ProductCard from "../components/ProductCard";
import { productos, categorias } from "../data/productos";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  // Mostrar solo 6 productos en el landing
  const productosDestacados =
    categoriaActiva === "todos"
      ? productos.slice(0, 6)
      : productos
          .filter((producto) => producto.categoriaId === categoriaActiva)
          .slice(0, 6);

  return (
    <div className="landing-page">
      <Header />

      <main>
        <section id="inicio" className="hero-section">
          <Carrusel />
        </section>

        <section id="categorias" className="categorias-section">
          <div className="container">
            <Categorias
              categorias={categorias}
              categoriaActiva={categoriaActiva}
              onCategoriaChange={setCategoriaActiva}
            />
          </div>
        </section>

        <section id="productos" className="productos-section">
          <div className="container">
            <div className="section-header">
              <h2>Productos Destacados</h2>
              <p>Una selección de nuestras delicias más populares</p>
              <Link to="/productos" className="ver-todos-btn">
                Ver Todos los Productos →
              </Link>
            </div>
            <div className="productos-grid">
              {productosDestacados.map((producto) => (
                <ProductCard key={producto.codigo} producto={producto} />
              ))}
            </div>
          </div>
        </section>

        <section id="nosotros" className="about-section">
          <div className="container">
            <h2>50 Años de Tradición Dulce</h2>
            <div className="about-content">
              <div className="about-text">
                <p>
                  Desde 1974, Pastelería Mil Sabores ha sido un referente en la
                  repostería chilena, creando momentos inolvidables a través de
                  nuestros productos de alta calidad.
                </p>
                <p>
                  En 1995, alcanzamos un hito histórico al colaborar en la
                  creación de la torta más grande del mundo, estableciendo un
                  récord Guinness que nos llena de orgullo.
                </p>
                <p>
                  Hoy, renovamos nuestro compromiso con la excelencia,
                  ofreciendo una experiencia de compra moderna mientras
                  mantenemos nuestras raíces tradicionales.
                </p>
              </div>
              <div className="about-image">
                <img src="/images/about.jpg" alt="Nuestra historia" />
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
