// API Service para conectar con pasteleria-api
const API_BASE_URL = 'http://localhost:8080';

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
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

  // STOCK
  async getStock() {
    return this.request('/api/productos/stock');
  }

  async updateStock(id, quantity, operation) {
    return this.request(`/api/productos/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ quantity, operation }),
    });
  }

  // CATEGORÍAS
  async getCategories() {
    return this.request('/api/productos/categories');
  }

  // VENTAS
  async getSales() {
    return this.request('/api/ventas');
  }

  async createSale(saleData) {
    return this.request('/api/ventas', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  // PEDIDOS
  async getOrders() {
    return this.request('/api/pedidos');
  }

  async getOrdersByUser(userEmail) {
    return this.request(`/api/pedidos/cliente/${encodeURIComponent(userEmail)}`);
  }

  async getOrder(orderId) {
    return this.request(`/api/pedidos/${orderId}`);
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

  async convertOrderToSale(orderId) {
    return this.request(`/api/pedidos/${orderId}/convert-to-sale`, {
      method: 'POST',
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
    return this.request('/api/users');
  }

  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

export default new ApiService();