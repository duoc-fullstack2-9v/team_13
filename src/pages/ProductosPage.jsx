import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Categorias from "../components/Categorias";
import ProductCard from "../components/ProductCard";
import { productos, categorias } from "../data/productos";
import "../styles/ProductosPage.css";

const ProductosPage = () => {
  const { categoria } = useParams();
  const [categoriaActiva, setCategoriaActiva] = useState(categoria || "todos");

  const productosFiltrados =
    categoriaActiva === "todos"
      ? productos
      : productos.filter(
          (producto) => producto.categoriaId === categoriaActiva
        );

  const categoriaNombre =
    categorias.find((cat) => cat.id === categoriaActiva)?.nombre ||
    "Todos los Productos";

  return (
    <div className="productos-page">
      <Header />

      <main className="productos-main">
        <section className="productos-hero">
          <div className="container">
            <h1>Nuestros Productos</h1>
            <p>Descubre la dulzura de nuestros 50 años de tradición</p>
          </div>
        </section>

        <section className="categorias-section">
          <div className="container">
            <Categorias
              categorias={categorias}
              categoriaActiva={categoriaActiva}
              onCategoriaChange={setCategoriaActiva}
            />
          </div>
        </section>

        <section className="productos-grid-section">
          <div className="container">
            <div className="section-header">
              <h2>{categoriaNombre}</h2>
              <p className="productos-count">
                {productosFiltrados.length} productos encontrados
              </p>
            </div>

            {productosFiltrados.length > 0 ? (
              <div className="productos-grid">
                {productosFiltrados.map((producto) => (
                  <ProductCard key={producto.codigo} producto={producto} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No hay productos en esta categoría</h3>
                <p>
                  Prueba con otra categoría o vuelve a "Todos los productos"
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿No encuentras lo que buscas?</h2>
              <p>Contáctanos para pedidos personalizados y tortas especiales</p>
              <button className="cta-button">Solicitar Presupuesto</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductosPage;
