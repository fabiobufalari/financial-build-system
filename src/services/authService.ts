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
   * EN: Authenticates user with provided credentials
   * PT: Autentica usuário com credenciais fornecidas
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      if (DEMO_MODE) {
        return this.demoLogin(credentials);
      }

      const response = await apiClient.post(`${this.baseUrl}/login`, credentials);
      return response.data;
    } catch (error) {
      console.warn('Real API login failed, falling back to demo mode:', error);
      return this.demoLogin(credentials);
    }
  }

  /**
   * Register new user
   * EN: Registers a new user in the system
   * PT: Registra um novo usuário no sistema
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      if (DEMO_MODE) {
        return this.demoRegister(userData);
      }

      const response = await apiClient.post(`${this.baseUrl}/register`, userData);
      return response.data;
    } catch (error) {
      console.warn('Real API register failed, falling back to demo mode:', error);
      return this.demoRegister(userData);
    }
  }

  /**
   * Refresh authentication token
   * EN: Refreshes the authentication token
   * PT: Renova o token de autenticação
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      if (DEMO_MODE) {
        return this.demoRefreshToken(refreshToken);
      }

      const response = await apiClient.post(`${this.baseUrl}/refresh`, { refreshToken });
      return response.data;
    } catch (error) {
      console.warn('Real API refresh failed, falling back to demo mode:', error);
      return this.demoRefreshToken(refreshToken);
    }
  }

  /**
   * Logout user
   * EN: Logs out the current user
   * PT: Desconecta o usuário atual
   */
  async logout(): Promise<void> {
    try {
      if (!DEMO_MODE) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          await apiClient.post(`${this.baseUrl}/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
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
   * EN: Retrieves current user information
   * PT: Recupera informações do usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      if (DEMO_MODE) {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      }

      const response = await apiClient.get(`${this.baseUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
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
      return false;
    }
  }

  // Demo mode methods
  // EN: Demo mode methods for testing
  // PT: Métodos do modo demo para teste

  private async demoLogin(credentials: LoginRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    const demoUser = Object.values(DEMO_CREDENTIALS).find(
      user => user.username === credentials.username && user.password === credentials.password
    );

    if (!demoUser) {
      throw new Error('Invalid credentials');
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

