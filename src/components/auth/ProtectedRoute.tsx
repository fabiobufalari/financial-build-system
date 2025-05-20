import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

/**
 * Props para o componente ProtectedRoute
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: ReactNode
  redirectPath?: string
}

/**
 * Componente que protege rotas, redirecionando para o login se o usuário não estiver autenticado
 * Component that protects routes, redirecting to login if the user is not authenticated
 * 
 * @param children - Componentes filhos a serem renderizados se autenticado
 * @param redirectPath - Caminho para redirecionamento se não autenticado (padrão: /login)
 * @returns O componente filho ou redirecionamento
 */
const ProtectedRoute = ({ 
  children, 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore()

  // Se não estiver autenticado, redireciona para o caminho especificado
  // If not authenticated, redirects to the specified path
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  // Se estiver autenticado, renderiza os componentes filhos
  // If authenticated, renders the child components
  return <>{children}</>
}

export default ProtectedRoute
