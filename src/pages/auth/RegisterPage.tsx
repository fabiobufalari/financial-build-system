// User Registration Page
// EN: User registration page with form validation and multi-language support
// PT: Página de registro de usuário com validação de formulário e suporte multi-idiomas

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import './LoginPage.css';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const RegisterPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('register.errors.firstNameRequired');
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('register.errors.lastNameRequired');
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = t('register.errors.usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('register.errors.usernameMinLength');
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('register.errors.emailRequired');
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = t('register.errors.emailInvalid');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('register.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('register.errors.passwordMinLength');
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Log registration attempt
      console.log('Registration attempt for user:', formData.username);

      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Set auth data and navigate to dashboard
      const tokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn || 3600,
        tokenType: 'Bearer'
      };

      const userData = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: (response.user.roles && response.user.roles[0]) || 'USER',
        permissions: response.user.permissions || ['READ'],
        companyId: '',
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setAuthData(tokens, userData);

      // Log successful registration
      console.log('Registration successful for user:', response.user.email);

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Log failed registration
      console.log('Registration failed for user:', formData.username, 'Error:', error.message);

      setErrors({
        general: error.message || t('register.errors.generic')
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
        <div className="login-header">
          <h1>{t('register.title')}</h1>
          <p>{t('register.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">{t('register.firstName')}</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder={t('register.firstNamePlaceholder')}
                className={errors.firstName ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">{t('register.lastName')}</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder={t('register.lastNamePlaceholder')}
                className={errors.lastName ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">{t('register.username')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={t('register.usernamePlaceholder')}
              className={errors.username ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('register.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('register.emailPlaceholder')}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('register.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t('register.passwordPlaceholder')}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={t('register.confirmPasswordPlaceholder')}
              className={errors.confirmPassword ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? t('register.registering') : t('register.signUp')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {t('register.alreadyHaveAccount')}{' '}
            <button 
              type="button"
              className="link-button"
              onClick={() => navigate('/login')}
            >
              {t('register.signInLink')}
            </button>
          </p>
        </div>

        <div className="language-selector">
          <label htmlFor="language">{t('auth.selectLanguage')}</label>
          <select 
            id="language" 
            value={i18n.language} 
            onChange={handleLanguageChange}
          >
            <option value="en">{t('language.english')}</option>
            <option value="pt">{t('language.portuguese')}</option>
            <option value="fr">{t('language.french')}</option>
            <option value="zh">{t('language.chinese')}</option>
            <option value="ar">{t('language.arabic')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

