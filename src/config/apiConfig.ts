// API Configuration for all microservices
// EN: Centralized configuration for all microservice endpoints
// PT: Configuração centralizada para todos os endpoints de microserviços

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface ServiceEndpoints {
  auth: string;
  accountsPayable: string;
  accountsReceivable: string;
  company: string;
  employees: string;
  suppliers: string;
  cashFlow: string;
  projects: string;
  materials: string;
  people: string;
  createPeople: string;
  reports: string;
  analytics: string;
  integrations: string;
  financialAdvanced: string;
}

// Default configuration for development
// EN: Default configuration for development environment
// PT: Configuração padrão para ambiente de desenvolvimento
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://buildingsystem.ddns.net:8443',
  timeout: 30000,
  retries: 3
};

// Export API_BASE_URL for compatibility
// EN: Export API_BASE_URL for compatibility with existing imports
// PT: Exporta API_BASE_URL para compatibilidade com imports existentes
export const API_BASE_URL = DEFAULT_API_CONFIG.baseUrl;

// Service endpoints configuration
// EN: Configuration for all microservice endpoints
// PT: Configuração para todos os endpoints de microserviços
export const SERVICE_ENDPOINTS: ServiceEndpoints = {
  auth: `${DEFAULT_API_CONFIG.baseUrl}/auth`,
  accountsPayable: `${DEFAULT_API_CONFIG.baseUrl}/accounts-payable`,
  accountsReceivable: `${DEFAULT_API_CONFIG.baseUrl}/accounts-receivable`,
  company: `${DEFAULT_API_CONFIG.baseUrl}/companies`,
  employees: `${DEFAULT_API_CONFIG.baseUrl}/employees`,
  suppliers: `${DEFAULT_API_CONFIG.baseUrl}/suppliers`,
  cashFlow: `${DEFAULT_API_CONFIG.baseUrl}/cash-flow`,
  projects: `${DEFAULT_API_CONFIG.baseUrl}/projects`,
  materials: `${DEFAULT_API_CONFIG.baseUrl}/materials`,
  people: `${DEFAULT_API_CONFIG.baseUrl}/people`,
  createPeople: `${DEFAULT_API_CONFIG.baseUrl}/create-people`,
  reports: `${DEFAULT_API_CONFIG.baseUrl}/reports`,
  analytics: `${DEFAULT_API_CONFIG.baseUrl}/analytics`,
  integrations: `${DEFAULT_API_CONFIG.baseUrl}/integrations`,
  financialAdvanced: `${DEFAULT_API_CONFIG.baseUrl}/financial-advanced`
};

// Demo mode configuration - disabled for production
// EN: Configuration for demo mode - disabled to force real authentication
// PT: Configuração para modo demo - desabilitado para forçar autenticação real
export const DEMO_MODE = false;

// Demo credentials removed for production
// EN: Demo credentials removed to ensure only real authentication is used
// PT: Credenciais demo removidas para garantir que apenas autenticação real seja usada
export const DEMO_CREDENTIALS = {};

export default {
  DEFAULT_API_CONFIG,
  SERVICE_ENDPOINTS,
  DEMO_MODE,
  DEMO_CREDENTIALS
};

