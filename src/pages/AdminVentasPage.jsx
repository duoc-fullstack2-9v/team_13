import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import apiService from '../services/apiService';
import '../styles/AdminPages.css';

const AdminVentasPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    todaySales: 0,
    monthSales: 0,
    avgSale: 0
  });
  const [filters, setFilters] = useState({
    estado: '',
    metodoPago: '',
    cliente: '',
    fechaDesde: '',
    fechaHasta: '',
    montoMinimo: '',
    montoMaximo: ''
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
    loadSales();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [sales, filters]);

  const loadSales = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getAllSales();
      setSales(data);
      setError(null);
    } catch (error) {
      console.error('Error loading sales:', error);
      setError('Error al cargar ventas: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sales];

    if (filters.estado) {
      filtered = filtered.filter(sale => sale.estado === filters.estado);
    }

    if (filters.metodoPago) {
      filtered = filtered.filter(sale => sale.metodoPago === filters.metodoPago);
    }

    if (filters.cliente) {
      filtered = filtered.filter(sale => 
        (sale.cliente || '').toLowerCase().includes(filters.cliente.toLowerCase())
      );
    }

    if (filters.fechaDesde) {
      filtered = filtered.filter(sale => 
        new Date(sale.fecha) >= new Date(filters.fechaDesde)
      );
    }

    if (filters.fechaHasta) {
      filtered = filtered.filter(sale => 
        new Date(sale.fecha) <= new Date(filters.fechaHasta)
      );
    }

    if (filters.montoMinimo) {
      filtered = filtered.filter(sale => 
        (sale.total || 0) >= parseFloat(filters.montoMinimo)
      );
    }

    if (filters.montoMaximo) {
      filtered = filtered.filter(sale => 
        (sale.total || 0) <= parseFloat(filters.montoMaximo)
      );
    }

    setFilteredSales(filtered);
  };

  const calculateStats = () => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const todaySales = sales.filter(sale => 
      new Date(sale.fecha).toDateString() === today.toDateString()
    );
    
    const monthSales = sales.filter(sale => 
      new Date(sale.fecha) >= thisMonth
    );

    const totalAmount = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const todayAmount = todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const monthAmount = monthSales.reduce((sum, sale) => sum + (sale.total || 0), 0);

    setStats({
      totalSales: totalAmount,
      todaySales: todayAmount,
      monthSales: monthAmount,
      avgSale: sales.length > 0 ? totalAmount / sales.length : 0
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
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
      'COMPLETADA': '#28a745',
      'PENDIENTE': '#ffc107',
      'CANCELADA': '#dc3545',
      'REEMBOLSADA': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusOptions = () => [
    'COMPLETADA',
    'PENDIENTE',
    'CANCELADA',
    'REEMBOLSADA'
  ];

  const getPaymentMethods = () => [
    'EFECTIVO',
    'TARJETA_CREDITO',
    'TARJETA_DEBITO',
    'TRANSFERENCIA',
    'WEBPAY'
  ];

  if (isLoading) {
    return (
      <div className="admin-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando ventas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Header />
      
      <div className="admin-content">
        <div className="page-header">
          <h1>💰 Gestión de Ventas</h1>
          <p>Administra y analiza todas las ventas de la pastelería</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Estadísticas principales */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>{formatCurrency(stats.totalSales)}</h3>
                <p>Ventas Totales</p>
              </div>
            </div>
            <div className="stat-card today">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>{formatCurrency(stats.todaySales)}</h3>
                <p>Ventas Hoy</p>
              </div>
            </div>
            <div className="stat-card month">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{formatCurrency(stats.monthSales)}</h3>
                <p>Ventas Este Mes</p>
              </div>
            </div>
            <div className="stat-card average">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <h3>{formatCurrency(stats.avgSale)}</h3>
                <p>Venta Promedio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-header">
            <h3>
              💰 Filtros de Ventas
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
              <label>Estado de Venta</label>
              <select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="">✨ Todos los estados</option>
                {getStatusOptions().map(status => (
                  <option key={status} value={status}>
                    {status === 'COMPLETADA' ? '✅ Completada' :
                     status === 'CANCELADA' ? '❌ Cancelada' :
                     status === 'PENDIENTE' ? '⏳ Pendiente' :
                     status === 'PROCESANDO' ? '⚙️ Procesando' :
                     status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Método de Pago</label>
              <select
                value={filters.metodoPago}
                onChange={(e) => handleFilterChange('metodoPago', e.target.value)}
              >
                <option value="">💳 Todos los métodos</option>
                {getPaymentMethods().map(method => (
                  <option key={method} value={method}>
                    {method === 'EFECTIVO' ? '💵 Efectivo' :
                     method === 'TARJETA_CREDITO' ? '💳 Tarjeta de Crédito' :
                     method === 'TARJETA_DEBITO' ? '💳 Tarjeta de Débito' :
                     method === 'TRANSFERENCIA' ? '🏦 Transferencia' :
                     method === 'PAYPAL' ? '🟦 PayPal' :
                     method.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Buscar Cliente</label>
              <input
                type="text"
                placeholder="Nombre o email del cliente..."
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

            <div className="filter-group">
              <label>Monto Mínimo</label>
              <input
                type="number"
                placeholder="$ Monto mínimo"
                value={filters.montoMinimo}
                onChange={(e) => handleFilterChange('montoMinimo', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Monto Máximo</label>
              <input
                type="number"
                placeholder="$ Monto máximo"
                value={filters.montoMaximo}
                onChange={(e) => handleFilterChange('montoMaximo', e.target.value)}
              />
            </div>
          </div>

          <div className="filters-actions">
            <button 
              className="btn-secondary"
              onClick={() => setFilters({ 
                estado: '', metodoPago: '', cliente: '', 
                fechaDesde: '', fechaHasta: '', montoMinimo: '', montoMaximo: '' 
              })}
            >
              Limpiar Filtros
            </button>
            <span className="results-count">
              {filteredSales.length} ventas encontradas
            </span>
          </div>
            </div>
          )}
        </div>

        {/* Tabla de ventas */}
        <div className="data-table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Método de Pago</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <span className="empty-icon">💰</span>
                      <p>No hay ventas que coincidan con los filtros</p>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map(sale => (
                    <tr key={sale.id}>
                      <td>#{sale.id}</td>
                      <td>{formatDate(sale.fecha)}</td>
                      <td>{sale.cliente || 'N/A'}</td>
                      <td className="amount">{formatCurrency(sale.total)}</td>
                      <td>{(sale.metodoPago || '').replace('_', ' ')}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(sale.estado) }}
                        >
                          {(sale.estado || '').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className="btn-primary btn-sm"
                          onClick={() => {
                            setSelectedSale(sale);
                            setShowModal(true);
                          }}
                        >
                          👁️ Ver
                        </button>
                        <button 
                          className="btn-secondary btn-sm"
                          onClick={() => window.print()}
                        >
                          🖨️ Imprimir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen por método de pago */}
        <div className="payment-summary">
          <h3>Resumen por Método de Pago</h3>
          <div className="payment-stats">
            {getPaymentMethods().map(method => {
              const methodSales = filteredSales.filter(sale => sale.metodoPago === method);
              const methodTotal = methodSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
              
              if (methodSales.length === 0) return null;
              
              return (
                <div key={method} className="payment-stat">
                  <span className="payment-method">{method.replace('_', ' ')}</span>
                  <span className="payment-count">{methodSales.length} ventas</span>
                  <span className="payment-total">{formatCurrency(methodTotal)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal para ver venta */}
      {showModal && selectedSale && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Venta #{selectedSale.id}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="sale-details">
                <div className="detail-group">
                  <strong>Fecha:</strong> {formatDate(selectedSale.fecha)}
                </div>
                <div className="detail-group">
                  <strong>Cliente:</strong> {selectedSale.cliente || 'N/A'}
                </div>
                <div className="detail-group">
                  <strong>Total:</strong> {formatCurrency(selectedSale.total)}
                </div>
                <div className="detail-group">
                  <strong>Método de Pago:</strong> {(selectedSale.metodoPago || '').replace('_', ' ')}
                </div>
                <div className="detail-group">
                  <strong>Estado:</strong> 
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedSale.estado), marginLeft: '10px' }}
                  >
                    {(selectedSale.estado || '').replace('_', ' ')}
                  </span>
                </div>
                
                {selectedSale.items && (
                  <div className="detail-group">
                    <strong>Items de la Venta:</strong>
                    <div className="items-list">
                      {selectedSale.items.map((item, index) => (
                        <div key={index} className="item-detail">
                          <span>{item.nombre} x{item.cantidad}</span>
                          <span>{formatCurrency(item.precio * item.cantidad)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSale.notas && (
                  <div className="detail-group">
                    <strong>Notas:</strong>
                    <p>{selectedSale.notas}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVentasPage;