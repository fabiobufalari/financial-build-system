import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';
import { apiClient } from '../../services/apiClient';
import { SERVICE_ENDPOINTS } from '../../config/apiConfig';
import './LoginPage.css';

// EN: Enhanced login page with real API connectivity and better user feedback
// PT: Página de login aprimorada com conectividade de API real e melhor feedback ao usuário

interface ConnectionStatus {
  isConnected: boolean;
  responseTime?: number;
  error?: string;
  isChecking: boolean;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: setAuthData } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isChecking: true
  });

  // Check API connectivity on component mount
  useEffect(() => {
    checkApiConnectivity();
  }, []);

  const checkApiConnectivity = async () => {
    setConnectionStatus(prev => ({ ...prev, isChecking: true }));
    
    try {
      const result = await apiClient.testConnectivity(SERVICE_ENDPOINTS.auth);
      setConnectionStatus({
        isConnected: result.isConnected,
        responseTime: result.responseTime,
        error: result.error,
        isChecking: false
      });
      
      if (result.isConnected) {
        console.log(`✅ API connected successfully (${result.responseTime}ms)`);
      } else {
        console.warn(`❌ API connection failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Connectivity check failed:', error);
      setConnectionStatus({
        isConnected: false,
        error: 'Failed to check connectivity',
        isChecking: false
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Attempting login for user:', formData.username);
      
      const authResponse = await authService.login({
        username: formData.username,
        password: formData.password
      });

      console.log('✅ Login successful:', authResponse);
      
      // Armazena os tokens e dados do usuário
      // Stores tokens and user data
      const userData = {
        id: authResponse.user.id,
        username: authResponse.user.username,
        firstName: authResponse.user.firstName,
        lastName: authResponse.user.lastName,
        email: authResponse.user.email,
        roles: authResponse.user.roles
      }
      
      const tokens = {
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken
      }

      // Update auth store
      setAuthData(tokens, userData);
      
      console.log('🎉 Authentication successful, redirecting to dashboard');
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      
      let errorMessage = 'Erro ao fazer login';
      
      if (err.message) {
        if (err.message.includes('Invalid credentials') || err.message.includes('user not found')) {
          errorMessage = 'Usuário ou senha incorretos';
        } else if (err.message.includes('Network error') || err.message.includes('ECONNREFUSED')) {
          errorMessage = 'Erro de conexão com o servidor. Tentando modo offline...';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getConnectionStatusDisplay = () => {
    if (connectionStatus.isChecking) {
      return (
        <div className="connection-status checking">
          <span className="status-icon">🔄</span>
          <span>Verificando conexão...</span>
        </div>
      );
    }
    
    if (connectionStatus.isConnected) {
      return (
        <div className="connection-status connected">
          <span className="status-icon">🟢</span>
          <span>API conectada ({connectionStatus.responseTime}ms)</span>
        </div>
      );
    }
    
    return (
      <div className="connection-status disconnected">
        <span className="status-icon">🔴</span>
        <span>API offline - Modo demo disponível</span>
        <button 
          type="button" 
          className="retry-button"
          onClick={checkApiConnectivity}
          disabled={connectionStatus.isChecking}
        >
          🔄 Tentar novamente
        </button>
      </div>
    );
  };

  const getDemoCredentials = () => {
    return (
      <div className="demo-credentials">
        <h4>🧪 Credenciais Demo (quando API offline):</h4>
        <div className="credentials-list">
          <div className="credential-item">
            <strong>Admin:</strong> admin / admin123
          </div>
          <div className="credential-item">
            <strong>Manager:</strong> fabiobufalari / 12345678!
          </div>
          <div className="credential-item">
            <strong>User:</strong> user / user123
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🏗️</span>
            <h1>Financial Recovery</h1>
          </div>
          <p className="subtitle">Sistema de Gestão Financeira</p>
        </div>

        {/* Connection Status */}
        <div className="connection-section">
          {getConnectionStatusDisplay()}
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Digite seu usuário"
              disabled={isLoading}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Demo credentials info */}
        {!connectionStatus.isConnected && !connectionStatus.isChecking && (
          <div className="demo-section">
            {getDemoCredentials()}
          </div>
        )}

        {/* API Status Info */}
        <div className="api-info">
          <h4>📡 Status da API:</h4>
          <div className="api-details">
            <div className="api-item">
              <strong>Endpoint:</strong> {SERVICE_ENDPOINTS.auth}
            </div>
            <div className="api-item">
              <strong>Modo:</strong> {connectionStatus.isConnected ? 'Produção' : 'Demo/Offline'}
            </div>
            {connectionStatus.error && (
              <div className="api-item error">
                <strong>Erro:</strong> {connectionStatus.error}
              </div>
            )}
          </div>
        </div>

        <div className="login-footer">
          <p>© 2024 Financial Recovery System</p>
          <p>Desenvolvido para gestão financeira empresarial</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

