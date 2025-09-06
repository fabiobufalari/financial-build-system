import create from 'zustand';
// CORRIGIDO: Usando caminho absoluto a partir da raiz do projeto.
import { User, AuthTokens } from "../types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  setAuthData: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
}

const getInitialUser = (): User | null => {
  try {
    const userItem = localStorage.getItem('user');
    return userItem ? JSON.parse(userItem) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('tokens'),
  user: getInitialUser(),
  tokens: JSON.parse(localStorage.getItem('tokens') || 'null'),

  setAuthData: (user: User, tokens: AuthTokens) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('tokens', JSON.stringify(tokens));
    set({
      isAuthenticated: true,
      user,
      tokens,
    });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
    set({
      isAuthenticated: false,
      user: null,
      tokens: null,
    });
  },
}));
