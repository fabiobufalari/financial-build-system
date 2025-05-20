import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../stores/authStore'

/**
 * Schema de validação para o formulário de login
 * Validation schema for the login form
 */
const loginSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório / Username is required'),
  password: z.string().min(1, 'Senha é obrigatória / Password is required'),
})

/**
 * Tipo para os dados do formulário de login
 * Type for login form data
 */
type LoginFormData = z.infer<typeof loginSchema>

/**
 * Componente da página de login
 * Login page component
 */
const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Configuração do formulário com React Hook Form e validação Zod
   * Form configuration with React Hook Form and Zod validation
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  /**
   * Função para processar o envio do formulário
   * Function to process form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Chama o serviço de autenticação para realizar login
      // Calls the authentication service to perform login
      const response = await authService.login(data)
      
      // Armazena os tokens e dados do usuário no store
      // Stores tokens and user data in the store
      login(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
        response.user
      )
      
      // Redireciona para o dashboard após login bem-sucedido
      // Redirects to dashboard after successful login
      navigate('/dashboard')
    } catch (err) {
      // Trata erros de autenticação
      // Handles authentication errors
      setError('Credenciais inválidas. Por favor, tente novamente. / Invalid credentials. Please try again.')
      console.error('Erro de login / Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800 p-4">
      <div className="w-full max-w-md">
        {/* Card do formulário de login / Login form card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cabeçalho / Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-2xl font-bold text-white text-center">
              Sistema de Recuperação Financeira
            </h2>
            <p className="mt-2 text-blue-100 text-center">
              Construtora Canadá
            </p>
          </div>

          {/* Formulário / Form */}
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-medium text-gray-900 text-center">
              Login
            </h3>

            {/* Mensagem de erro / Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo de usuário / Username field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username / Email / Celular
                </label>
                <input
                  id="username"
                  type="text"
                  {...register('username')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Digite seu username, email ou celular"
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              {/* Campo de senha / Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha / Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Link para recuperação de senha / Password recovery link */}
              <div className="text-right">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  Esqueceu a senha? / Forgot password?
                </a>
              </div>

              {/* Botão de login / Login button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  'Entrar / Login'
                )}
              </button>
            </form>

            {/* Rodapé / Footer */}
            <div className="mt-6 text-center text-sm text-gray-500">
              © 2025 Sistema de Recuperação Financeira - Todos os direitos reservados
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
