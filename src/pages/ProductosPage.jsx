import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Categorias from "../components/Categorias";
import ProductCard from "../components/ProductCard";
import apiService from "../services/apiService";
import "../styles/ProductosPage.css";

const ProductosPage = () => {
  const { categoria } = useParams();
  const [categoriaActiva, setCategoriaActiva] = useState(categoria || "todos");
  const [productos, setProductos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    setCategoriaActiva(categoria || "todos");
  }, [categoria]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getProducts();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      const categoriesWithAll = [
        { id: "todos", nombre: "Todos los Productos" },
        ...data.map(cat => ({ id: cat, nombre: cat.replace(/_/g, ' ') }))
      ];
      setCategories(categoriesWithAll);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const productosFiltrados = productos.filter(producto => {
    return categoriaActiva === "todos" || producto.categoria === categoriaActiva;
  });

  const categoriaNombre =
    categories.find((cat) => cat.id === categoriaActiva)?.nombre ||
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
            <h2 className="categorias-title">Nuestras Categorías</h2>
            <Categorias
              categorias={categories}
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
                {productosFiltrados.length} productos disponibles
              </p>
            </div>

            {error && (
              <div className="error-message">
                {error}
                <button onClick={() => setError(null)}>×</button>
              </div>
            )}

            {isLoading ? (
              <div className="loading-products">
                <div className="spinner"></div>
                <p>Cargando productos...</p>
              </div>
            ) : productosFiltrados.length > 0 ? (
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
