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
  reports: string;
  analytics: string;
  integrations: string;
  financialAdvanced: string;
}

// Default configuration for development
// EN: Default configuration for development environment
// PT: Configuração padrão para ambiente de desenvolvimento
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost',
  timeout: 30000,
  retries: 3
};

// Service endpoints configuration
// EN: Configuration for all microservice endpoints
// PT: Configuração para todos os endpoints de microserviços
export const SERVICE_ENDPOINTS: ServiceEndpoints = {
  auth: `${DEFAULT_API_CONFIG.baseUrl}:8081/auth`,
  accountsPayable: `${DEFAULT_API_CONFIG.baseUrl}:8088/accounts-payable`,
  accountsReceivable: `${DEFAULT_API_CONFIG.baseUrl}:8089/accounts-receivable`,
  company: `${DEFAULT_API_CONFIG.baseUrl}:8082/companies`,
  employees: `${DEFAULT_API_CONFIG.baseUrl}:8083/employees`,
  suppliers: `${DEFAULT_API_CONFIG.baseUrl}:8084/suppliers`,
  cashFlow: `${DEFAULT_API_CONFIG.baseUrl}:8085/cash-flow`,
  projects: `${DEFAULT_API_CONFIG.baseUrl}:8086/projects`,
  materials: `${DEFAULT_API_CONFIG.baseUrl}:8087/materials`,
  people: `${DEFAULT_API_CONFIG.baseUrl}:8090/people`,
  reports: `${DEFAULT_API_CONFIG.baseUrl}:8091/reports`,
  analytics: `${DEFAULT_API_CONFIG.baseUrl}:8092/analytics`,
  integrations: `${DEFAULT_API_CONFIG.baseUrl}:8093/integrations`,
  financialAdvanced: `${DEFAULT_API_CONFIG.baseUrl}:8094/financial-advanced`
};

// Demo mode configuration
// EN: Configuration for demo mode with mock data
// PT: Configuração para modo demo com dados simulados
export const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true' || true;

// Demo credentials
// EN: Demo credentials for testing purposes
// PT: Credenciais demo para fins de teste
export const DEMO_CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    roles: ['ADMIN', 'MANAGER'],
    permissions: ['CREATE', 'READ', 'UPDATE', 'DELETE']
  },
  manager: {
    username: 'manager',
    password: 'manager123',
    roles: ['MANAGER'],
    permissions: ['CREATE', 'READ', 'UPDATE']
  },
  user: {
    username: 'user',
    password: 'user123',
    roles: ['USER'],
    permissions: ['READ']
  },
  fabio: {
    username: 'fabiobufalari',
    password: '12345678!',
    roles: ['ADMIN', 'MANAGER'],
    permissions: ['CREATE', 'READ', 'UPDATE', 'DELETE']
  }
};

export default {
  DEFAULT_API_CONFIG,
  SERVICE_ENDPOINTS,
  DEMO_MODE,
  DEMO_CREDENTIALS
};

