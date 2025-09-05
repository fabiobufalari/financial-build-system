// Type definitions for the application
// EN: Type definitions for user authentication and application data
// PT: Definições de tipos para autenticação de usuário e dados da aplicação

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  companyId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyId?: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  taxId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  documentNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  personId: string;
  companyId: string;
  person: Person;
  company: Company;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  workLocation?: {
    type: 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FIELD';
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate?: string;
  budget: number;
  companyId: string;
  managerId: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  unit: string;
  unitPrice: number;
  category: string;
  supplier?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  taxId: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountsPayable {
  id: string;
  supplierId: string;
  supplier: Supplier;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  description: string;
  invoiceNumber?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountsReceivable {
  id: string;
  customerId: string;
  customer: Company;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'RECEIVED' | 'OVERDUE' | 'CANCELLED';
  description: string;
  invoiceNumber?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashFlow {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  date: string;
  description: string;
  category: string;
  companyId: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalEmployees: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingPayables: number;
  pendingReceivables: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

export interface NotificationData {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: string[];
  statusCode: number;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message: string;
}

export type ApiResponseType<T = any> = SuccessResponse<T> | ErrorResponse;

