import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartModal from './CartModal';
import '../styles/CartIcon.css';

const CartIcon = () => {
  const { totalItems, error, clearError } = useCart();
  const { user } = useAuth();
  const [showCartModal, setShowCartModal] = useState(false);

  if (!user) {
    return null; // No mostrar carrito si no hay usuario autenticado
  }

  const handleCartClick = () => {
    if (error) {
      clearError();
    }
    setShowCartModal(true);
  };

  return (
    <>
      <div className="cart-icon-container" onClick={handleCartClick}>
        <div className="cart-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="m1 1 4 4 7 7-4 4h9l4-4V8l-4-4H7L3 0H1z" />
            <path d="M7 8h13l-1 8H8l-1-8z" />
          </svg>
          
          {totalItems > 0 && (
            <span className={`cart-counter ${totalItems > 9 ? 'double-digit' : ''}`}>
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </div>
        
        <span className="cart-text">Carrito</span>
      </div>

      {error && (
        <div className="cart-error-toast">
          <p>{error}</p>
          <button onClick={clearError}>×</button>
        </div>
      )}

      {showCartModal && (
        <CartModal onClose={() => setShowCartModal(false)} />
      )}
    </>
  );
};

export default CartIcon;