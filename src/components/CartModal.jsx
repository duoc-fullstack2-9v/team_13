import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import LoginForm from './LoginForm';
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
    isLoading,
    error,
    clearError 
  } = useCart();
  
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCreateOrder = async () => {
    if (items.length === 0) return;
    
    // Si no hay usuario logueado, mostrar opciones
    if (!user) {
      setShowGuestForm(true);
      return;
    }
    
    setIsProcessing(true);
    try {
      const order = await createOrder(discount);
      setOrderSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Error al crear el pedido: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGuestOrder = async () => {
    if (!guestInfo.nombre || !guestInfo.email || !guestInfo.telefono) {
      showError('Por favor completa todos los campos requeridos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestInfo.email)) {
      showError('Por favor ingresa un email válido');
      return;
    }

    setIsProcessing(true);
    try {
      const order = await createOrder(discount, guestInfo);
      setOrderSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating guest order:', error);
      showError('Error al crear el pedido: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Modal de login
  if (showLogin) {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <LoginForm 
          onSuccess={() => {
            setShowLogin(false);
            // El pedido se creará automáticamente después del login
          }}
          onError={(error) => {
            console.error('Error en login:', error);
          }}
          onClose={() => setShowLogin(false)}
        />
      </div>
    );
  }

  // Modal de información de invitado
  if (showGuestForm) {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="cart-modal guest-form-modal">
          <div className="guest-form-header">
            <h3>📝 Información para tu pedido</h3>
            <button className="close-btn" onClick={() => setShowGuestForm(false)}>×</button>
          </div>
          
          <div className="guest-form-content">
            <p className="guest-form-description">
              Para procesar tu pedido necesitamos algunos datos básicos:
            </p>
            
            <div className="form-group">
              <label>Nombre completo *</label>
              <input
                type="text"
                value={guestInfo.nombre}
                onChange={(e) => handleGuestInfoChange('nombre', e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={guestInfo.email}
                onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                value={guestInfo.telefono}
                onChange={(e) => handleGuestInfoChange('telefono', e.target.value)}
                placeholder="9 1234 5678"
                required
              />
            </div>
            
            <div className="guest-form-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowLogin(true)}
                disabled={isProcessing}
              >
                🔐 Iniciar Sesión
              </button>
              
              <button 
                className="btn-primary"
                onClick={handleGuestOrder}
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : '🛒 Confirmar Pedido'}
              </button>
            </div>
            
            <p className="guest-form-note">
              💡 Si ya tienes cuenta, <button 
                className="link-btn" 
                onClick={() => setShowLogin(true)}
              >
                inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button className="error-close" onClick={clearError}>×</button>
            </div>
          )}
          
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
                      <img 
                        src={`/images/productos/${item.producto.codigo}.jpg`} 
                        alt={item.producto.nombre}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="placeholder-image" style={{display: 'none'}}>
                        <span>🍰</span>
                      </div>
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
                    ) : user ? (
                      '🛒 Confirmar Pedido'
                    ) : (
                      '🛒 Continuar Pedido'
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