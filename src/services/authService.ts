import { apiClient } from './apiClient'

/**
 * Interface para os dados de login
 * Interface for login data
 */
interface LoginCredentials {
  username: string
  password: string
}

/**
 * Interface para a resposta de autenticação
 * Interface for authentication response
 */
interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username: string
    email: string
    name: string
    role: string
  }
}

/**
 * Serviço que gerencia a autenticação do usuário
 * Service that manages user authentication
 */
class AuthService {
  /**
   * Realiza o login do usuário
   * Performs user login
   * 
   * @param credentials - Credenciais do usuário (username/email e senha)
   * @returns Promise com os dados de autenticação
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials)
      return response.data
    } catch (error) {
      console.error('Erro ao realizar login / Error performing login:', error)
      throw error
    }
  }

  /**
   * Realiza o logout do usuário
   * Performs user logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout')
    } catch (error) {
      console.error('Erro ao realizar logout / Error performing logout:', error)
      throw error
    }
  }

  /**
   * Atualiza o token de acesso usando o refresh token
   * Updates the access token using the refresh token
   * 
   * @param refreshToken - Token de atualização
   * @returns Promise com os novos tokens
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        '/api/auth/refresh',
        { refreshToken }
      )
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar token / Error refreshing token:', error)
      throw error
    }
  }

  /**
   * Verifica se o usuário está autenticado
   * Checks if the user is authenticated
   * 
   * @returns Promise com o status de autenticação
   */
  async checkAuth(): Promise<boolean> {
    try {
      await apiClient.get('/api/auth/check')
      return true
    } catch (error) {
      return false
    }
  }
}

// Exporta uma instância única do AuthService para ser usada em toda a aplicação
// Exports a single instance of AuthService to be used throughout the application
export const authService = new AuthService()
