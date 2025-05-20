import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/auth/LoginPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Dashboard from './pages/dashboard/Dashboard'
import NotFound from './pages/NotFound'

/**
 * Componente principal da aplicação que gerencia as rotas
 * Main application component that manages routes
 */
function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Rota pública para login / Public route for login */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      
      {/* Rotas protegidas / Protected routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Rota para página não encontrada / Route for not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
