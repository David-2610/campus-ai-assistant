import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/constants';

const api = axios.create({
  baseURL: API_BASE_URL.endsWith('/') ? API_BASE_URL : API_BASE_URL + '/',
  timeout: 15000,
});

// Attach token automatically to every request
api.interceptors.request.use(
  async (config) => {
    // Prevent leading slash from overwriting the baseURL path segment
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1);
    }
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // SecureStore may not be available in some environments
      console.log('SecureStore read error:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors globally
// The navigation reset is handled by AuthContext checking auth state
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
      } catch (err) {
        console.log('SecureStore delete error:', err);
      }
      // The AuthContext will detect the missing token and redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
