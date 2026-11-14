const ADMIN_TOKEN_KEY = 'foodexpress_admin_token';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getStoredAdminToken() {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredAdminToken(token) {
  try {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {
    // Ignora falha de localStorage
  }
}

async function requestJson(path, options = {}) {
  const token = getStoredAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(
      data?.error?.message || `Erro HTTP ${response.status} ao acessar ${path}`
    );
    err.status = response.status;
    err.code = data?.error?.code || 'HTTP_ERROR';
    throw err;
  }

  return data;
}

export const adminApi = {
  async login(username = 'admin', password = 'admin123') {
    const data = await requestJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      setStoredAdminToken(data.token);
    }
    return data;
  },

  async ensureAuthenticated() {
    const current = getStoredAdminToken();
    // Se não houver token ou for um token mock antigo sem formato JWT (3 partes), autentica no backend
    if (current && current.split('.').length === 3) {
      return current;
    }
    const data = await this.login('admin', 'admin123');
    return data.token;
  },

  async withAutoAuth(fn) {
    await this.ensureAuthenticated();
    try {
      return await fn();
    } catch (err) {
      if (err.status === 401) {
        setStoredAdminToken('');
        await this.login('admin', 'admin123');
        return await fn();
      }
      throw err;
    }
  },

  // Pedidos Admin (API-009, API-010, API-011)
  async fetchOrders(status = null) {
    return this.withAutoAuth(() => {
      const qs = status ? `?status=${encodeURIComponent(status)}` : '';
      return requestJson(`/admin/orders${qs}`, { method: 'GET' });
    });
  },

  async advanceOrder(orderId, targetStatus = null) {
    return this.withAutoAuth(() =>
      requestJson(`/admin/orders/${orderId}/advance`, {
        method: 'PATCH',
        body: JSON.stringify(targetStatus ? { targetStatus } : {}),
      })
    );
  },

  async cancelOrder(orderId) {
    return this.withAutoAuth(() =>
      requestJson(`/admin/orders/${orderId}/cancel`, {
        method: 'POST',
      })
    );
  },

  async simulateIncomingOrder() {
    return this.withAutoAuth(() =>
      requestJson('/admin/orders/simulate', {
        method: 'POST',
      })
    );
  },

  async resetDemoOrders() {
    return this.withAutoAuth(() =>
      requestJson('/admin/orders/reset', {
        method: 'POST',
      })
    );
  },

  // Cardápio Admin (API-006, API-007, API-008)
  async fetchAdminMenu() {
    return this.withAutoAuth(() =>
      requestJson('/admin/menu', { method: 'GET' })
    );
  },

  async createCategory(payload) {
    return this.withAutoAuth(() =>
      requestJson('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  },

  async updateCategory(id, payload) {
    return this.withAutoAuth(() =>
      requestJson(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
    );
  },

  async createProduct(payload) {
    return this.withAutoAuth(() =>
      requestJson('/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  },

  async updateProduct(id, payload) {
    return this.withAutoAuth(() =>
      requestJson(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
    );
  },

  async toggleProductActive(id, active = undefined) {
    return this.withAutoAuth(() =>
      requestJson(`/admin/products/${id}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify(active !== undefined ? { active } : {}),
      })
    );
  },

  async deleteProduct(id) {
    return this.withAutoAuth(() =>
      requestJson(`/admin/products/${id}`, {
        method: 'DELETE',
      })
    );
  },
};
