
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authService, AuthResponse } from '../../services/authService';
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
    if (!formData.firstName.trim()) newErrors.firstName = t('register.errors.firstNameRequired');
    if (!formData.lastName.trim()) newErrors.lastName = t('register.errors.lastNameRequired');
    if (!formData.username.trim()) newErrors.username = t('register.errors.usernameRequired');
    else if (formData.username.length < 3) newErrors.username = t('register.errors.usernameMinLength');
    if (!formData.email.trim()) newErrors.email = t('register.errors.emailRequired');
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = t('register.errors.emailInvalid');
    if (!formData.password) newErrors.password = t('register.errors.passwordRequired');
    else if (formData.password.length < 6) newErrors.password = t('register.errors.passwordMinLength');
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('register.errors.passwordMismatch');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response: AuthResponse = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // ✅ Tokens primeiro, user depois (compatível com store)
     const tokens = {
  	accessToken: response.tokens.accessToken,
  	refreshToken: response.tokens.refreshToken,
  	expiresIn: response.tokens.expiresIn,
	tokenType: response.tokens.tokenType
	};

      const userData = {
        id: response.user.id,
  username: response.user.username,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.roles?.[0] || 'USER',
        permissions: response.user.permissions || ['READ'],
        companyId: '',
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setAuthData(userData, tokens);
      navigate('/dashboard');
    } catch (err: any) {
      setErrors({ general: err.message || t('register.errors.generic') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => i18n.changeLanguage(e.target.value);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{t('register.title')}</h1>
        <form onSubmit={handleSubmit}>
          <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder={t('register.firstName')} disabled={isLoading} />
          <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder={t('register.lastName')} disabled={isLoading} />
          <input name="username" value={formData.username} onChange={handleInputChange} placeholder={t('register.username')} disabled={isLoading} />
          <input name="email" value={formData.email} onChange={handleInputChange} placeholder={t('register.email')} disabled={isLoading} />
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={t('register.password')} disabled={isLoading} />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder={t('register.confirmPassword')} disabled={isLoading} />
          {errors.general && <div className="error-message">{errors.general}</div>}
          <button type="submit" disabled={isLoading}>{isLoading ? t('register.registering') : t('register.signUp')}</button>
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

export default RegisterPage;
