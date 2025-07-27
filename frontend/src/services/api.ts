import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: any) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/users/login', { email, password });
    return response.data;
  }

  async register(userData: any) {
    const response = await this.api.post('/users', userData);
    return response.data;
  }

  // Film endpoints
  async getFilms(page = 1, pageSize = 10) {
    const response = await this.api.get(`/films?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async getFilmById(id: number) {
    const response = await this.api.get(`/films/${id}`);
    return response.data;
  }

  async getFilmsByCategory(categoryId: number, page = 1, pageSize = 10) {
    const response = await this.api.get(`/films/category/${categoryId}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async searchFilms(query: string, page = 1, pageSize = 10) {
    const response = await this.api.get(`/films/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async getNewReleases(page = 1, pageSize = 10) {
    const response = await this.api.get(`/films/new-releases?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async getEditorChoices(page = 1, pageSize = 10) {
    const response = await this.api.get(`/films/editor-choices?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async getMostRented(page = 1, pageSize = 10) {
    const response = await this.api.get(`/films/most-rented?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async createFilm(filmData: any) {
    const response = await this.api.post('/films', filmData);
    return response.data;
  }

  async updateFilm(id: number, filmData: any) {
    const response = await this.api.put(`/films/${id}`, filmData);
    return response.data;
  }

  async deleteFilm(id: number) {
    const response = await this.api.delete(`/films/${id}`);
    return response.data;
  }

  async updateFilmStock(id: number, newStockCount: number) {
    const response = await this.api.put(`/films/${id}/stock`, { newStockCount });
    return response.data;
  }

  // Category endpoints
  async getCategories() {
    const response = await this.api.get('/categories');
    return response.data;
  }

  async getCategoryById(id: number) {
    const response = await this.api.get(`/categories/${id}`);
    return response.data;
  }

  // Order endpoints
  async getOrders(page = 1, pageSize = 10) {
    const response = await this.api.get(`/orders?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async getOrderById(id: number) {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(orderData: any) {
    const response = await this.api.post('/orders', orderData);
    return response.data;
  }

  async updateOrderStatus(id: number, status: string) {
    const response = await this.api.put(`/orders/${id}/status`, { status });
    return response.data;
  }

  // Cart endpoints
  async getCart() {
    const response = await this.api.get('/cart');
    return response.data;
  }

  async addToCart(filmId: number, quantity = 1) {
    const response = await this.api.post('/cart', { filmId, quantity });
    return response.data;
  }

  async removeFromCart(filmId: number) {
    const response = await this.api.delete(`/cart/${filmId}`);
    return response.data;
  }

  async updateCartItem(filmId: number, quantity: number) {
    const response = await this.api.put(`/cart/${filmId}`, { quantity });
    return response.data;
  }

  // User endpoints
  async getUsers(page = 1, pageSize = 10) {
    const response = await this.api.get(`/users?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async getUserById(id: number) {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: any) {
    const response = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number) {
    const response = await this.api.delete(`/users/${id}`);
    return response.data;
  }

  async getUsersByRole(role: string, page = 1, pageSize = 10) {
    const response = await this.api.get(`/users/role/${role}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  // Package endpoints
  async getPackages() {
    const response = await this.api.get('/packages');
    return response.data;
  }

  async getPackageById(id: number) {
    const response = await this.api.get(`/packages/${id}`);
    return response.data;
  }

  // Stock movement endpoints
  async getStockMovements(page = 1, pageSize = 10) {
    const response = await this.api.get(`/stockmovements?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async createStockMovement(movementData: any) {
    const response = await this.api.post('/stockmovements', movementData);
    return response.data;
  }

  // Financial report endpoints
  async getFinancialReports(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await this.api.get(`/financialreports?${params.toString()}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 