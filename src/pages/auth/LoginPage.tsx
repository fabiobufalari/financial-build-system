import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiEye, FiEyeOff, FiLoader, FiCheck, FiX } from 'react-icons/fi'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'

/**
 * Página de login com seleção de idiomas e design responsivo
 * Login page with language selection and responsive design
 */
const LoginPage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Redireciona se já estiver autenticado
  // Redirects if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
    localStorage.setItem('preferred-language', language)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Limpa erro ao digitar // Clears error when typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validação básica
      // Basic validation
      if (!formData.username.trim()) {
        throw new Error(t('login.errors.usernameRequired'))
      }
      if (!formData.password.trim()) {
        throw new Error(t('login.errors.passwordRequired'))
      }

      // Usa o authService para autenticação
      // Uses authService for authentication
      const authResponse = await authService.login({
        username: formData.username,
        password: formData.password
      })
      
      setSuccess(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
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
      
      login(tokens, userData)
      navigate('/dashboard')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.errors.generic'))
    } finally {
      setIsLoading(false)
    }
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Financial Solutions
          </h1>
          <p className="text-blue-200">
            Financial Recovery System
          </p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Seleção de Idioma */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              {t('login.selectLanguage')}
            </label>
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-blue-800 text-white">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Username */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t('login.username')}
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder={t('login.usernamePlaceholder')}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm"
                disabled={isLoading}
              />
            </div>

            {/* Campo Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                <FiX className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Mensagem de Sucesso */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200">
                <FiCheck className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{t('login.success')}</span>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading || !formData.username.trim() || !formData.password.trim()}
              className="w-full py-3 px-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  {t('login.signingIn')}
                </>
              ) : success ? (
                <>
                  <FiCheck className="w-4 h-4" />
                  {t('login.success')}
                </>
              ) : (
                t('login.signIn')
              )}
            </button>
          </form>

          {/* Informações de Demonstração */}
          <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
            <p className="text-white/80 text-sm text-center mb-2">
              {t('login.demo.title')}
            </p>
            <div className="text-xs text-white/60 space-y-1">
              <div><strong>Admin:</strong> fabiobufalari / 12345678!</div>
              <div><strong>Admin:</strong> admin / admin123</div>
              <div><strong>User:</strong> user / user123</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            © 2025 Fabio Bufalari. {t('login.footer')} <a href="mailto:bufalari.fabio@gmail.com" className="hover:underline">bufalari.fabio@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

