// API Service para conectar con pasteleria-api
// 🚀 CONFIGURACIÓN AUTOMÁTICA - Detecta entorno automáticamente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://168.197.50.14:8080';  // VPS por defecto
// Para desarrollo local, cambiar a: 'http://localhost:8080'

const normalizeOrdersCollection = (response) => {
  if (Array.isArray(response)) {
    return response;
  }
  if (Array.isArray(response?.pedidos)) {
    return response.pedidos;
  }
  if (Array.isArray(response?.data?.pedidos)) {
    return response.data.pedidos;
  }
  if (Array.isArray(response?.results)) {
    return response.results;
  }
  return [];
};

const normalizeOrderEntity = (response) => {
  return response?.pedido || response;
};

const normalizeSalesCollection = (response) => {
  if (Array.isArray(response)) {
    return response;
  }
  if (Array.isArray(response?.ventas)) {
    return response.ventas;
  }
  if (Array.isArray(response?.data?.ventas)) {
    return response.data.ventas;
  }
  return [];
};

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método genérico para hacer requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const responseText = await response.text();
      let data = null;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = responseText;
        }
      }

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // PRODUCTOS
  async getProducts() {
    return this.request('/api/productos');
  }

  async getProduct(id) {
    return this.request(`/api/productos/${id}`);
  }

  async createProduct(productData) {
    return this.request('/api/productos', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/api/productos/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleProductStatus(id, isActive) {
    return this.request(`/api/productos/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ activo: isActive }),
    });
  }

  // STOCK
  async getStock() {
    return this.request('/api/productos/stock');
  }

  async getProductStock(id) {
    const response = await this.request(`/api/productos/${id}/stock`);
    return response?.stock ?? 0;
  }

  async updateStock(id, stock) {
    return this.request(`/api/productos/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stock }),
    });
  }

  // CATEGORÍAS
  async getCategories() {
    return this.request('/api/productos/categories');
  }

  // VENTAS
  async getSales() {
    const response = await this.request('/api/ventas');
    return normalizeSalesCollection(response);
  }

  async createSale(saleData) {
    const response = await this.request('/api/ventas', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
    return response?.venta || response;
  }

  // PEDIDOS
  async getOrders() {
    const response = await this.request('/api/pedidos');
    // La API devuelve {success: true, count: X, pedidos: [...]}
    return normalizeOrdersCollection(response);
  }

  async getOrdersByUser(userEmail) {
    const normalizedEmail = (userEmail || '').trim().toLowerCase();
    if (!normalizedEmail) {
      return [];
    }

    const tryEndpoint = async (endpoint) => {
      try {
        const response = await this.request(endpoint);
        return normalizeOrdersCollection(response);
      } catch (error) {
        if (error.status === 404) {
          return [];
        }
        throw error;
      }
    };

    const primaryOrders = await tryEndpoint(`/api/pedidos/usuario/${encodeURIComponent(normalizedEmail)}`);
    if (primaryOrders.length > 0) {
      return primaryOrders;
    }

    return tryEndpoint(`/api/pedidos/cliente/${encodeURIComponent(normalizedEmail)}`);
  }

  async getOrder(orderId) {
    const response = await this.request(`/api/pedidos/${orderId}`);
    return normalizeOrderEntity(response);
  }

  async getOrderTracking(orderNumber) {
    if (!orderNumber) {
      return null;
    }
    const response = await this.request(`/api/pedidos/${encodeURIComponent(orderNumber)}/seguimiento`);
    return normalizeOrderEntity(response);
  }

  async createOrder(orderData) {
    return this.request('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(orderId, orderData) {
    return this.request(`/api/pedidos/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  async deleteOrder(orderId) {
    return this.request(`/api/pedidos/${orderId}`, {
      method: 'DELETE',
    });
  }

  async convertOrderToSale(orderId, metodoPago = 'EFECTIVO') {
    return this.request(`/api/pedidos/${orderId}/convertir-a-venta`, {
      method: 'POST',
      body: JSON.stringify({ metodoPago }),
    });
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/api/pedidos/${orderId}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado: status }),
    });
  }

  // USUARIOS
  async getUsers() {
    const response = await this.request('/api/usuarios');
    // La API devuelve {success: true, count: X, usuarios: [...]}
    return response.usuarios || [];
  }

  async getAllUsers() {
    const response = await this.request('/api/usuarios');
    // La API devuelve {success: true, count: X, usuarios: [...]}
    return response.usuarios || [];
  }

  async getUserByEmail(email) {
    try {
      const response = await this.request(`/api/usuarios/email/${encodeURIComponent(email)}`);
      return response?.usuario || null;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createUser(userData) {
    return this.request('/api/usuarios/registro', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // PEDIDOS - métodos adicionales para admin
  async getAllOrders() {
    const response = await this.request('/api/pedidos');
    // La API devuelve {success: true, count: X, pedidos: [...]}
    return normalizeOrdersCollection(response);
  }

  // VENTAS - métodos adicionales para admin
  async getAllSales() {
    return this.getSales();
  }

  async getSalesStats() {
    try {
      return await this.request('/api/ventas/estadisticas');
    } catch (error) {
      const sales = await this.getSales();
      const totalSales = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      return {
        totalSales,
        totalVentas: sales.length,
        averageOrderValue: sales.length > 0 ? totalSales / sales.length : 0,
      };
    }
  }

  async getSalesReport(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('fechaInicio', startDate);
    if (endDate) params.append('fechaFin', endDate);
    
    return this.request(`/api/ventas/reporte?${params.toString()}`);
  }
}

export default new ApiService();
