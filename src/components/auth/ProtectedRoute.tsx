import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Componente para proteger rotas que requerem autenticação
 * Protected route component that requires authentication
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore()

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Se estiver autenticado, renderiza o conteúdo
  return <>{children}</>
}

export default ProtectedRoute

