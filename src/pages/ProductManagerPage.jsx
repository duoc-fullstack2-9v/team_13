import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductModal from '../components/ProductModal';
import apiService from '../services/apiService';
import '../styles/ProductManager.css';

const ProductManagerPage = () => {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  // Verificar permisos
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user || user.userType !== 'admin') {
    return <Navigate to="/" replace />;
  }

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
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(product => product.categoria === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await apiService.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        setError('Error al eliminar producto: ' + err.message);
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Actualizar producto existente
        const updatedProduct = await apiService.updateProduct(editingProduct.id, productData);
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      } else {
        // Crear nuevo producto
        const newProduct = await apiService.createProduct(productData);
        setProducts([...products, newProduct]);
      }
      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      setError('Error al guardar producto: ' + err.message);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await apiService.updateStock(productId, newStock, 'set');
      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock: newStock } : p
      ));
    } catch (err) {
      setError('Error al actualizar stock: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="product-manager">
        <Header />
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="product-manager">
      <Header />
      
      <div className="container">
        <div className="header-section">
          <h1>Mantenedor de Productos</h1>
          <button className="btn-primary" onClick={handleAddProduct}>
            + Agregar Producto
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

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
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td className="product-code">{product.codigo}</td>
                  <td className="product-name">
                    <div className="name-cell">
                      <strong>{product.nombre}</strong>
                      {product.descripcion && (
                        <small className="description-preview">
                          {product.descripcion.length > 50 
                            ? `${product.descripcion.substring(0, 50)}...`
                            : product.descripcion
                          }
                        </small>
                      )}
                    </div>
                  </td>
                  <td className="product-category">
                    <span className="category-badge">{product.categoria}</span>
                  </td>
                  <td className="product-price">
                    ${product.precio?.toLocaleString()}
                  </td>
                  <td className="product-stock">
                    <span className={`stock-badge ${product.stock <= 5 ? 'low-stock' : product.stock <= 10 ? 'medium-stock' : 'good-stock'}`}>
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
                      className="btn-edit"
                      onClick={() => handleEditProduct(product)}
                      title="Editar producto"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && !isLoading && (
          <div className="no-products">
            <p>No se encontraron productos</p>
          </div>
        )}

        {showModal && (
          <ProductModal
            product={editingProduct}
            categories={categories}
            onSave={handleSaveProduct}
            onClose={() => {
              setShowModal(false);
              setEditingProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductManagerPage;