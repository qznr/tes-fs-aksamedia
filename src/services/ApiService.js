import axios from 'axios';
import { useLocalStorage } from './localStorageService';

const { getItem } = useLocalStorage();

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  // Auth
  async login(credentials) {
    try {
      const response = await apiClient.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async logout() {
    try {
      const response = await apiClient.post('/logout');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Employees
  async getEmployees(params = {}) {
    try {
      const response = await apiClient.get('/employees', { params });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async createEmployee(employeeData) {
    try {
      const response = await apiClient.post('/employees', employeeData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async updateEmployee(employeeId, employeeData) {
    try {
      employeeData.append('_method', 'PUT');
      
      const response = await apiClient.post(`/employees/${employeeId}`, employeeData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async deleteEmployee(employeeId) {
    try {
      const response = await apiClient.delete(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Divisions
  async getDivisions(params = {}) {
    try {
      const response = await apiClient.get('/divisions', { params });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};