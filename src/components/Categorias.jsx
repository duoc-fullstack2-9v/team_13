import React from "react";
import { Link } from "react-router-dom";
import "../styles/Categorias.css";

const getCategoryIcon = (categoryId) => {
  const icons = {
    'todos': '🍰',
    'TORTAS_CUADRADAS': '⬜',
    'TORTAS_CIRCULARES': '⭕',
    'POSTRES_INDIVIDUALES': '🧁',
    'PRODUCTOS_SIN_AZUCAR': '🚫',
    'PASTELERIA_TRADICIONAL': '🥖',
    'PRODUCTOS_SIN_GLUTEN': '🌾',
    'PRODUCTOS_VEGANA': '🌱',
    'TORTAS_ESPECIALES': '✨'
  };
  return icons[categoryId] || '🍰';
};

const Categorias = ({ categorias, categoriaActiva, onCategoriaChange }) => {
  const handleCategoryClick = (e, categoryId) => {
    e.preventDefault();
    onCategoriaChange(categoryId);
  };

  return (
    <div className="categorias">
      <h2>Nuestras Categorías</h2>
      <div className="categorias-grid">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className={`categoria-card ${
              categoriaActiva === categoria.id ? "activa" : ""
            }`}
            onClick={(e) => handleCategoryClick(e, categoria.id)}
          >
            <div className="categoria-icon">{getCategoryIcon(categoria.id)}</div>
            <h3>{categoria.nombre}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorias;
