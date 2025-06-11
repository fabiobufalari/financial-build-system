import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/auth/LoginPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import NotFound from './pages/NotFound'

// Importar páginas para todos os serviços
import CompanyPage from './pages/company/CompanyPage'
import EmployeesPage from './pages/employees/EmployeesPage'
import SuppliersPage from './pages/suppliers/SuppliersPage'
import CashFlowPage from './pages/cashflow/CashFlowPage'
import AccountsPayablePage from './pages/accounts/AccountsPayablePage'
import AccountsReceivablePage from './pages/accounts/AccountsReceivablePage'
import MaterialsPage from './pages/materials/MaterialsPage'
import ReportsPage from './pages/reports/ReportsPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import AdvancedPage from './pages/advanced/AdvancedPage'
import IntegrationsPage from './pages/integrations/IntegrationsPage'
import AuthPage from './pages/auth/AuthPage'

/**
 * Componente principal da aplicação que gerencia as rotas
 * Main application component that manages routes
 */
function App() {
  const { isAuthenticated } = useAuthStore()
  
  return (
    <Routes>
      {/* Rota pública para login / Public route for login */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } 
      />
      
      {/* Rota raiz redireciona para dashboard ou login */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
      
      {/* Rotas protegidas com Layout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/auth" 
        element={
          <ProtectedRoute>
            <Layout>
              <AuthPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/company" 
        element={
          <ProtectedRoute>
            <Layout>
              <CompanyPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/employee-and-costs" 
        element={
          <ProtectedRoute>
            <Layout>
              <EmployeesPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/supplier-service" 
        element={
          <ProtectedRoute>
            <Layout>
              <SuppliersPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cash-flow" 
        element={
          <ProtectedRoute>
            <Layout>
              <CashFlowPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/accounts-payable" 
        element={
          <ProtectedRoute>
            <Layout>
              <AccountsPayablePage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/accounts-receivable" 
        element={
          <ProtectedRoute>
            <Layout>
              <AccountsReceivablePage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/calculation-materials" 
        element={
          <ProtectedRoute>
            <Layout>
              <MaterialsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/financial-reports" 
        element={
          <ProtectedRoute>
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/api/data-analytics" 
        element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/api/financial-advanced" 
        element={
          <ProtectedRoute>
            <Layout>
              <AdvancedPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/api/integrations" 
        element={
          <ProtectedRoute>
            <Layout>
              <IntegrationsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Rota para página não encontrada / Route for not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

