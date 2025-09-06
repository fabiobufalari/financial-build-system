import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService, AuthResponse } from '../../services/authService';
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
        await fetch(apiStatus.endpoint, { method: 'HEAD', mode: 'no-cors' });
        setApiStatus(prev => ({ ...prev, connected: true }));
      } catch {
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
      const response: AuthResponse = await authService.login({
        username: formData.username,
        password: formData.password
      });

      // ✅ Tokens
      const tokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn || 3600,
        tokenType: 'Bearer'
      };

      // ✅ User data
      const userData = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.roles[0] || 'USER',
        permissions: response.user.permissions || ['READ'],
        companyId: '',
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
      setError(t('login.authFailed'));

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
