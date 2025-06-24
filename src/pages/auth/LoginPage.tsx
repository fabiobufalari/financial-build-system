import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';
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
  responseTime?: number;
}

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();
  
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    connected: false,
    endpoint: 'http://buildingteste.ddns.net:8081/auth',
    mode: 'production'
  });

  // Language options (removed Indian as requested)
  const languageOptions = [
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'pt', name: t('language.portuguese'), flag: '🇧🇷' },
    { code: 'zh', name: t('language.chinese'), flag: '🇨🇳' }
  ];

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const startTime = new Date().getTime();
      const response = await fetch(`${apiStatus.endpoint}/health`, {
        method: 'GET'
      });
      const endTime = new Date().getTime();
      
      setApiStatus(prev => ({
        ...prev,
        connected: response.ok,
        responseTime: endTime - startTime
      }));
    } catch (error) {
      console.log('API health check failed:', error);
      setApiStatus(prev => ({
        ...prev,
        connected: false,
        responseTime: undefined
      }));
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
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
      setError(t('auth.invalidCredentials'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Attempting login with:', {
        username: formData.username,
        endpoint: apiStatus.endpoint
      });

      const authResponse = await authService.login({ username: formData.username, password: formData.password });
      
      console.log('✅ Login successful:', authResponse);

      // Extract tokens and user data
      const tokens = {
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken
      };

      const userData = {
        id: authResponse.user.id,
        username: authResponse.user.username,
        email: authResponse.user.email,
        firstName: authResponse.user.firstName,
        lastName: authResponse.user.lastName,
        roles: authResponse.user.roles || ['ROLE_USER'],
        permissions: authResponse.user.permissions || ['READ']
      };

      // Update auth store
      setAuthData(tokens, userData);

      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      setError(error.message || t('auth.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryConnection = () => {
    checkApiStatus();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header with Language Selector */}
        <div className="login-header">
          <div className="logo-section">
            <div className="logo">🏗️</div>
            <h1>Financial Recovery</h1>
            <p className="subtitle">{t('dashboard.financialSystemOverview')}</p>
          </div>
          
          {/* Language Selector */}
          <div className="language-selector">
            <label htmlFor="language-select" className="language-label">
              🌐 {t('language.select')}
            </label>
            <select
              id="language-select"
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-dropdown"
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.flag} {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* API Status */}
        <div className={`api-status ${apiStatus.connected ? 'connected' : 'disconnected'}`}>
          <span className="status-indicator">
            {apiStatus.connected ? '🟢' : '🔴'}
          </span>
          <span className="status-text">
            {apiStatus.connected ? t('api.connected') : t('api.disconnected')}
            {apiStatus.responseTime && ` (${apiStatus.responseTime}ms)`}
          </span>
          {!apiStatus.connected && (
            <button 
              onClick={handleRetryConnection}
              className="retry-button"
              type="button"
            >
              🔄 {t('refresh')}
            </button>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">{t('auth.username')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={t('auth.enterUsername')}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t('auth.enterPassword')}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading || !formData.username || !formData.password}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                {t('loading')}...
              </>
            ) : (
              t('auth.login')
            )}
          </button>
        </form>

        {/* API Information */}
        <div className="api-info">
          <h3>📊 {t('api.status')}:</h3>
          <div className="api-details">
            <div><strong>{t('api.endpoint')}:</strong> {apiStatus.endpoint}</div>
            <div><strong>{t('api.mode')}:</strong> {t('api.production')}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.developedFor')}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

