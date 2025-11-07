import React, { useState, useEffect } from 'react';
import '../styles/ProductModal.css';

const ProductModal = ({ product, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    stockMinimo: '',
    categoria: '',
    formaTorta: '',
    tamaño: '',
    personalizable: false,
    mensajeEspecial: false,
    sinAzucar: false,
    sinGluten: false,
    vegano: false,
    historiaOrigen: '',
    activo: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        codigo: product.codigo || '',
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        stock: product.stock || '',
        stockMinimo: product.stockMinimo || 5,
        categoria: product.categoria || '',
        formaTorta: product.formaTorta || '',
        tamaño: product.tamaño || '',
        personalizable: product.personalizable || false,
        mensajeEspecial: product.mensajeEspecial || false,
        sinAzucar: product.sinAzucar || false,
        sinGluten: product.sinGluten || false,
        vegano: product.vegano || false,
        historiaOrigen: product.historiaOrigen || '',
        activo: product.activo !== false
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!product && !formData.codigo.trim()) {
      newErrors.codigo = 'El código es obligatorio';
    } else if (formData.codigo && formData.codigo.length > 10) {
      newErrors.codigo = 'El código no puede tener más de 10 caracteres';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede tener más de 100 caracteres';
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede tener más de 500 caracteres';
    }

    if (!formData.precio) {
      newErrors.precio = 'El precio es obligatorio';
    } else if (isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser un número mayor a 0';
    }

    if (!formData.stock) {
      newErrors.stock = 'El stock es obligatorio';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (formData.stockMinimo && (isNaN(formData.stockMinimo) || parseInt(formData.stockMinimo) < 0)) {
      newErrors.stockMinimo = 'El stock mínimo debe ser un número mayor o igual a 0';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es obligatoria';
    }

    if (formData.historiaOrigen && formData.historiaOrigen.length > 1000) {
      newErrors.historiaOrigen = 'La historia no puede tener más de 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        stockMinimo: formData.stockMinimo ? parseInt(formData.stockMinimo) : 5
      };

      await onSave(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{product ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Información Básica */}
          <div className="form-section">
            <h3>Información Básica</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="codigo">Código *</label>
                <input
                  type="text"
                  id="codigo"
                  maxLength="10"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  className={errors.codigo ? 'error' : ''}
                  placeholder="Ej: TC001"
                  disabled={!!product} // Solo editable al crear
                />
                {errors.codigo && <span className="error-text">{errors.codigo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  maxLength="100"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={errors.nombre ? 'error' : ''}
                  placeholder="Ej: Torta de Chocolate Premium"
                />
                {errors.nombre && <span className="error-text">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="categoria">Categoría *</label>
                <select
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className={errors.categoria ? 'error' : ''}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="TORTAS_CUADRADAS">Tortas Cuadradas</option>
                  <option value="TORTAS_CIRCULARES">Tortas Circulares</option>
                  <option value="POSTRES_INDIVIDUALES">Postres Individuales</option>
                  <option value="PRODUCTOS_SIN_AZUCAR">Productos Sin Azúcar</option>
                  <option value="PASTELERIA_TRADICIONAL">Pastelería Tradicional</option>
                  <option value="PRODUCTOS_SIN_GLUTEN">Productos Sin Gluten</option>
                  <option value="PRODUCTOS_VEGANA">Productos Veganos</option>
                  <option value="TORTAS_ESPECIALES">Tortas Especiales</option>
                </select>
                {errors.categoria && <span className="error-text">{errors.categoria}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="precio">Precio *</label>
                <div className="price-input">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    id="precio"
                    min="0"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => handleInputChange('precio', e.target.value)}
                    className={errors.precio ? 'error' : ''}
                    placeholder="0.00"
                  />
                </div>
                {errors.precio && <span className="error-text">{errors.precio}</span>}
              </div>
            </div>
          </div>

          {/* Características del Producto */}
          <div className="form-section">
            <h3>Características del Producto</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="formaTorta">Forma de Torta</label>
                <select
                  id="formaTorta"
                  value={formData.formaTorta}
                  onChange={(e) => handleInputChange('formaTorta', e.target.value)}
                >
                  <option value="">Seleccionar forma</option>
                  <option value="CUADRADA">Cuadrada</option>
                  <option value="CIRCULAR">Circular</option>
                  <option value="RECTANGULAR">Rectangular</option>
                  <option value="INDIVIDUAL">Individual</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tamaño">Tamaño</label>
                <select
                  id="tamaño"
                  value={formData.tamaño}
                  onChange={(e) => handleInputChange('tamaño', e.target.value)}
                >
                  <option value="">Seleccionar tamaño</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="PEQUEÑO">Pequeño</option>
                  <option value="MEDIANO">Mediano</option>
                  <option value="GRANDE">Grande</option>
                  <option value="FAMILIAR">Familiar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gestión de Stock */}
          <div className="form-section">
            <h3>Gestión de Stock</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="stock">Stock Actual *</label>
                <input
                  type="number"
                  id="stock"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  className={errors.stock ? 'error' : ''}
                  placeholder="0"
                />
                {errors.stock && <span className="error-text">{errors.stock}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="stockMinimo">Stock Mínimo</label>
                <input
                  type="number"
                  id="stockMinimo"
                  min="0"
                  value={formData.stockMinimo}
                  onChange={(e) => handleInputChange('stockMinimo', e.target.value)}
                  className={errors.stockMinimo ? 'error' : ''}
                  placeholder="5"
                />
                {errors.stockMinimo && <span className="error-text">{errors.stockMinimo}</span>}
              </div>
            </div>
          </div>

          {/* Opciones Especiales */}
          <div className="form-section">
            <h3>Opciones Especiales</h3>
            <div className="checkbox-grid">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.personalizable}
                  onChange={(e) => handleInputChange('personalizable', e.target.checked)}
                />
                <span className="checkmark"></span>
                Personalizable
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.mensajeEspecial}
                  onChange={(e) => handleInputChange('mensajeEspecial', e.target.checked)}
                />
                <span className="checkmark"></span>
                Permite mensaje especial
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.sinAzucar}
                  onChange={(e) => handleInputChange('sinAzucar', e.target.checked)}
                />
                <span className="checkmark"></span>
                Sin azúcar
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.sinGluten}
                  onChange={(e) => handleInputChange('sinGluten', e.target.checked)}
                />
                <span className="checkmark"></span>
                Sin gluten
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.vegano}
                  onChange={(e) => handleInputChange('vegano', e.target.checked)}
                />
                <span className="checkmark"></span>
                Vegano
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => handleInputChange('activo', e.target.checked)}
                />
                <span className="checkmark"></span>
                Producto activo
              </label>
            </div>
          </div>

          {/* Descripción */}
          <div className="form-section">
            <h3>Descripción del Producto</h3>
            <div className="form-group full-width">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                rows="4"
                maxLength="500"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                className={errors.descripcion ? 'error' : ''}
                placeholder="Describe el producto, ingredientes, características especiales..."
              />
              <small className="char-count">{formData.descripcion.length}/500 caracteres</small>
              {errors.descripcion && <span className="error-text">{errors.descripcion}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="historiaOrigen">Historia u Origen del Producto</label>
              <textarea
                id="historiaOrigen"
                rows="3"
                maxLength="1000"
                value={formData.historiaOrigen}
                onChange={(e) => handleInputChange('historiaOrigen', e.target.value)}
                className={errors.historiaOrigen ? 'error' : ''}
                placeholder="Cuenta la historia o el origen especial de este producto..."
              />
              <small className="char-count">{formData.historiaOrigen.length}/1000 caracteres</small>
              {errors.historiaOrigen && <span className="error-text">{errors.historiaOrigen}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  {product ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                product ? 'Actualizar Producto' : 'Crear Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;