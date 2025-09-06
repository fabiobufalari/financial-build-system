import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// ✅ Importe AuthResponse, AuthTokens e UserData do authService
import { authService, AuthResponse, AuthTokens, UserData } from '../../services/authService'; 
import { loggingService } from '../../services/loggingService'; // Assumo que o caminho está correto
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 
        
        // Use o endpoint de health check do authService, se existir, ou ajuste o caminho.
        // authService.checkApiHealth() é uma boa opção se você quiser que o authService gerencie isso.
        const response = await fetch(apiStatus.endpoint.replace('/auth/login', '/health') || apiStatus.endpoint, { 
          method: 'GET', 
          signal: controller.signal 
        });
        clearTimeout(timeoutId);

        if (response.ok) { 
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
      // ✅ Chamada ao método específico de login do loggingService, ou ajuste seu `logEvent`
      // O `logEvent` no `loggingService` que você forneceu é genérico.
      // Vou usar `loggingService.logLogin` que é mais adequado para este propósito.
      // Se você REALMENTE precisa de `logEvent` com essa assinatura, avise-me.
      await loggingService.logLogin(formData.username, false, 'CREDENTIALS', 'Login attempt');

      // ✅ Login - a resposta agora é do tipo AuthResponse
      const response: AuthResponse = await authService.login({
        username: formData.username,
        password: formData.password
      });

      // ✅ Os tokens e dados do usuário já vêm aninhados na 'response'
      const tokens: AuthTokens = response.tokens;
      const userData: UserData = response.user;

      // ✅ Passa os objetos completos para setAuthData
      setAuthData(tokens, userData);

      // ✅ Logging success
      await loggingService.logLogin(userData.username, true, 'CREDENTIALS');

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      // Use a mensagem de erro da exceção lançada pelo authService
      setError(err.message || t('login.authFailed')); 

      // ✅ Logging failure
      await loggingService.logLogin(
        formData.username,
        false,
        'CREDENTIALS',
        err.message || 'Authentication failed.'
      );
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