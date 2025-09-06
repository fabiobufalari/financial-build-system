import apiClient from './apiClient';
import { SERVICE_ENDPOINTS } from '../config/apiConfig';

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

// Real API response interface (o que sua API realmente retorna)
export interface RealApiAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number; // Adicionado, caso sua API retorne o tempo de expiração aqui
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  // Adicionado para consistência com o que o LoginPage.tsx espera
  companyId?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para os dados do usuário, usada internamente e no AuthResponse
export interface UserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  companyId?: string; // Tornando opcional, se a API não retornar sempre
  isActive?: boolean; // Tornando opcional
  lastLogin?: string; // Tornando opcional
  createdAt?: string; // Tornando opcional
  updatedAt?: string; // Tornando opcional
}

// Normalized response para frontend (o que o frontend realmente usa e espera)
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserData; // Usando a nova interface UserData
  expiresIn: number; // Agora é obrigatório aqui, definido por padrão no normalizeApiResponse
}

// Esta interface User parece ser para o `getCurrentUser`, vamos alinhá-la com UserData
export interface User extends UserData {} // 'User' agora estende 'UserData' para consistência

class AuthService {
  private baseUrl = SERVICE_ENDPOINTS.auth;

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
        permissions,
        // ✅ Adicionado: Mapeia as novas propriedades da API para UserData
        companyId: realResponse.companyId,
        isActive: realResponse.isActive,
        lastLogin: realResponse.lastLogin,
        createdAt: realResponse.createdAt,
        updatedAt: realResponse.updatedAt,
      },
      expiresIn: realResponse.expiresIn || 3600 // Usar da API se disponível, senão padrão de 1 hora
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<RealApiAuthResponse>(`${this.baseUrl}/login`, credentials);
      const normalizedResponse = this.normalizeApiResponse(response.data);

      localStorage.setItem('accessToken', normalizedResponse.accessToken);
      localStorage.setItem('refreshToken', normalizedResponse.refreshToken);
      // Armazenar o objeto user completo
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
      // Se o refresh token também atualizar os dados do usuário, você pode precisar armazenar user aqui também.
      // Por simplicidade, vou manter apenas tokens como era, mas ajuste se necessário.
      // localStorage.setItem('user', JSON.stringify(normalizedResponse.user)); 

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
      // Retorna UserData, que agora é a mesma que a interface User
      return normalizedResponse.user; 
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
      // Se o token for inválido, mas houver um usuário no localStorage,
      // podemos considerar autenticado, mas é bom ter cuidado aqui.
      // O ideal é que o token JWT seja a única fonte de verdade.
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

export const authService = new AuthService();
export default authService;