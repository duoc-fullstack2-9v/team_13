import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import apiService from '../services/apiService';
import '../styles/AdminPages.css';

const AdminUsuariosPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    userType: '',
    search: '',
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
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar usuarios: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (filters.userType) {
      filtered = filtered.filter(user => (user.userType || 'user') === filters.userType);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        (user.email || '').toLowerCase().includes(searchTerm) ||
        (user.nombre || user.displayName || '').toLowerCase().includes(searchTerm)
      );
    }

    if (filters.fechaDesde) {
      filtered = filtered.filter(user => 
        new Date(user.fechaRegistro || user.createdAt) >= new Date(filters.fechaDesde)
      );
    }

    if (filters.fechaHasta) {
      filtered = filtered.filter(user => 
        new Date(user.fechaRegistro || user.createdAt) <= new Date(filters.fechaHasta)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  const getUserTypeColor = (userType) => {
    const colors = {
      'admin': '#dc3545',
      'user': '#28a745',
      'manager': '#17a2b8'
    };
    return colors[userType || 'user'] || '#6c757d';
  };

  const getUserTypeOptions = () => [
    'user',
    'admin',
    'manager'
  ];

  const toggleUserType = async (userId, currentType) => {
    try {
      const newType = currentType === 'admin' ? 'user' : 'admin';
      // Aquí deberías implementar el endpoint para cambiar tipo de usuario
      console.log(`Changing user ${userId} from ${currentType} to ${newType}`);
      // await apiService.updateUserType(userId, newType);
      // await loadUsers();
      alert('Funcionalidad de cambio de tipo de usuario pendiente de implementar en el backend');
    } catch (error) {
      console.error('Error updating user type:', error);
      setError('Error al actualizar tipo de usuario');
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Header />
      
      <div className="admin-content">
        <div className="page-header">
          <h1>👥 Gestión de Usuarios</h1>
          <p>Administra todos los usuarios registrados en la plataforma</p>
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
              👥 Filtros de Usuarios
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
              <label>Tipo de Usuario</label>
              <select
                value={filters.userType}
                onChange={(e) => handleFilterChange('userType', e.target.value)}
              >
                <option value="">👤 Todos los tipos</option>
                {getUserTypeOptions().map(type => (
                  <option key={type} value={type}>
                    {type === 'admin' ? '👑 Administrador' : 
                     type === 'manager' ? '🏢 Gerente' : 
                     type === 'customer' ? '🛒 Cliente' : '👤 Usuario'}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Buscar Usuario</label>
              <input
                type="text"
                placeholder="Email, nombre o apellido..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Registrado Desde</label>
              <input
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Registrado Hasta</label>
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
              onClick={() => setFilters({ userType: '', search: '', fechaDesde: '', fechaHasta: '' })}
            >
              Limpiar Filtros
            </button>
            <span className="results-count">
              {filteredUsers.length} usuarios encontrados
            </span>
          </div>
            </div>
          )}
        </div>

        {/* Tabla de usuarios */}
        <div className="data-table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Avatar</th>
                  <th>Email</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <span className="empty-icon">👥</span>
                      <p>No hay usuarios que coincidan con los filtros</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id || user.email}>
                      <td>{user.id || 'N/A'}</td>
                      <td className="avatar-cell">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt="Avatar" 
                            className="user-avatar"
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {(user.email || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.nombre || user.displayName || 'N/A'}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getUserTypeColor(user.userType) }}
                        >
                          {user.userType === 'admin' ? 'Admin' : 
                           user.userType === 'manager' ? 'Gerente' : 'Usuario'}
                        </span>
                      </td>
                      <td>{formatDate(user.fechaRegistro || user.createdAt)}</td>
                      <td className="actions">
                        <button 
                          className="btn-primary btn-sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                        >
                          👁️ Ver
                        </button>
                        <button 
                          className="btn-secondary btn-sm"
                          onClick={() => toggleUserType(user.id, user.userType)}
                        >
                          🔄 Cambiar Tipo
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
              <span className="stat-label">Total Usuarios:</span>
              <span className="stat-value">{users.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Administradores:</span>
              <span className="stat-value">
                {users.filter(u => u.userType === 'admin').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Users Regulares:</span>
              <span className="stat-value">
                {users.filter(u => !u.userType || u.userType === 'user').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Registros Hoy:</span>
              <span className="stat-value">
                {users.filter(u => {
                  const registroDate = new Date(u.fechaRegistro || u.createdAt);
                  const today = new Date();
                  return registroDate.toDateString() === today.toDateString();
                }).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para ver usuario */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Usuario: {selectedUser.email}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="user-details">
                <div className="user-profile">
                  {selectedUser.photoURL ? (
                    <img 
                      src={selectedUser.photoURL} 
                      alt="Avatar" 
                      className="user-avatar-large"
                    />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {(selectedUser.email || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="detail-group">
                  <strong>ID:</strong> {selectedUser.id || 'N/A'}
                </div>
                <div className="detail-group">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div className="detail-group">
                  <strong>Nombre:</strong> {selectedUser.nombre || selectedUser.displayName || 'N/A'}
                </div>
                <div className="detail-group">
                  <strong>Tipo de Usuario:</strong> 
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getUserTypeColor(selectedUser.userType), marginLeft: '10px' }}
                  >
                    {selectedUser.userType === 'admin' ? 'Administrador' : 
                     selectedUser.userType === 'manager' ? 'Gerente' : 'Usuario'}
                  </span>
                </div>
                <div className="detail-group">
                  <strong>Fecha de Registro:</strong> {formatDate(selectedUser.fechaRegistro || selectedUser.createdAt)}
                </div>
                
                {selectedUser.lastLogin && (
                  <div className="detail-group">
                    <strong>Último Acceso:</strong> {formatDate(selectedUser.lastLogin)}
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

export default AdminUsuariosPage;