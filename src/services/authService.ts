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

// Interface para o que a API REALMENTE retorna no corpo da resposta de login/registro/refresh
export interface RealApiAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number; // Tempo de expiração do token (em segundos, por exemplo)
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  companyId?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para os dados do usuário que serão armazenados e usados no frontend
export interface UserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[]; // Calculadas no frontend
  companyId?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para os tokens que serão armazenados e passados para o store de autenticação
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Em segundos
  tokenType: string; // Ex: 'Bearer'
}

// Normalized response para frontend (o que o frontend realmente usa e espera)
// Esta é a interface que `authService.login` e outros retornarão.
export interface AuthResponse {
  tokens: AuthTokens; // Contém accessToken, refreshToken, expiresIn, tokenType
  user: UserData; // Contém os dados do usuário
}

// 'User' agora é um alias para 'UserData' para consistência
export interface User extends UserData {}

class AuthService {
  private baseUrl = SERVICE_ENDPOINTS.auth;

  // Método para normalizar a resposta bruta da API para o formato esperado pelo frontend
  private normalizeApiResponse(realResponse: RealApiAuthResponse): AuthResponse {
    const permissions = realResponse.roles.includes('ROLE_ADMIN')
      ? ['CREATE', 'READ', 'UPDATE', 'DELETE']
      : realResponse.roles.includes('ROLE_MANAGER')
      ? ['CREATE', 'READ', 'UPDATE']
      : ['READ'];

    return {
      tokens: {
        accessToken: realResponse.accessToken,
        refreshToken: realResponse.refreshToken,
        expiresIn: realResponse.expiresIn || 3600, // Usa da API ou 1 hora padrão
        tokenType: 'Bearer' // Assumindo que sempre será Bearer
      },
      user: {
        id: realResponse.userId,
        username: realResponse.username,
        email: realResponse.email,
        firstName: realResponse.firstName,
        lastName: realResponse.lastName,
        roles: realResponse.roles,
        permissions,
        companyId: realResponse.companyId,
        isActive: realResponse.isActive,
        lastLogin: realResponse.lastLogin,
        createdAt: realResponse.createdAt,
        updatedAt: realResponse.updatedAt,
      }
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<RealApiAuthResponse>(`${this.baseUrl}/login`, credentials);
      const normalizedResponse = this.normalizeApiResponse(response.data);

      localStorage.setItem('accessToken', normalizedResponse.tokens.accessToken);
      localStorage.setItem('refreshToken', normalizedResponse.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      // Não precisamos armazenar expiresIn ou tokenType aqui, pois eles estão no `normalizedResponse.tokens`
      // e o `setAuthData` do store cuidará disso.

      return normalizedResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<RealApiAuthResponse>(`${this.baseUrl}/register`, userData);
      const normalizedResponse = this.normalizeApiResponse(response.data);

      localStorage.setItem('accessToken', normalizedResponse.tokens.accessToken);
      localStorage.setItem('refreshToken', normalizedResponse.tokens.refreshToken);
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

      localStorage.setItem('accessToken', normalizedResponse.tokens.accessToken);
      localStorage.setItem('refreshToken', normalizedResponse.tokens.refreshToken);
      // Se o refresh token também atualizar os dados do usuário, armazene user aqui também:
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
      // Se o token for inválido/malformado, mas houver um usuário no localStorage,
      // podemos considerar autenticado, mas o ideal é que o token JWT seja a única fonte de verdade.
      // Para fins de segurança, é melhor ser mais rigoroso e pedir novo login.
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return false; 
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