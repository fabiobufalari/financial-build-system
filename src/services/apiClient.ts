import axios from 'axios';
// CORRIGIDO: Usando caminho absoluto a partir da raiz do projeto.
import { API_BASE_URL } from '../config/apiConfig';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState();
    if (tokens?.accessToken) {
      config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
