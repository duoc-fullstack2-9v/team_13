import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import apiService from '../services/apiService';
import firebaseUserService from '../services/firebaseUserService';
import UserManagement from '../components/admin/UserManagement';
import ProductManagement from '../components/admin/ProductManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({
    products: [],
    orders: [],
    users: [],
    sales: [],
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      totalSales: 0,
      pendingOrders: 0,
      totalUsers: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingType, setEditingType] = useState(null); // 'order', 'user', 'sale'
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSubmittingSale, setIsSubmittingSale] = useState(false);
  const [saleForm, setSaleForm] = useState({
    nombreCliente: '',
    emailCliente: '',
    metodoPago: 'EFECTIVO',
    observaciones: '',
    items: [
      { productId: '', cantidad: 1, mensajePersonalizado: '' }
    ]
  });
  const paymentMethods = ['EFECTIVO', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'TRANSFERENCIA'];

  // Verificar autenticación y permisos de admin
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadAllData();
  }, []);

  // Manejar navegación por URL
  useEffect(() => {
    if (tab) {
      const validTabs = ['dashboard', 'products', 'orders', 'userManagement', 'sales', 'reports'];
      const tabMapping = {
        'productos': 'products',
        'pedidos': 'orders', 
        'mantenedor-usuarios': 'userManagement',
        'ventas': 'sales',
        'reportes': 'reports'
      };
      
      const mappedTab = tabMapping[tab] || tab;
      if (validTabs.includes(mappedTab)) {
        setActiveTab(mappedTab);
      } else {
        setActiveTab('dashboard');
      }
    } else {
      setActiveTab('dashboard');
    }
  }, [tab]);

  // Función para cambiar pestaña y actualizar URL
  const changeTab = (newTab) => {
    setActiveTab(newTab);
    const urlMapping = {
      'dashboard': '/admin',
      'products': '/admin/productos',
      'orders': '/admin/pedidos',
      'userManagement': '/admin/mantenedor-usuarios',
      'sales': '/admin/ventas',
      'reports': '/admin/reportes'
    };
    navigate(urlMapping[newTab] || '/admin');
  };

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar todos los datos en paralelo
      const [products, orders, users, sales] = await Promise.all([
        apiService.getProducts().catch(() => []),
        apiService.getAllOrders().catch(() => []),
        firebaseUserService.getAllUsers().catch(() => []),
        apiService.getAllSales().catch(() => [])
      ]);
      
      // Calcular estadísticas
      const totalSales = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const pendingOrders = orders.filter(order => {
        const status = (order.estado || '').toUpperCase();
        return status && !['ENTREGADO', 'CANCELADO'].includes(status);
      }).length;
      
      setData({
        products,
        orders,
        users,
        sales,
        stats: {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalSales: totalSales,
          pendingOrders: pendingOrders,
          totalUsers: users.length
        }
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSaleForm = () => {
    setSaleForm({
      nombreCliente: '',
      emailCliente: '',
      metodoPago: 'EFECTIVO',
      observaciones: '',
      items: [
        { productId: '', cantidad: 1, mensajePersonalizado: '' }
      ]
    });
  };

  const handleSaleFieldChange = (field, value) => {
    setSaleForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaleItemChange = (index, field, value) => {
    setSaleForm(prev => ({
      ...prev,
      items: prev.items.map((item, idx) => 
        idx === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addSaleItem = () => {
    setSaleForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: '', cantidad: 1, mensajePersonalizado: '' }
      ]
    }));
  };

  const removeSaleItem = (index) => {
    setSaleForm(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmitDirectSale = async (event) => {
    event.preventDefault();
    setActionError(null);
    setActionMessage(null);

    const normalizedItems = saleForm.items
      .map(item => ({
        productId: Number(item.productId),
        cantidad: Math.max(1, Number(item.cantidad) || 1),
        mensajePersonalizado: item.mensajePersonalizado?.trim() || ''
      }))
      .filter(item => Number.isFinite(item.productId) && item.productId > 0)
      .map(item => ({
        productId: item.productId,
        cantidad: item.cantidad,
        ...(item.mensajePersonalizado ? { mensajePersonalizado: item.mensajePersonalizado } : {})
      }));

    if (normalizedItems.length === 0) {
      setActionError('Agrega al menos un producto válido para registrar la venta.');
      return;
    }

    setIsSubmittingSale(true);
    try {
      await apiService.createSale({
        nombreCliente: saleForm.nombreCliente.trim() || 'Cliente Mostrador',
        emailCliente: saleForm.emailCliente.trim() || undefined,
        metodoPago: saleForm.metodoPago,
        observaciones: saleForm.observaciones.trim() || undefined,
        items: normalizedItems
      });
      setActionMessage('Venta directa registrada correctamente.');
      resetSaleForm();
      await loadAllData();
    } catch (error) {
      console.error('Error creando venta directa:', error);
      setActionError('Error al registrar la venta directa: ' + (error.message || 'Inténtalo nuevamente.'));
    } finally {
      setIsSubmittingSale(false);
    }
  };

  const handleConfirmOrderStatus = async (orderId) => {
    setActionError(null);
    setActionMessage(null);
    try {
      await apiService.updateOrderStatus(orderId, 'CONFIRMADO');
      setActionMessage(`Pedido #${orderId} confirmado correctamente.`);
      await loadAllData();
    } catch (error) {
      console.error('Error confirming order:', error);
      setActionError('No se pudo confirmar el pedido: ' + error.message);
    }
  };

  const handleConvertToSale = async (orderId) => {
    const metodoPago = window.prompt(
      'Ingresa el método de pago para la venta (EFECTIVO, TARJETA_DEBITO, TARJETA_CREDITO, TRANSFERENCIA)',
      'EFECTIVO'
    );
    if (metodoPago === null) {
      return;
    }

    setActionError(null);
    setActionMessage(null);
    try {
      await apiService.convertOrderToSale(orderId, metodoPago.trim().toUpperCase());
      setActionMessage(`Pedido #${orderId} convertido a venta exitosamente.`);
      await loadAllData();
    } catch (error) {
      console.error('Error converting order to sale:', error);
      setActionError('No se pudo convertir el pedido a venta: ' + error.message);
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
    const normalized = (status || '').toUpperCase();
    const colors = {
      'PENDIENTE': '#ffc107',
      'RECIBIDO': '#6c757d',
      'CONFIRMADO': '#17a2b8',
      'EN_PREPARACION': '#fd7e14',
      'LISTO': '#28a745',
      'LISTO_PARA_ENTREGA': '#28a745',
      'EN_TRANSITO': '#20c997',
      'ENTREGADO': '#6f42c1',
      'CANCELADO': '#dc3545',
      'COMPLETADA': '#28a745',
      'ACTIVO': '#28a745',
      'INACTIVO': '#6c757d'
    };
    return colors[normalized] || '#6c757d';
  };

  // Funciones para manejar CRUD
  const handleEditOrder = (order) => {
    setSelectedItem(order);
    setEditingType('order');
    setShowEditModal(true);
  };

  const handleDeleteOrder = (order) => {
    setSelectedItem(order);
    setEditingType('order');
    setShowDeleteModal(true);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      loadAllData(); // Recargar datos
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await apiService.deleteOrder(orderId);
      loadAllData(); // Recargar datos
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Componente de tabla reutilizable
  const DataTable = ({ 
    title, 
    data, 
    columns, 
    onEdit, 
    onDelete, 
    onAdd, 
    actions = true,
    emptyMessage = "No hay datos disponibles",
    renderActions
  }) => (
    <div className="data-table-container">
      <div className="table-header">
        <h3>{title}</h3>
        {onAdd && (
          <button className="btn-primary" onClick={onAdd}>
            + Agregar {title.slice(0, -1)}
          </button>
        )}
      </div>
      
      {data.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
                {actions && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="actions">
                      {renderActions && renderActions(item)}
                      {onEdit && (
                        <button 
                          className="btn-secondary btn-sm"
                          onClick={() => onEdit(item)}
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className="btn-danger btn-sm"
                          onClick={() => onDelete(item)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Panel de Administración</h2>
        <p>Gestiona tu pastelería desde aquí</p>
      </div>

      {/* Estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card products">
          <div className="stat-icon">🍰</div>
          <div className="stat-info">
            <h3>{data.stats.totalProducts}</h3>
            <p>Productos Activos</p>
          </div>
        </div>
        
        <div className="stat-card orders">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{data.stats.totalOrders}</h3>
            <p>Pedidos Totales</p>
          </div>
        </div>
        
        <div className="stat-card sales">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatCurrency(data.stats.totalSales)}</h3>
            <p>Ventas Totales</p>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{data.stats.pendingOrders}</h3>
            <p>Pedidos Pendientes</p>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{data.stats.totalUsers}</h3>
            <p>Usuarios Registrados</p>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="dashboard-section">
        <h3>Actividad Reciente</h3>
        <div className="recent-activity">
          {data.orders.slice(0, 5).map(order => (
            <div key={order.id} className="activity-item">
              <div className="activity-icon">📦</div>
              <div className="activity-info">
                <p><strong>{order.numeroPedido || `Pedido #${order.id}`}</strong></p>
                <p>{order.emailUsuario || order.usuarioEmail || 'Cliente'} - {formatCurrency(order.total)}</p>
                <span className="activity-date">{formatDate(order.fechaCreacion)}</span>
              </div>
              <div 
                className="activity-status"
                style={{ backgroundColor: getStatusColor(order.estado) }}
              >
                {(order.estado || '').replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => {
    const columns = [
      { key: 'codigo', label: 'Código' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'categoria', label: 'Categoría', render: (val) => val?.replace('_', ' ') },
      { key: 'precio', label: 'Precio', render: (val) => formatCurrency(val) },
      { key: 'stock', label: 'Stock' },
      { 
        key: 'activo', 
        label: 'Estado', 
        render: (val) => (
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(val ? 'ACTIVO' : 'INACTIVO') }}
          >
            {val ? 'Activo' : 'Inactivo'}
          </span>
        )
      }
    ];

    return (
      <DataTable
        title="Productos"
        data={data.products}
        columns={columns}
        onEdit={(product) => window.location.href = '/admin/productos'}
        onAdd={() => window.location.href = '/admin/productos'}
        emptyMessage="No hay productos registrados"
      />
    );
  };

  const renderOrders = () => {
    const columns = [
      { key: 'numeroPedido', label: 'Pedido', render: (val, item) => val || `#${item.id}` },
      { key: 'emailUsuario', label: 'Email', render: (val, item) => val || item.usuarioEmail || 'N/A' },
      { key: 'fechaCreacion', label: 'Fecha', render: (val, item) => formatDate(val || item.fechaPedido) },
      { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
      { 
        key: 'estado', 
        label: 'Estado', 
        render: (val) => (
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(val) }}
          >
            {(val || '').replaceAll('_', ' ')}
          </span>
        )
      }
    ];

    const isOrderEditable = (order) => {
      const status = (order.estado || '').toUpperCase();
      return !['ENTREGADO', 'CANCELADO'].includes(status);
    };

    return (
      <DataTable
        title="Pedidos"
        data={data.orders}
        columns={columns}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        renderActions={(order) => (
          <>
            {(order.estado || '').toUpperCase() === 'RECIBIDO' && (
              <button 
                className="btn-primary btn-sm"
                onClick={() => handleConfirmOrderStatus(order.id)}
              >
                Confirmar
              </button>
            )}
            {isOrderEditable(order) && (
              <button 
                className="btn-success btn-sm"
                onClick={() => handleConvertToSale(order.id)}
              >
                Venta
              </button>
            )}
          </>
        )}
        emptyMessage="No hay pedidos registrados"
      />
    );
  };

  const renderSales = () => {
    const columns = [
      { key: 'numeroVenta', label: 'Venta', render: (val, item) => val || `#${item.id}` },
      { key: 'fechaVenta', label: 'Fecha', render: (val) => formatDate(val) },
      { key: 'nombreCliente', label: 'Cliente', render: (val) => val || 'Cliente Mostrador' },
      { key: 'emailCliente', label: 'Email', render: (val) => val || 'N/A' },
      { key: 'metodoPago', label: 'Pago' },
      { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
      { 
        key: 'estado', 
        label: 'Estado', 
        render: (val) => (
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(val) }}
          >
            {(val || '').replaceAll('_', ' ')}
          </span>
        )
      }
    ];

    return (
      <div className="sales-tab">
        <div className="direct-sale-card">
          <div className="section-header">
            <h2>Registrar venta directa</h2>
            <p>Selecciona productos y registra una venta presencial sin pasar por el flujo de pedidos.</p>
          </div>
          <form className="direct-sale-form" onSubmit={handleSubmitDirectSale}>
            <div className="sale-form-grid">
              <div className="form-group">
                <label>Nombre del cliente</label>
                <input
                  type="text"
                  value={saleForm.nombreCliente}
                  onChange={(e) => handleSaleFieldChange('nombreCliente', e.target.value)}
                  placeholder="Cliente Mostrador"
                />
              </div>
              <div className="form-group">
                <label>Email del cliente</label>
                <input
                  type="email"
                  value={saleForm.emailCliente}
                  onChange={(e) => handleSaleFieldChange('emailCliente', e.target.value)}
                  placeholder="opcional@email.com"
                />
              </div>
              <div className="form-group">
                <label>Método de pago</label>
                <select
                  value={saleForm.metodoPago}
                  onChange={(e) => handleSaleFieldChange('metodoPago', e.target.value)}
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method.replaceAll('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Observaciones</label>
              <textarea
                value={saleForm.observaciones}
                onChange={(e) => handleSaleFieldChange('observaciones', e.target.value)}
                placeholder="Notas adicionales para esta venta"
              />
            </div>
            <div className="sale-items">
              <h4>Productos</h4>
              {saleForm.items.map((item, index) => (
                <div key={`sale-item-${index}`} className="sale-item-row">
                  <select
                    value={item.productId}
                    onChange={(e) => handleSaleItemChange(index, 'productId', e.target.value)}
                  >
                    <option value="">Selecciona un producto</option>
                    {data.products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.nombre} ({formatCurrency(product.precio)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => handleSaleItemChange(index, 'cantidad', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Mensaje (opcional)"
                    value={item.mensajePersonalizado}
                    onChange={(e) => handleSaleItemChange(index, 'mensajePersonalizado', e.target.value)}
                  />
                  {saleForm.items.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => removeSaleItem(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={addSaleItem}
              >
                + Agregar producto
              </button>
            </div>
            <div className="direct-sale-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmittingSale}
              >
                {isSubmittingSale ? 'Registrando...' : 'Registrar venta'}
              </button>
            </div>
          </form>
        </div>
        <DataTable
          title="Ventas"
          data={data.sales}
          columns={columns}
          actions={false}
          emptyMessage="No hay ventas registradas"
        />
      </div>
    );
  };

  const renderReports = () => (
    <div className="reports-content">
      <div className="section-header">
        <h2>Reportes y Estadísticas</h2>
      </div>

      <div className="reports-grid">
        {/* Productos por categoría */}
        <div className="report-card">
          <h3>Productos por Categoría</h3>
          <div className="category-stats">
            {Object.entries(
              data.products.reduce((acc, product) => {
                const cat = product.categoria || 'SIN_CATEGORIA';
                acc[cat] = (acc[cat] || 0) + 1;
                return acc;
              }, {})
            ).map(([category, count]) => (
              <div key={category} className="stat-item">
                <span className="stat-label">{category.replace('_', ' ')}</span>
                <span className="stat-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pedidos por estado */}
        <div className="report-card">
          <h3>Pedidos por Estado</h3>
          <div className="status-stats">
            {Object.entries(
              data.orders.reduce((acc, order) => {
                const status = order.estado || 'SIN_ESTADO';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
              }, {})
            ).map(([status, count]) => (
              <div key={status} className="stat-item">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(status) }}
                ></span>
                <span className="stat-label">{status.replace('_', ' ')}</span>
                <span className="stat-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen financiero */}
        <div className="report-card">
          <h3>Resumen Financiero</h3>
          <div className="financial-stats">
            <div className="stat-item">
              <span className="stat-label">Venta Promedio:</span>
              <span className="stat-value">
                {formatCurrency(data.stats.totalSales / (data.stats.totalOrders || 1))}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pedidos Este Mes:</span>
              <span className="stat-value">
                {data.orders.filter(order => {
                  if (!order.fechaCreacion) return false;
                  const orderDate = new Date(order.fechaCreacion);
                  const currentDate = new Date();
                  return orderDate.getMonth() === currentDate.getMonth() && 
                         orderDate.getFullYear() === currentDate.getFullYear();
                }).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Producto Más Caro:</span>
              <span className="stat-value">
                {formatCurrency(Math.max(...data.products.map(p => p.precio || 0)))}
              </span>
            </div>
          </div>
        </div>

        {/* Top productos */}
        <div className="report-card">
          <h3>Top 5 Productos por Precio</h3>
          <div className="top-products">
            {data.products
              .sort((a, b) => (b.precio || 0) - (a.precio || 0))
              .slice(0, 5)
              .map(product => (
                <div key={product.id} className="top-item">
                  <span className="item-name">{product.nombre}</span>
                  <span className="item-value">{formatCurrency(product.precio)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <Header />
        <div className="loading-dashboard">
          <div className="spinner"></div>
          <p>Cargando panel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Header />
      
      <div className="admin-container">
        <div className="admin-sidebar">
          <h3>Panel de Admin</h3>
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => changeTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => changeTab('products')}
            >
              <span className="nav-icon">🍰</span>
              Productos
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => changeTab('orders')}
            >
              <span className="nav-icon">📋</span>
              Pedidos
            </button>
            <button 
              className={`nav-item ${activeTab === 'userManagement' ? 'active' : ''}`}
              onClick={() => changeTab('userManagement')}
            >
              <span className="nav-icon">⚙️</span>
              Gestión Usuarios
            </button>
            <button 
              className={`nav-item ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => changeTab('sales')}
            >
              <span className="nav-icon">💰</span>
              Ventas
            </button>
            <button 
              className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => changeTab('reports')}
            >
              <span className="nav-icon">📈</span>
              Reportes
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {(actionMessage || actionError) && (
            <div className={`action-feedback ${actionError ? 'error' : 'success'}`}>
              <span>{actionError || actionMessage}</span>
              <button onClick={() => {
                setActionMessage(null);
                setActionError(null);
              }}>×</button>
            </div>
          )}
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'userManagement' && <UserManagement />}
          {activeTab === 'sales' && renderSales()}
          {activeTab === 'reports' && renderReports()}
        </div>
      </div>

      {/* Modal para editar */}
      {showEditModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                Editar {editingType === 'order' ? 'Pedido' : 'Usuario'} 
                {editingType === 'order' && ` #${selectedItem.id}`}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {editingType === 'order' && (
                <div className="edit-order-form">
                  <div className="form-group">
                    <label>Cliente:</label>
                    <p>{selectedItem.cliente || selectedItem.email}</p>
                  </div>
                  <div className="form-group">
                    <label>Total:</label>
                    <p>{formatCurrency(selectedItem.total)}</p>
                  </div>
                  <div className="form-group">
                    <label>Estado:</label>
                    <select 
                      value={selectedItem.estado || 'PENDIENTE'}
                      onChange={(e) => setSelectedItem({...selectedItem, estado: e.target.value})}
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EN_PREPARACION">En Preparación</option>
                      <option value="LISTO">Listo</option>
                      <option value="ENTREGADO">Entregado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => updateOrderStatus(selectedItem.id, selectedItem.estado)}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )}
              {editingType === 'user' && (
                <div className="edit-user-form">
                  <div className="form-group">
                    <label>Email:</label>
                    <p>{selectedItem.email}</p>
                  </div>
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input 
                      type="text"
                      value={selectedItem.nombre || ''}
                      onChange={(e) => setSelectedItem({...selectedItem, nombre: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo:</label>
                    <select 
                      value={selectedItem.userType || 'user'}
                      onChange={(e) => setSelectedItem({...selectedItem, userType: e.target.value})}
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        console.log('Actualizar usuario:', selectedItem);
                        setShowEditModal(false);
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para eliminar */}
      {showDeleteModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar este {editingType === 'order' ? 'pedido' : 'usuario'}?
              </p>
              {editingType === 'order' && (
                <div className="delete-details">
                  <p><strong>Pedido:</strong> #{selectedItem.id}</p>
                  <p><strong>Cliente:</strong> {selectedItem.cliente || selectedItem.email}</p>
                  <p><strong>Total:</strong> {formatCurrency(selectedItem.total)}</p>
                </div>
              )}
              {editingType === 'user' && (
                <div className="delete-details">
                  <p><strong>Usuario:</strong> {selectedItem.email}</p>
                  <p><strong>Nombre:</strong> {selectedItem.nombre || 'N/A'}</p>
                </div>
              )}
              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => {
                    if (editingType === 'order') {
                      deleteOrder(selectedItem.id);
                    } else {
                      console.log('Eliminar usuario:', selectedItem);
                      setShowDeleteModal(false);
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
