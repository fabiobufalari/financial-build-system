import apiClient from './apiClient';
import { SERVICE_ENDPOINTS, DEMO_MODE, DEMO_CREDENTIALS } from '../config/apiConfig';

// EN: Authentication service with real API integration and demo fallback
// PT: Serviço de autenticação com integração de API real e fallback demo

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

// Real API response structure (based on actual API testing)
// EN: Real API response structure from buildingteste.ddns.net:8081
// PT: Estrutura real da resposta da API de buildingteste.ddns.net:8081
export interface RealApiAuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

// Normalized response structure for frontend
// EN: Normalized response structure for consistent frontend usage
// PT: Estrutura de resposta normalizada para uso consistente no frontend
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
  };
  expiresIn: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// Demo data for testing
// EN: Demo data for testing purposes
// PT: Dados demo para fins de teste
const generateDemoUser = (credentials: any): User => ({
  id: `demo-${credentials.username}`,
  username: credentials.username,
  email: `${credentials.username}@demo.com`,
  firstName: credentials.username === 'fabiobufalari' ? 'Fabio' : credentials.username.charAt(0).toUpperCase() + credentials.username.slice(1),
  lastName: credentials.username === 'fabiobufalari' ? 'Bufalari' : 'Demo',
  roles: credentials.roles,
  permissions: credentials.permissions,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

class AuthService {
  private baseUrl = SERVICE_ENDPOINTS.auth;

  /**
   * Normalize real API response to frontend expected structure
   * EN: Converts real API response to normalized structure
   * PT: Converte resposta real da API para estrutura normalizada
   */
  private normalizeApiResponse(realResponse: RealApiAuthResponse): AuthResponse {
    // Map roles to permissions (basic mapping)
    const permissions = realResponse.roles.includes('ROLE_ADMIN') 
      ? ['CREATE', 'READ', 'UPDATE', 'DELETE']
      : realResponse.roles.includes('ROLE_MANAGER')
      ? ['CREATE', 'READ', 'UPDATE']
      : ['READ'];

    return {
      accessToken: realResponse.accessToken,
      refreshToken: realResponse.refreshToken,
      user: {
        id: realResponse.userId,
        username: realResponse.username,
        email: realResponse.email,
        firstName: realResponse.firstName,
        lastName: realResponse.lastName,
        roles: realResponse.roles,
        permissions: permissions
      },
      expiresIn: 3600 // Default to 1 hour, could be extracted from JWT
    };
  }

  /**
   * Login user with credentials
   * EN: Authenticates user with provided credentials - tries real API first
   * PT: Autentica usuário com credenciais fornecidas - tenta API real primeiro
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Always try real API first, regardless of DEMO_MODE
    try {
      console.log('🔐 Attempting login with real API:', this.baseUrl);
      const response = await apiClient.post<RealApiAuthResponse>(`${this.baseUrl}/login`, credentials);
      console.log('✅ Real API login successful:', response.data);
      
      // Normalize the response to expected structure
      const normalizedResponse = this.normalizeApiResponse(response.data);
      
      // Store tokens for real API
      if (normalizedResponse.accessToken) {
        localStorage.setItem('accessToken', normalizedResponse.accessToken);
      }
      if (normalizedResponse.refreshToken) {
        localStorage.setItem('refreshToken', normalizedResponse.refreshToken);
      }
      if (normalizedResponse.user) {
        localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      }
      
      console.log('🎉 Login normalized and stored successfully');
      return normalizedResponse;
    } catch (error: any) {
      console.error('❌ Real API login failed, error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: `${this.baseUrl}/login`
      });
      
      // No fallback to demo mode - throw the actual error
      throw new Error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
    }
  }

  /**
   * Register new user
   * EN: Registers a new user in the system - tries real API first
   * PT: Registra um novo usuário no sistema - tenta API real primeiro
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting registration with real API:', this.baseUrl);
      const response = await apiClient.post<RealApiAuthResponse>(`${this.baseUrl}/register`, userData);
      console.log('✅ Real API registration successful');
      
      // Normalize the response
      const normalizedResponse = this.normalizeApiResponse(response.data);
      
      // Store tokens for real API
      if (normalizedResponse.accessToken) {
        localStorage.setItem('accessToken', normalizedResponse.accessToken);
      }
      if (normalizedResponse.refreshToken) {
        localStorage.setItem('refreshToken', normalizedResponse.refreshToken);
      }
      if (normalizedResponse.user) {
        localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      }
      
      return normalizedResponse;
    } catch (error: any) {
      console.error('❌ Real API registration failed:', error);
      
      // No fallback to demo mode - throw the actual error
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }

  /**
   * Refresh authentication token
   * EN: Refreshes the authentication token - tries real API first
   * PT: Renova o token de autenticação - tenta API real primeiro
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<RealApiAuthResponse>(`${this.baseUrl}/refresh`, { refreshToken });
      
      // Normalize the response
      const normalizedResponse = this.normalizeApiResponse(response.data);
      
      // Store new tokens
      if (normalizedResponse.accessToken) {
        localStorage.setItem('accessToken', normalizedResponse.accessToken);
      }
      if (normalizedResponse.refreshToken) {
        localStorage.setItem('refreshToken', normalizedResponse.refreshToken);
      }
      
      return normalizedResponse;
    } catch (error: any) {
      console.error('❌ Real API refresh failed:', error);
      
      // No fallback to demo mode - throw the actual error
      throw new Error(error.response?.data?.message || 'Token refresh failed. Please login again.');
    }
  }

  /**
   * Logout user
   * EN: Logs out the current user - tries real API first
   * PT: Desconecta o usuário atual - tenta API real primeiro
   */
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await apiClient.post(`${this.baseUrl}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.warn('⚠️ Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user info
   * EN: Retrieves current user information - tries real API first
   * PT: Recupera informações do usuário atual - tenta API real primeiro
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      // Try real API only
      try {
        const response = await apiClient.get<RealApiAuthResponse>(`${this.baseUrl}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Convert to User format
        const normalizedResponse = this.normalizeApiResponse(response.data);
        return {
          ...normalizedResponse.user,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error('❌ Real API getCurrentUser failed:', error);
        // Clear invalid token and return null
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return null;
      }
    } catch (error) {
      console.warn('❌ Get current user failed:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * EN: Checks if user is currently authenticated
   * PT: Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      // Simple token expiration check (for JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      // If token parsing fails, check if we have user data (for demo mode)
      const user = localStorage.getItem('user');
      return !!user;
    }
  }

  /**
   * Check API health
   * EN: Checks if the authentication API is available
   * PT: Verifica se a API de autenticação está disponível
   */
  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/health`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('⚠️ API health check failed:', error);
      return false;
    }
  }

  // Demo methods removed for production
  // EN: Demo methods removed to ensure only real API authentication
  // PT: Métodos demo removidos para garantir apenas autenticação real da API
}

export const authService = new AuthService();
export default authService;

