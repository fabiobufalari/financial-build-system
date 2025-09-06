import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Certifique-se de que AuthResponse, AuthTokens e UserData são exportados de authService
// OU ajuste o caminho se elas estiverem em um arquivo de tipos separado (e.g., ../../types/auth)
import { authService, AuthResponse, AuthTokens, UserData } from '../../services/authService'; 
import { loggingService } from '../../services/loggingService';
import { useAuthStore } from '../../stores/authStore';
import './LoginPage.css';

interface LoginFormData {
  username: string;
  password: string;
}

interface ApiStatus {
  connected: boolean;
  endpoint: string;
  mode: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // setAuthData espera (tokens: AuthTokens, userData: UserData)
  const { setAuthData } = useAuthStore(); 

  const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    connected: false,
    endpoint: 'https://buildingsystem.ddns.net:8443/auth/login',
    mode: 'production'
  });

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Para uma checagem de status de API mais robusta, é melhor usar um endpoint que retorne 200 OK.
        // O `mode: 'no-cors'` com `HEAD` pode não ser confiável para determinar conectividade real da API,
        // pois ele não revelará erros de rede (cors, etc.) e pode retornar sucesso mesmo que o servidor não responda.
        // Se houver um endpoint /health ou /status na sua API, use-o.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
        
        const response = await fetch(apiStatus.endpoint.replace('/auth/login', '/health') || apiStatus.endpoint, { 
          method: 'GET', // Usar GET é mais comum para health checks
          signal: controller.signal // Adicionar o signal para o timeout
        });
        clearTimeout(timeoutId);

        if (response.ok) { // Verifica se a resposta foi bem-sucedida (status 2xx)
          setApiStatus(prev => ({ ...prev, connected: true }));
        } else {
          setApiStatus(prev => ({ ...prev, connected: false }));
        }
      } catch (e: any) {
        console.warn('API health check failed:', e);
        setApiStatus(prev => ({ ...prev, connected: false }));
      }
    };
    checkApiStatus();
  }, [apiStatus.endpoint]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError(t('login.fillAllFields'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // ✅ Logging attempt
      await loggingService.logEvent('login_attempt', {
        username: formData.username,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });

      // ✅ Login
      // A resposta agora é do tipo AuthResponse, que inclui accessToken, refreshToken, expiresIn e user
      const response: AuthResponse = await authService.login({
        username: formData.username,
        password: formData.password
      });

      // ✅ Tokens (extraídos diretamente da resposta)
      const tokens: AuthTokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn || 3600, // Usar fallback se expiresIn for opcional na resposta
        tokenType: 'Bearer' // Assumindo que é sempre 'Bearer'
      };

      // ✅ User data (extraídos diretamente da resposta e mapeados para UserData)
      const userData: UserData = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        // Garante que roles é um array de strings
        role: response.user.roles && response.user.roles.length > 0 ? response.user.roles[0] : 'USER', 
        permissions: response.user.permissions || ['READ'],
        companyId: response.user.companyId || '', // Adicionado, se sua API retornar companyId
        isActive: response.user.isActive ?? true, // Adicionado, se sua API retornar isActive
        lastLogin: response.user.lastLogin || new Date().toISOString(), // Adicionado, se sua API retornar lastLogin
        createdAt: response.user.createdAt || new Date().toISOString(), // Adicionado, se sua API retornar createdAt
        updatedAt: response.user.updatedAt || new Date().toISOString() // Adicionado, se sua API retornar updatedAt
      };

      // ✅ Correct order: tokens first, user second
      setAuthData(tokens, userData);

      // ✅ Logging success
      await loggingService.logEvent('login_success', {
        userId: userData.id,
        email: userData.email,
        timestamp: new Date().toISOString()
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      // Se a sua AuthResponse tiver uma propriedade `message` para erros, você pode usá-la.
      // Caso contrário, o erro genérico está OK.
      setError(err.message || t('login.authFailed')); 

      // ✅ Logging failure
      await loggingService.logEvent('login_failure', {
        username: formData.username,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{t('login.title')}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder={t('login.username')}
            value={formData.username}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder={t('login.password')}
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? t('login.loading') : t('login.signIn')}
          </button>
        </form>

        <select value={i18n.language} onChange={handleLanguageChange}>
          <option value="en">{t('language.english')}</option>
          <option value="pt">{t('language.portuguese')}</option>
          <option value="fr">{t('language.french')}</option>
          <option value="zh">{t('language.chinese')}</option>
          <option value="ar">{t('language.arabic')}</option>
        </select>
      </div>
    </div>
  );
};

export default LoginPage;