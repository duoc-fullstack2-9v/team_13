import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAlert } from "../contexts/AlertContext";
import "../styles/ProductCard.css";

const ProductCard = ({ producto }) => {
  const { addToCart } = useCart();
  const { showAlert } = useAlert();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (producto.stock <= 0) {
      showAlert('Este producto no tiene stock disponible', 'error');
      return;
    }

    setIsAdding(true);
    try {
      const success = await addToCart(producto, 1);
      if (success !== false) {
        setShowSuccess(true);
        showAlert(`${producto.nombre} agregado al carrito`, 'success');
        setTimeout(() => setShowSuccess(false), 2000);
      }
      // Si addToCart retorna false, ya se mostró el error en CartContext
    } catch (error) {
      console.error('Error adding to cart:', error);
      showAlert('Error al agregar producto al carrito', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toLocaleString() : price;
  };

  const isOutOfStock = producto.stock <= 0;
  const isLowStock = producto.stock <= 5 && producto.stock > 0;

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="product-image">
        <img
          src={`/images/productos/${producto.codigo}.jpg`}
          alt={producto.nombre}
          onError={(e) => {
            e.target.src = "/images/productos/default.jpg";
          }}
        />
        {isOutOfStock && (
          <div className="stock-overlay">
            <span>Agotado</span>
          </div>
        )}
        {isLowStock && (
          <div className="low-stock-badge">
            ¡Últimas {producto.stock} unidades!
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{producto.nombre}</h3>
        <p className="product-category">{producto.categoria?.replace(/_/g, ' ')}</p>
        <p className="product-description">{producto.descripcion}</p>
        
        <div className="product-details">
          <div className="product-price">
            <span className="price">${formatPrice(producto.precio)}</span>
          </div>
          <div className="product-stock">
            <span className={`stock-info ${isLowStock ? 'low-stock' : ''}`}>
              Stock: {producto.stock}
            </span>
          </div>
        </div>

        <button 
          className={`add-to-cart-btn ${showSuccess ? 'success' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
        >
          {showSuccess ? (
            <>
              <span className="success-icon">✓</span>
              ¡Agregado!
            </>
          ) : isAdding ? (
            <>
              <div className="spinner-small"></div>
              Agregando...
            </>
          ) : isOutOfStock ? (
            'Sin Stock'
          ) : (
            <>
              <span className="cart-icon">🛒</span>
              Añadir al Carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
