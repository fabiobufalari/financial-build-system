import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { setAuthData } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
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
        const response = await fetch(apiStatus.endpoint, {
          method: 'HEAD',
          mode: 'no-cors'
        });
        setApiStatus(prev => ({ ...prev, connected: true }));
      } catch (error) {
        setApiStatus(prev => ({ ...prev, connected: false }));
      }
    };

    checkApiStatus();
  }, [apiStatus.endpoint]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Log login attempt
      await loggingService.logLogin(formData.username, false, 'CREDENTIALS', 'Login attempt');

      // Attempt authentication
      const response: AuthResponse = await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      if (response.tokens && response.user) {
        const userData: UserData = response.user;
        const tokens: AuthTokens = response.tokens;

        // Set authentication data
        setAuthData(userData, tokens);

        // Log successful login
        await loggingService.logLogin(userData.username, true, 'CREDENTIALS');

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Authentication failed. Please check your credentials.');
      
      // Log failed login attempt
      await loggingService.logLogin(
        formData.username,
        false,
        'CREDENTIALS',
        error.message || 'Authentication failed.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setApiStatus(prev => ({ ...prev, connected: false }));
    
    try {
      const response = await fetch(apiStatus.endpoint, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      setApiStatus(prev => ({ ...prev, connected: true }));
    } catch (error) {
      setApiStatus(prev => ({ ...prev, connected: false }));
    }
  };

  return (
    <div className="login-container">
      {/* Animated background particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      {/* Language selector */}
      <div className="language-selector">
        <select 
          className="language-select"
          value={i18n.language}
          onChange={handleLanguageChange}
          aria-label="Select Language"
        >
          {[
            { code: 'en', label: '🇺🇸 English' },
            { code: 'pt', label: '🇧🇷 Português' },
            { code: 'fr', label: '🇫🇷 Français' },
            { code: 'zh', label: '🇨🇳 中文' },
            { code: 'ar', label: '🇸🇦 العربية' }
          ].map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main login card */}
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="construction-icon">
            🏗️
          </div>
          <h1 className="login-title">Building Dreams</h1>
          <p className="login-subtitle">Financial Build System</p>
        </div>

        {/* Login form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon">👤</div>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">🔒</div>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Loading...
              </>
            ) : (
              'LOGIN'
            )}
          </button>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </form>

        {/* Forgot password link */}
        <div className="forgot-password">
          <a href="#forgot">Forgot password?</a>
        </div>

        {/* API Status */}
        <div className="api-status">
          <div className="api-status-header">
            <div className={`status-indicator ${apiStatus.connected ? 'connected' : ''}`}></div>
            <span className="api-status-title">📊 API Status:</span>
          </div>
          <div className="api-status-details">
            <div><strong>Endpoint:</strong> {apiStatus.endpoint}</div>
            <div><strong>Mode:</strong> {apiStatus.mode}</div>
            <div><strong>Status:</strong> {apiStatus.connected ? 'Connected' : 'Disconnected'}</div>
          </div>
        </div>
      </div>

      {/* Footer credits */}
      <div className="login-footer">
        <div className="developer-credits">
          Developed by Fabio Bufalari
        </div>
        <div className="contact-info">
          Contact: <a href="mailto:bufalari.fabio@gmail.com">bufalari.fabio@gmail.com</a><br />
          15 years of experience delivering innovative technology solutions
        </div>
      </div>
    </div>
  );
};

export default LoginPage;