import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Interface que define os tokens de autenticação
 * Interface that defines the authentication tokens
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * Interface que define o usuário autenticado
 * Interface that defines the authenticated user
 */
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  permissions?: string[]
}

/**
 * Interface que define o estado de autenticação
 * Interface that defines the authentication state
 */
interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  setAuthData: (tokens: AuthTokens, user: User) => void
  login: (tokens: AuthTokens, user: User) => void
  logout: () => void
  updateTokens: (tokens: AuthTokens) => void
}

/**
 * Store Zustand para gerenciar o estado de autenticação
 * Zustand store to manage authentication state
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      
      /**
       * Função para definir dados de autenticação (tokens e usuário)
       * Function to set authentication data (tokens and user)
       * 
       * @param tokens - Tokens de autenticação (access e refresh)
       * @param user - Dados do usuário autenticado
       */
      setAuthData: (tokens: AuthTokens, user: User) => set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
        isAuthenticated: true,
      }),
      
      /**
       * Função para realizar login e armazenar tokens e dados do usuário
       * Function to perform login and store tokens and user data
       * 
       * @param tokens - Tokens de autenticação (access e refresh)
       * @param user - Dados do usuário autenticado
       */
      login: (tokens: AuthTokens, user: User) => set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
        isAuthenticated: true,
      }),
      
      /**
       * Função para realizar logout e limpar dados de autenticação
       * Function to perform logout and clear authentication data
       */
      logout: () => set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      }),
      
      /**
       * Função para atualizar tokens (usado no refresh token)
       * Function to update tokens (used in refresh token)
       * 
       * @param tokens - Novos tokens de autenticação
       */
      updateTokens: (tokens: AuthTokens) => set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }),
    }),
    {
      name: 'auth-storage', // Nome do storage no localStorage / Name of storage in localStorage
    }
  )
)

