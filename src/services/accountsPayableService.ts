import apiClient from './apiClient';
import { SERVICE_ENDPOINTS } from '../config/apiConfig';

// O serviço volta a ser simples: apenas faz chamadas de API.
const accountsPayableService = {
  getAll: async () => {
    const response = await apiClient.get(SERVICE_ENDPOINTS.accountsPayable);
    return response.data;
  },

  create: async (accountData: any) => {
    const response = await apiClient.post(SERVICE_ENDPOINTS.accountsPayable, accountData);
    return response.data;
  },
  
  // ... outros métodos (getById, update, delete) seguem o mesmo padrão.
};

export default accountsPayableService;
