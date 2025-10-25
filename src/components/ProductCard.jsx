import React from "react";
import "../styles/ProductCard.css";

const ProductCard = ({ producto, showEditOptions }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={`images/productos/${producto.codigo}.jpg`}
          alt={producto.nombre}
          //onError={(e) => {
         //   e.target.src = "/images/productos/default.jpg";
         // }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{producto.nombre}</h3>
        <p className="product-category">{producto.categoria}</p>
        <p className="product-description">{producto.descripcion}</p>
        <div className="product-price">
          <span className="price">{producto.precio}</span>
        </div>
        <button className="add-to-cart-btn">Añadir al Carrito</button>
        {showEditOptions && (
          <div className="admin-actions">
            <button className="edit-btn">Editar</button>
            <button className="delete-btn">Eliminar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
