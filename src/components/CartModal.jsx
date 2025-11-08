import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/CartModal.css';

const CartModal = ({ onClose }) => {
  const { 
    items, 
    totalPrice, 
    totalItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    createOrder,
    getTotalWithDiscount,
    isLoading 
  } = useCart();
  
  const { user } = useAuth();
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCreateOrder = async () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    try {
      const order = await createOrder(discount);
      setOrderSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (orderSuccess) {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="cart-modal success-modal">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h3>¡Pedido Creado Exitosamente!</h3>
            <p>Tu pedido ha sido registrado y está siendo procesado.</p>
            <p>Recibirás una confirmación pronto.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="cart-modal">
        <div className="cart-header">
          <h2>
            🛒 Mi Carrito 
            {totalItems > 0 && <span className="item-count">({totalItems} productos)</span>}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Tu carrito está vacío</h3>
              <p>¡Agrega algunos productos deliciosos!</p>
              <button className="btn-continue-shopping" onClick={onClose}>
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.producto.id} className="cart-item">
                    <div className="item-image">
                      {item.producto.imagenUrl ? (
                        <img src={item.producto.imagenUrl} alt={item.producto.nombre} />
                      ) : (
                        <div className="placeholder-image">
                          <span>📰</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="item-details">
                      <h4>{item.producto.nombre}</h4>
                      <p className="item-category">{item.producto.categoria}</p>
                      <p className="item-price">${item.producto.precio.toLocaleString()}</p>
                    </div>
                    
                    <div className="item-quantity">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.producto.id, item.cantidad - 1)}
                      >
                        -
                      </button>
                      <span className="quantity-number">{item.cantidad}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.producto.id, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="item-total">
                      <p className="subtotal">${(item.producto.precio * item.cantidad).toLocaleString()}</p>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.producto.id)}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="discount-section">
                  <label htmlFor="discount">Descuento (opcional):</label>
                  <div className="discount-input">
                    <span className="currency">$</span>
                    <input
                      type="number"
                      id="discount"
                      min="0"
                      max={totalPrice}
                      value={discount}
                      onChange={(e) => setDiscount(Math.min(parseFloat(e.target.value) || 0, totalPrice))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="notes-section">
                  <label htmlFor="notes">Notas del pedido (opcional):</label>
                  <textarea
                    id="notes"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instrucciones especiales, alergias, etc..."
                  />
                </div>

                <div className="total-breakdown">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="total-row discount-row">
                      <span>Descuento:</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="total-row final-total">
                    <span>Total:</span>
                    <span>${getTotalWithDiscount(discount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button 
                    className="btn-clear-cart"
                    onClick={clearCart}
                    disabled={isProcessing}
                  >
                    Vaciar Carrito
                  </button>
                  <button 
                    className="btn-create-order"
                    onClick={handleCreateOrder}
                    disabled={isProcessing || items.length === 0}
                  >
                    {isProcessing ? (
                      <>
                        <div className="spinner"></div>
                        Procesando...
                      </>
                    ) : (
                      'Confirmar Pedido'
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;