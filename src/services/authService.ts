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
  userId: string
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

/**
 * Dados mock para demonstração
 * Mock data for demonstration
 */
const MOCK_USERS = [
  {
    username: 'fabiobufalari',
    password: '12345678!',
    userData: {
      userId: '1',
      username: 'fabiobufalari',
      email: 'bufalari.fabio@gmail.com',
      firstName: 'Fabio',
      lastName: 'Bufalari',
      roles: ['Administrator', 'Manager']
    }
  },
  {
    username: 'admin',
    password: 'admin123',
    userData: {
      userId: '2',
      username: 'admin',
      email: 'admin@financialsolutions.com',
      firstName: 'Admin',
      lastName: 'User',
      roles: ['Administrator']
    }
  },
  {
    username: 'user',
    password: 'user123',
    userData: {
      userId: '3',
      username: 'user',
      email: 'user@financialsolutions.com',
      firstName: 'Regular',
      lastName: 'User',
      roles: ['User']
    }
  }
]

/**
 * Serviço que gerencia a autenticação do usuário
 * Service that manages user authentication
 */
class AuthService {
  /**
   * Realiza o login do usuário (versão mock)
   * Performs user login (mock version)
   * 
   * @param credentials - Credenciais do usuário (username e senha)
   * @returns Promise com os dados de autenticação
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simula delay de rede
      // Simulates network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Busca usuário nas credenciais mock
      // Search for user in mock credentials
      const mockUser = MOCK_USERS.find(
        user => user.username === credentials.username && user.password === credentials.password
      )
      
      if (!mockUser) {
        throw new Error('Invalid credentials')
      }
      
      // Gera tokens mock
      // Generates mock tokens
      const accessToken = `mock-access-token-${Date.now()}`
      const refreshToken = `mock-refresh-token-${Date.now()}`
      
      return {
        accessToken,
        refreshToken,
        ...mockUser.userData
      }
    } catch (error) {
      console.error('Erro ao realizar login / Error performing login:', error)
      throw error
    }
  }

  /**
   * Realiza o logout do usuário (versão mock)
   * Performs user logout (mock version)
   */
  async logout(token: string): Promise<void> {
    try {
      // Simula delay de rede
      // Simulates network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Logout realizado com sucesso / Logout performed successfully')
    } catch (error) {
      console.error('Erro ao realizar logout / Error performing logout:', error)
      throw error
    }
  }

  /**
   * Atualiza o token de acesso usando o refresh token (versão mock)
   * Updates the access token using the refresh token (mock version)
   * 
   * @param refreshToken - Token de atualização
   * @returns Promise com os novos tokens
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Simula delay de rede
      // Simulates network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Gera novos tokens mock
      // Generates new mock tokens
      const newAccessToken = `mock-access-token-${Date.now()}`
      const newRefreshToken = `mock-refresh-token-${Date.now()}`
      
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    } catch (error) {
      console.error('Erro ao atualizar token / Error refreshing token:', error)
      throw error
    }
  }

  /**
   * Verifica se o usuário está autenticado (versão mock)
   * Checks if the user is authenticated (mock version)
   * 
   * @returns Promise com o status de autenticação
   */
  async checkAuth(token: string): Promise<boolean> {
    try {
      // Simula delay de rede
      // Simulates network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Verifica se o token é válido (mock)
      // Checks if token is valid (mock)
      return token && token.startsWith('mock-access-token')
    } catch (error) {
      return false
    }
  }
}

// Exporta uma instância única do AuthService para ser usada em toda a aplicação
// Exports a single instance of AuthService to be used throughout the application
export const authService = new AuthService()

