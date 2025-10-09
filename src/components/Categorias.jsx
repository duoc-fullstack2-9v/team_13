import React from "react";
import { Link } from "react-router-dom";
import "../styles/Categorias.css";

const Categorias = ({ categorias, categoriaActiva, onCategoriaChange }) => {
  return (
    <div className="categorias">
      <h2>Nuestras Categorías</h2>
      <div className="categorias-grid">
        {categorias.map((categoria) => (
          <Link
            key={categoria.id}
            to={
              categoria.id === "todos"
                ? "/productos"
                : `/productos/${categoria.id}`
            }
            className={`categoria-card ${
              categoriaActiva === categoria.id ? "activa" : ""
            }`}
            onClick={() => onCategoriaChange(categoria.id)}
          >
            <div className="categoria-icon">{categoria.icono}</div>
            <h3>{categoria.nombre}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categorias;
