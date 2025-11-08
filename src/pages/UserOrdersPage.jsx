import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import apiService from '../services/apiService';
import '../styles/UserOrders.css';

const UserOrdersPage = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Verificar autenticación
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadUserOrders();
  }, [user]);

  const loadUserOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userOrders = await apiService.getOrdersByUser(user.email);
      setOrders(userOrders.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)));
    } catch (err) {
      setError('Error al cargar los pedidos: ' + err.message);
      console.error('Error loading user orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDIENTE': return '#ffc107';
      case 'CONFIRMADO': return '#17a2b8';
      case 'EN_PREPARACION': return '#fd7e14';
      case 'LISTO': return '#28a745';
      case 'ENTREGADO': return '#6f42c1';
      case 'CANCELADO': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'CONFIRMADO': return 'Confirmado';
      case 'EN_PREPARACION': return 'En Preparación';
      case 'LISTO': return 'Listo para Retirar';
      case 'ENTREGADO': return 'Entregado';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="user-orders-page">
      <Header />
      <div className="container">
        <div className="header-section">
          <h1>Mis Pedidos</h1>
          <p className="subtitle">Historial de todos tus pedidos en Pastelería Mil Sabores</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando tus pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📋</div>
            <h3>No tienes pedidos aún</h3>
            <p>¡Explora nuestros deliciosos productos y haz tu primer pedido!</p>
            <a href="/productos" className="btn-explore">Ver Productos</a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order.id}</h3>
                    <p className="order-date">{formatDate(order.fechaCreacion)}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.estado) }}
                    >
                      {getStatusText(order.estado)}
                    </span>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="order-items">
                    <h4>Productos ({order.items?.length || 0} items):</h4>
                    {order.items && order.items.length > 0 ? (
                      <div className="items-list">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span className="item-quantity">{item.cantidad}x</span>
                            <span className="item-name">{item.producto?.nombre || 'Producto'}</span>
                            <span className="item-price">${(item.subtotal || 0).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-items">No hay items disponibles</p>
                    )}
                  </div>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>${(order.total + (order.descuento || 0)).toLocaleString()}</span>
                    </div>
                    {order.descuento > 0 && (
                      <div className="total-row discount">
                        <span>Descuento:</span>
                        <span>-${order.descuento.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="total-row final">
                      <span>Total:</span>
                      <span>${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {order.notas && (
                  <div className="order-notes">
                    <strong>Notas:</strong> {order.notas}
                  </div>
                )}

                <div className="order-actions">
                  <button 
                    className="btn-view-details"
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  >
                    {selectedOrder === order.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                  </button>
                  
                  {order.estado === 'PENDIENTE' && (
                    <button className="btn-cancel-order">
                      Cancelar Pedido
                    </button>
                  )}
                </div>

                {selectedOrder === order.id && (
                  <div className="order-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <strong>Cliente:</strong>
                        <span>{order.clienteEmail}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Estado:</strong>
                        <span>{getStatusText(order.estado)}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Fecha de Creación:</strong>
                        <span>{formatDate(order.fechaCreacion)}</span>
                      </div>
                      {order.fechaEntrega && (
                        <div className="detail-item">
                          <strong>Fecha de Entrega:</strong>
                          <span>{formatDate(order.fechaEntrega)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;