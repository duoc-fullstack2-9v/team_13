import React, { useState, useEffect } from 'react';
import { useAlert } from '../../contexts/AlertContext';
import firebaseUserService from '../../services/firebaseUserService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [stats, setStats] = useState({});
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    telefono: '',
    userType: 'customer',
    password: ''
  });

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await firebaseUserService.getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      showAlert('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const userStats = await firebaseUserService.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.nombre || !formData.password) {
      showAlert('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    try {
      await firebaseUserService.createUser(formData);
      showAlert('Usuario creado exitosamente', 'success');
      setIsCreateModalOpen(false);
      setFormData({
        email: '',
        nombre: '',
        apellido: '',
        telefono: '',
        userType: 'customer',
        password: ''
      });
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Error creating user:', error);
      showAlert(error.message || 'Error al crear usuario', 'error');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) return;

    try {
      const updateData = { ...formData };
      delete updateData.password; // No actualizar password desde este formulario
      
      await firebaseUserService.updateUser(selectedUser.id, updateData);
      showAlert('Usuario actualizado exitosamente', 'success');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Error updating user:', error);
      showAlert('Error al actualizar usuario', 'error');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await firebaseUserService.toggleUserStatus(userId, !currentStatus);
      showAlert(
        `Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      );
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Error toggling user status:', error);
      showAlert('Error al cambiar estado del usuario', 'error');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || '',
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      telefono: user.telefono || '',
      userType: user.userType || 'customer',
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({
      email: '',
      nombre: '',
      apellido: '',
      telefono: '',
      userType: 'customer',
      password: ''
    });
    setIsCreateModalOpen(true);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CL');
  };

  const getUserTypeLabel = (userType) => {
    const types = {
      admin: 'Administrador',
      customer: 'Cliente',
      guest: 'Invitado'
    };
    return types[userType] || 'Cliente';
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      {/* Header con estadísticas */}
      <div className="user-management-header">
        <h2>Gestión de Usuarios</h2>
        <div className="user-stats">
          <div className="stat-card">
            <h3>{stats.total || 0}</h3>
            <p>Total Usuarios</p>
          </div>
          <div className="stat-card">
            <h3>{stats.activos || 0}</h3>
            <p>Activos</p>
          </div>
          <div className="stat-card">
            <h3>{stats.admins || 0}</h3>
            <p>Administradores</p>
          </div>
          <div className="stat-card">
            <h3>{stats.customers || 0}</h3>
            <p>Клиentes</p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="user-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary"
        >
          Crear Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fecha Registro</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.displayName || `${user.nombre} ${user.apellido}`.trim() || 'N/A'}</td>
                <td>
                  <span className={`user-type ${user.userType}`}>
                    {getUserTypeLabel(user.userType)}
                  </span>
                </td>
                <td>{formatDate(user.fechaRegistro)}</td>
                <td>
                  <span className={`status-badge ${user.activo !== false ? 'active' : 'inactive'}`}>
                    {user.activo !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => openEditModal(user)}
                      className="btn btn-sm btn-secondary"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleUserStatus(user.id, user.activo !== false)}
                      className={`btn btn-sm ${user.activo !== false ? 'btn-warning' : 'btn-success'}`}
                    >
                      {user.activo !== false ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <p>No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Modal crear usuario */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Crear Nuevo Usuario</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="modal-body">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Tipo de Usuario</label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                >
                  <option value="customer">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="form-group">
                <label>Contraseña *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar usuario */}
      {isEditModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Editar Usuario</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="modal-body">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="disabled"
                />
                <small>El email no se puede modificar</small>
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Tipo de Usuario</label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                >
                  <option value="customer">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;