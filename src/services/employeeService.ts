import apiClient from './apiClient';
// CORRIGIDO: O caminho para a configuração da API é '../config'
import { SERVICE_ENDPOINTS } from "../config/apiConfig";

const API_URL = SERVICE_ENDPOINTS.employees;

export const employeeService = {
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

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  },
};



export interface Employee {
  id: string;
  employeeId: string;
  personId: string;
  companyId: string;
  person: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  company: {
    name: string;
    address: string;
  };
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: string;
  workLocation?: {
    type: 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FIELD';
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

// Expanding the service with all CRUD operations
Object.assign(employeeService, {
  getEmployees: async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  },
  createEmployee: async (data: any) => {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  },
  updateEmployee: async (id: string, data: any) => {
    const response = await apiClient.put(`${API_URL}/${id}`, data);
    return response.data;
  },
  deleteEmployee: async (id: string) => {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  },
});


