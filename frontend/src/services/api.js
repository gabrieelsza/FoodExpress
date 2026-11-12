const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('foodexpress_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || data.message || 'Erro na requisição');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ==================== PUBLIC API ====================

export const publicApi = {
  // Get public menu (active items only)
  getMenu() {
    return request('/public/menu');
  },

  // Create a new order
  createOrder(orderData) {
    return request('/public/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get order by ID (public tracking)
  getOrder(orderId) {
    return request(`/public/orders/${orderId}`);
  },

  // Cancel order (customer - within 5 min window)
  cancelOrder(orderId) {
    return request(`/public/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  },
};

// ==================== ADMIN API ====================

export const adminApi = {
  // Login
  login(username, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // Get full menu (including inactive items)
  getMenu() {
    return request('/admin/menu', {
      headers: getAuthHeaders(),
    });
  },

  // Create category
  createCategory(data) {
    return request('/admin/categories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Update category
  updateCategory(id, data) {
    return request(`/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Create product
  createProduct(data) {
    return request('/admin/products', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Update product
  updateProduct(id, data) {
    return request(`/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Toggle product active status
  toggleProduct(id) {
    return request(`/admin/products/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
  },

  // Get all orders (admin)
  getOrders(status) {
    const query = status ? `?status=${status}` : '';
    return request(`/admin/orders${query}`, {
      headers: getAuthHeaders(),
    });
  },

  // Advance order status
  advanceOrder(id, targetStatus) {
    return request(`/admin/orders/${id}/advance`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetStatus }),
    });
  },

  // Cancel order (admin - anytime)
  cancelOrder(id) {
    return request(`/admin/orders/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },
};
