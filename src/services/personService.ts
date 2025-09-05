import apiClient from './apiClient';
// CORRIGIDO: O caminho para a configuração da API é '../config'
import { SERVICE_ENDPOINTS } from "../config/apiConfig";

const API_URL = SERVICE_ENDPOINTS.createPeople;

export const personService = {
  createPerson: async (data: any) => {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  },

  updatePerson: async (data: any) => {
    const response = await apiClient.put(`${API_URL}/${data.id}`, data);
    return response.data;
  },
};



Object.assign(personService, {
  updatePerson: async (data: any) => {
    const response = await apiClient.put(`${API_URL}/${data.id}`, data);
    return response.data;
  },
});


