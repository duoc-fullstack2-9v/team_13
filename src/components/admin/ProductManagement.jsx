import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import ProductModal from '../ProductModal';
import apiService from '../../services/apiService';
import './ProductManagement.css';

const ProductManagement = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
      console.error('Error loading products:', err);
      showAlert('Error al cargar productos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(product => product.categoria === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleAddProduct = () => openModal();

  const handleEditProduct = (product) => openModal(product);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await apiService.deleteProduct(productId);
      showAlert('Producto eliminado exitosamente', 'success');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showAlert('Error al eliminar producto', 'error');
    }
  };

  const handleToggleProduct = async (productId, currentStatus) => {
    try {
      await apiService.toggleProductStatus(productId, !currentStatus);
      showAlert(
        `Producto ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      );
      loadProducts();
    } catch (error) {
      console.error('Error toggling product:', error);
      showAlert('Error al cambiar estado del producto', 'error');
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await apiService.updateProduct(editingProduct.id, productData);
        showAlert('Producto actualizado exitosamente', 'success');
      } else {
        await apiService.createProduct(productData);
        showAlert('Producto creado exitosamente', 'success');
      }
      await loadProducts();
      closeModal();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError('Error al guardar producto: ' + err.message);
      showAlert('Error al guardar producto', 'error');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount || 0);
  };

  const getCategoryName = (categoryCode) => {
    const category = categories.find(cat => cat.codigo === categoryCode);
    return category ? category.nombre : categoryCode;
  };

  if (isLoading) {
    return (
      <div className="product-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-management">
      {/* Header */}
      <div className="product-management-header">
        <h2>Gestión de Productos</h2>
        <button 
          onClick={handleAddProduct}
          className="btn btn-primary"
        >
          + Agregar Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="product-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.codigo} value={category.codigo}>
                {category.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="product-stats">
        <div className="stat-card">
          <h3>{products.length}</h3>
          <p>Total Productos</p>
        </div>
        <div className="stat-card">
          <h3>{products.filter(p => p.activo).length}</h3>
          <p>Activos</p>
        </div>
        <div className="stat-card">
          <h3>{products.filter(p => p.stock < 10).length}</h3>
          <p>Stock Bajo</p>
        </div>
        <div className="stat-card">
          <h3>{categories.length}</h3>
          <p>Categorías</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadProducts} className="btn btn-secondary">
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="product-code">{product.codigo}</td>
                <td className="product-name">{product.nombre}</td>
                <td className="product-category">
                  {getCategoryName(product.categoria)}
                </td>
                <td className="product-price">
                  {formatCurrency(product.precio)}
                </td>
                <td className="product-stock">
                  <span className={`stock-badge ${product.stock < 10 ? 'low' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="product-status">
                  <span className={`status-badge ${product.activo ? 'active' : 'inactive'}`}>
                    {product.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="product-actions">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="btn btn-sm btn-secondary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleProduct(product.id, product.activo)}
                    className={`btn btn-sm ${product.activo ? 'btn-warning' : 'btn-success'}`}
                  >
                    {product.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && !isLoading && (
          <div className="empty-state">
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ProductManagement;
