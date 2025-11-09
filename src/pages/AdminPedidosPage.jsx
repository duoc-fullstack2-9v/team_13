import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import apiService from '../services/apiService';
import '../styles/AdminPages.css';

const AdminPedidosPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: '',
    cliente: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // Lista de emails admin temporales (para desarrollo)
  const adminEmails = [
    'sebastianemerson21@gmail.com',
    'admin@pasteleria.com',
    'test@admin.com'
  ];

  // Verificar autenticación y permisos de admin
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Verificar admin - método múltiple para mayor compatibilidad
  const isUserAdmin = isAdmin || 
                     user?.userType === 'admin' || 
                     adminEmails.includes(user?.email);

  if (!isUserAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getAllOrders();
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Error al cargar pedidos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (filters.estado) {
      filtered = filtered.filter(order => order.estado === filters.estado);
    }

    if (filters.cliente) {
      filtered = filtered.filter(order => 
        (order.cliente || order.email || '').toLowerCase().includes(filters.cliente.toLowerCase())
      );
    }

    if (filters.fechaDesde) {
      filtered = filtered.filter(order => 
        new Date(order.fechaPedido) >= new Date(filters.fechaDesde)
      );
    }

    if (filters.fechaHasta) {
      filtered = filtered.filter(order => 
        new Date(order.fechaPedido) <= new Date(filters.fechaHasta)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
      setShowModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error al actualizar estado del pedido');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-CL');
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDIENTE': '#ffc107',
      'EN_PREPARACION': '#17a2b8',
      'LISTO': '#28a745',
      'ENTREGADO': '#6c757d',
      'CANCELADO': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };



  const getStatusOptions = () => [
    'PENDIENTE',
    'EN_PREPARACION',
    'LISTO',
    'ENTREGADO',
    'CANCELADO'
  ];

  if (isLoading) {
    return (
      <div className="admin-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Header />
      
      <div className="admin-content">
        <div className="page-header">
          <h1>📋 Gestión de Pedidos</h1>
          <p>Administra todos los pedidos de la pastelería</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}



        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-header">
            <h3>
              🔍 Filtros de Búsqueda
            </h3>
            <button 
              className={`filters-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? '🔼' : '🔽'}
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
          </div>
          {showFilters && (
            <div className="filters-content">
              <div className="filters-grid">
            <div className="filter-group">
              <label>Estado del Pedido</label>
              <select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="">✨ Todos los estados</option>
                {getStatusOptions().map(status => (
                  <option key={status} value={status}>
                    {status === 'PENDIENTE' ? '⏳ Pendiente' :
                     status === 'EN_PREPARACION' ? '👨‍🍳 En Preparación' :
                     status === 'LISTO' ? '✅ Listo' :
                     status === 'ENTREGADO' ? '🚚 Entregado' :
                     status === 'CANCELADO' ? '❌ Cancelado' :
                     status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Buscar Cliente</label>
              <input
                type="text"
                placeholder="Nombre del cliente o email..."
                value={filters.cliente}
                onChange={(e) => handleFilterChange('cliente', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Fecha Desde</label>
              <input
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Fecha Hasta</label>
              <input
                type="date"
                value={filters.fechaHasta}
                onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
              />
            </div>
          </div>

          <div className="filters-actions">
            <button 
              className="btn-secondary"
              onClick={() => setFilters({ estado: '', cliente: '', fechaDesde: '', fechaHasta: '' })}
            >
              Limpiar Filtros
            </button>
            <span className="results-count">
              {filteredOrders.length} pedidos encontrados
            </span>
          </div>
            </div>
          )}
        </div>

        {/* Tabla de pedidos */}
        <div className="data-table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Items</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <span className="empty-icon">📋</span>
                      <p>No hay pedidos que coincidan con los filtros</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.cliente || order.email}</td>
                      <td>{formatDate(order.fechaPedido)}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.estado) }}
                        >
                          {(order.estado || '').replace('_', ' ')}
                        </span>
                      </td>
                      <td>{order.items?.length || 0} items</td>
                      <td className="actions">
                        <button 
                          className="btn-primary btn-sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                        >
                          👁️ Ver
                        </button>
                        <button 
                          className="btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                        >
                          ✏️ Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Pedidos:</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pendientes:</span>
              <span className="stat-value">
                {orders.filter(o => o.estado === 'PENDIENTE').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">En Preparación:</span>
              <span className="stat-value">
                {orders.filter(o => o.estado === 'EN_PREPARACION').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Listos:</span>
              <span className="stat-value">
                {orders.filter(o => o.estado === 'LISTO').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para ver/editar pedido */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pedido #{selectedOrder.id}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="order-details">
                <div className="detail-group">
                  <strong>Cliente:</strong> {selectedOrder.cliente || selectedOrder.email}
                </div>
                <div className="detail-group">
                  <strong>Fecha:</strong> {formatDate(selectedOrder.fechaPedido)}
                </div>
                <div className="detail-group">
                  <strong>Total:</strong> {formatCurrency(selectedOrder.total)}
                </div>
                <div className="detail-group">
                  <strong>Estado Actual:</strong> 
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedOrder.estado), marginLeft: '10px' }}
                  >
                    {(selectedOrder.estado || '').replace('_', ' ')}
                  </span>
                </div>
                
                {selectedOrder.items && (
                  <div className="detail-group">
                    <strong>Items del Pedido:</strong>
                    <div className="items-list">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="item-detail">
                          <span>{item.nombre} x{item.cantidad}</span>
                          <span>{formatCurrency(item.precio * item.cantidad)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="status-update">
                <strong>Cambiar Estado:</strong>
                <div className="status-buttons">
                  {getStatusOptions().map(status => (
                    <button
                      key={status}
                      className={`status-btn ${selectedOrder.estado === status ? 'active' : ''}`}
                      style={{ backgroundColor: getStatusColor(status) }}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPedidosPage;