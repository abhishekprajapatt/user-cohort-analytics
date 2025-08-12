import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle the nested data structure
api.interceptors.response.use(
  (response) => {
    // If response has nested data structure, flatten it for easier use
    if (response.data && response.data.data) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
  // Phone numbers API - may not exist yet
  getPhoneNumbers: () =>
    Promise.resolve({ data: { phones: [], totalCount: 0 } }),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  update: (id, orderData) => api.put(`/orders/${id}`, orderData),
  delete: (id) => api.delete(`/orders/${id}`),
  getStats: () => api.get('/orders/stats'),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
};

// Cohorts API
export const cohortsAPI = {
  getAll: () => api.get('/cohorts'),
  getAnalysis: () => api.get('/cohorts/analytics'),
  getStats: () => api.get('/cohorts'),
  generate: () => api.post('/cohorts/generate'),
  // Remove non-existent endpoints
  getMetrics: () => Promise.resolve({ data: null }),
  calculate: () => api.post('/cohorts/generate'),
};

export default api;
