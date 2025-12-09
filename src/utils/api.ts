import axios from 'axios';
import { Product, Order } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productAPI = {
  getAll: () => api.get<Product[]>('/products'),
  getBySlug: (slug: string) => api.get<Product>(`/products/${slug}`),
};

export const orderAPI = {
  createStripeSession: (data: { items: any[], email: string }) => 
    api.post('/orders/create-stripe-session', data),
  createRazorpayOrder: (data: { items: any[], email: string }) => 
    api.post('/orders/create-razorpay-order', data),
};

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post('/auth/register', { name, email, password }),
  googleLogin: (credential: string) => 
    api.post('/auth/google', { credential }),
};

export default api;