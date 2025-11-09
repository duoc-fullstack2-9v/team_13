import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import apiService from '../services/apiService';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
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

  // Verificar autenticación y permisos de admin
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar todos los datos en paralelo
      const [products, orders, users, sales] = await Promise.all([
        apiService.getProducts().catch(() => []),
        apiService.getAllOrders().catch(() => []),
        apiService.getAllUsers().catch(() => []),
        apiService.getAllSales().catch(() => [])
      ]);
      
      // Calcular estadísticas
      const totalSales = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const pendingOrders = orders.filter(order => order.estado === 'PENDIENTE').length;
      
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
      'CANCELADO': '#dc3545',
      'ACTIVO': '#28a745',
      'INACTIVO': '#6c757d'
    };
    return colors[status] || '#6c757d';
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
    emptyMessage = "No hay datos disponibles" 
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
                      {onEdit && (
                        <button 
                          className="btn-secondary btn-sm"
                          onClick={() => onEdit(item)}
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className="btn-danger btn-sm"
                          onClick={() => onDelete(item)}
                        >
                          🗑️
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
                <p><strong>Pedido #{order.id}</strong></p>
                <p>{order.cliente || order.email} - {formatCurrency(order.total)}</p>
                <span className="activity-date">{formatDate(order.fechaPedido)}</span>
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
      { key: 'id', label: 'ID', render: (val) => `#${val}` },
      { key: 'cliente', label: 'Cliente', render: (val, item) => val || item.email },
      { key: 'fechaPedido', label: 'Fecha', render: (val) => formatDate(val) },
      { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
      { 
        key: 'estado', 
        label: 'Estado', 
        render: (val) => (
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(val) }}
          >
            {(val || '').replace('_', ' ')}
          </span>
        )
      }
    ];

    return (
      <DataTable
        title="Pedidos"
        data={data.orders}
        columns={columns}
        onEdit={(order) => console.log('Editar pedido:', order)}
        emptyMessage="No hay pedidos registrados"
      />
    );
  };

  const renderUsers = () => {
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'email', label: 'Email' },
      { key: 'nombre', label: 'Nombre', render: (val, item) => val || item.displayName },
      { key: 'userType', label: 'Tipo', render: (val) => val || 'user' },
      { key: 'fechaRegistro', label: 'Registro', render: (val) => formatDate(val) }
    ];

    return (
      <DataTable
        title="Usuarios"
        data={data.users}
        columns={columns}
        onEdit={(user) => console.log('Editar usuario:', user)}
        emptyMessage="No hay usuarios registrados"
      />
    );
  };

  const renderSales = () => {
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'fecha', label: 'Fecha', render: (val) => formatDate(val) },
      { key: 'cliente', label: 'Cliente' },
      { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
      { key: 'metodoPago', label: 'Método de Pago' },
      { 
        key: 'estado', 
        label: 'Estado', 
        render: (val) => (
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(val) }}
          >
            {(val || '').replace('_', ' ')}
          </span>
        )
      }
    ];

    return (
      <DataTable
        title="Ventas"
        data={data.sales}
        columns={columns}
        actions={false}
        emptyMessage="No hay ventas registradas"
      />
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
              <span className="stat-label">Ventas Este Mes:</span>
              <span className="stat-value">
                {data.orders.filter(order => 
                  new Date(order.fechaPedido).getMonth() === new Date().getMonth()
                ).length}
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
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <span className="nav-icon">🍰</span>
              Productos
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="nav-icon">📋</span>
              Pedidos
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              Usuarios
            </button>
            <button 
              className={`nav-item ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveTab('sales')}
            >
              <span className="nav-icon">💰</span>
              Ventas
            </button>
            <button 
              className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <span className="nav-icon">📈</span>
              Reportes
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'sales' && renderSales()}
          {activeTab === 'reports' && renderReports()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;