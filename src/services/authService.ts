import apiClient from './apiClient';
import { SERVICE_ENDPOINTS } from '../config/apiConfig';

// ✅ Ajustado: Removidos DEMO_MODE e DEMO_CREDENTIALS para produção
// ✅ Comentários mantidos bilíngues para clareza

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

// ✅ Real API response interface revisada
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

// ✅ Normalized response para frontend
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

class AuthService {
  private baseUrl = SERVICE_ENDPOINTS.auth;

  // ✅ Corrigido: normalizeApiResponse agora garante permissions consistentes
  private normalizeApiResponse(realResponse: RealApiAuthResponse): AuthResponse {
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
        permissions
      },
      expiresIn: 3600 // ✅ Mantido default 1 hora
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<RealApiAuthResponse>(`${this.baseUrl}/login`, credentials);
      const normalizedResponse = this.normalizeApiResponse(response.data);

      // ✅ Armazenamento seguro dos tokens e user
      localStorage.setItem('accessToken', normalizedResponse.accessToken);
      localStorage.setItem('refreshToken', normalizedResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(normalizedResponse.user));

      return normalizedResponse;
    } catch (error: any) {
      // ✅ Mensagem de erro clara
      throw new Error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<RealApiAuthResponse>(`${this.baseUrl}/register`, userData);
      const normalizedResponse = this.normalizeApiResponse(response.data);

      localStorage.setItem('accessToken', normalizedResponse.accessToken);
      localStorage.setItem('refreshToken', normalizedResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(normalizedResponse.user));

      return normalizedResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<RealApiAuthResponse>(`${this.baseUrl}/refresh`, { refreshToken });
      const normalizedResponse = this.normalizeApiResponse(response.data);

      localStorage.setItem('accessToken', normalizedResponse.accessToken);
      localStorage.setItem('refreshToken', normalizedResponse.refreshToken);

      return normalizedResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed. Please login again.');
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await apiClient.post(`${this.baseUrl}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.warn('⚠️ Logout API call failed', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const response = await apiClient.get<RealApiAuthResponse>(`${this.baseUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const normalizedResponse = this.normalizeApiResponse(response.data);
      return { ...normalizedResponse.user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return !!localStorage.getItem('user');
    }
  }

  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/health`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// ✅ Export corrigido para consistência
export const authService = new AuthService();
export default authService;
