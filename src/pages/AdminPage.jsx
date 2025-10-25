import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ResultModal from '../components/ResultModal';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success'
  });

  // Si no es admin, redirigir al inicio
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      ...formData,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => 
        p.id === editingProduct.id ? newProduct : p
      );
      setModalConfig({
        title: '¡Producto actualizado!',
        message: 'El producto se ha actualizado correctamente.',
        type: 'success'
      });
    } else {
      updatedProducts = [...products, newProduct];
      setModalConfig({
        title: '¡Producto agregado!',
        message: 'El nuevo producto se ha agregado correctamente.',
        type: 'success'
      });
    }

    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    setShowModal(true);
    setFormData({ name: '', price: '', description: '', category: '' });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category
    });
  };

  const handleDelete = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    setModalConfig({
      title: 'Producto eliminado',
      message: 'El producto se ha eliminado correctamente.',
      type: 'success'
    });
    setShowModal(true);
  };

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-content">
        <section className="admin-header">
          <h1>Panel de Administración</h1>
          <p>Gestiona los productos administrativos aquí</p>
        </section>

        <div className="admin-grid">
          {/* Formulario de producto */}
          <section className="product-form-section">
            <h2>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">Nombre del Producto *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Torta de Chocolate"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Precio *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: 15000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoría *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="tortas">Tortas</option>
                  <option value="pasteles">Pasteles</option>
                  <option value="galletas">Galletas</option>
                  <option value="cupcakes">Cupcakes</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe el producto..."
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-submit">
                {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
              </button>
              
              {editingProduct && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({ name: '', price: '', description: '', category: '' });
                  }}
                >
                  Cancelar Edición
                </button>
              )}
            </form>
          </section>

          {/* Lista de productos */}
          <section className="products-list-section">
            <h2>Productos Administrativos</h2>
            <div className="products-list">
              {products.length === 0 ? (
                <p className="no-products">No hay productos agregados aún.</p>
              ) : (
                products.map(product => (
                  <div key={product.id} className="product-card admin">
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-description">{product.description}</p>
                      <p className="product-price">Precio: ${product.price}</p>
                      <p className="product-date">
                        Actualizado: {new Date(product.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="product-actions">
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn-delete"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      
      <ResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default AdminPage;
