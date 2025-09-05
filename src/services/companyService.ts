import apiClient from './apiClient';
// CORRIGIDO: O caminho para a configuração da API é '../config'
import { SERVICE_ENDPOINTS } from "../config/apiConfig";

const API_URL = SERVICE_ENDPOINTS.company;

export const companyService = {
  getCompanyInfo: async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  },

  updateCompanyInfo: async (data: any) => {
    const response = await apiClient.put(API_URL, data);
    return response.data;
  },
};
