import { apiClient } from './apiClient';
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
   * Login user with credentials
   * EN: Authenticates user with provided credentials - tries real API first
   * PT: Autentica usuário com credenciais fornecidas - tenta API real primeiro
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Always try real API first, regardless of DEMO_MODE
    try {
      console.log('Attempting login with real API:', this.baseUrl);
      const response = await apiClient.post(`${this.baseUrl}/login`, credentials);
      console.log('Real API login successful:', response.data);
      
      // Store tokens for real API
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.warn('Real API login failed, error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: `${this.baseUrl}/login`
      });
      
      // Only fall back to demo if explicitly enabled or if it's a connection error
      if (DEMO_MODE || error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        console.log('Falling back to demo mode');
        return this.demoLogin(credentials);
      }
      
      // Re-throw the error for real authentication failures
      throw error;
    }
  }

  /**
   * Register new user
   * EN: Registers a new user in the system - tries real API first
   * PT: Registra um novo usuário no sistema - tenta API real primeiro
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting registration with real API:', this.baseUrl);
      const response = await apiClient.post(`${this.baseUrl}/register`, userData);
      console.log('Real API registration successful');
      
      // Store tokens for real API
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.warn('Real API registration failed:', error);
      
      // Only fall back to demo if explicitly enabled or if it's a connection error
      if (DEMO_MODE || error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        console.log('Falling back to demo registration');
        return this.demoRegister(userData);
      }
      
      throw error;
    }
  }

  /**
   * Refresh authentication token
   * EN: Refreshes the authentication token - tries real API first
   * PT: Renova o token de autenticação - tenta API real primeiro
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/refresh`, { refreshToken });
      
      // Store new tokens
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      console.warn('Real API refresh failed:', error);
      
      if (DEMO_MODE || error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        return this.demoRefreshToken(refreshToken);
      }
      
      throw error;
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
      if (token && !DEMO_MODE) {
        await apiClient.post(`${this.baseUrl}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
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

      // Try real API first
      if (!DEMO_MODE) {
        try {
          const response = await apiClient.get(`${this.baseUrl}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return response.data;
        } catch (error) {
          console.warn('Real API getCurrentUser failed, falling back to local storage:', error);
        }
      }

      // Fallback to local storage
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.warn('Get current user failed:', error);
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
      console.warn('API health check failed:', error);
      return false;
    }
  }

  // Demo mode methods (fallback only)
  // EN: Demo mode methods for testing when API is unavailable
  // PT: Métodos do modo demo para teste quando API não está disponível

  private async demoLogin(credentials: LoginRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    const demoUser = Object.values(DEMO_CREDENTIALS).find(
      user => user.username === credentials.username && user.password === credentials.password
    );

    if (!demoUser) {
      throw new Error('Invalid credentials - user not found in demo database');
    }

    const user = generateDemoUser(demoUser);
    const accessToken = this.generateDemoToken(user);
    const refreshToken = this.generateDemoRefreshToken(user);

    const authResponse: AuthResponse = {
      accessToken,
      refreshToken,
      user,
      expiresIn: 3600
    };

    // Store in localStorage for demo
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return authResponse;
  }

  private async demoRegister(userData: RegisterRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    const user: User = {
      id: `demo-${Date.now()}`,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      roles: userData.roles || ['USER'],
      permissions: ['READ'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const accessToken = this.generateDemoToken(user);
    const refreshToken = this.generateDemoRefreshToken(user);

    const authResponse: AuthResponse = {
      accessToken,
      refreshToken,
      user,
      expiresIn: 3600
    };

    // Store in localStorage for demo
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return authResponse;
  }

  private async demoRefreshToken(refreshToken: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('No user found');
    }

    const user = JSON.parse(userStr);
    const newAccessToken = this.generateDemoToken(user);
    const newRefreshToken = this.generateDemoRefreshToken(user);

    const authResponse: AuthResponse = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
      expiresIn: 3600
    };

    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return authResponse;
  }

  private generateDemoToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    }));
    const signature = btoa('demo-signature');
    return `${header}.${payload}.${signature}`;
  }

  private generateDemoRefreshToken(user: User): string {
    const payload = btoa(JSON.stringify({
      sub: user.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 604800 // 7 days
    }));
    return `refresh.${payload}.demo-signature`;
  }
}

export const authService = new AuthService();
export default authService;

