import apiClient from './apiClient';
// CORRIGIDO: O caminho para a configuração da API é '../config'
import { SERVICE_ENDPOINTS } from '../config/apiConfig';

const API_URL = SERVICE_ENDPOINTS.accountsReceivable;

export const accountsReceivableService = {
  // Exemplo de como seus métodos podem ser
  getAll: async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  },
};
