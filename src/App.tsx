import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import LoginPage from './pages/auth/LoginPage'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'

// Lazy load pages for better performance
import { lazy } from 'react'

const AuthPage = lazy(() => import('./pages/auth/AuthPage'))
const CompanyPage = lazy(() => import('./pages/company/CompanyPage'))
const EmployeePage = lazy(() => import('./pages/employees/EmployeePage'))
const SuppliersPage = lazy(() => import('./pages/suppliers/SuppliersPage'))
const AccountsPayablePage = lazy(() => import('./pages/accounts/AccountsPayablePage'))
const AccountsReceivablePage = lazy(() => import('./pages/accounts/AccountsReceivablePage'))
const CashFlowPage = lazy(() => import('./pages/cashflow/CashFlowPage'))
const MaterialsPage = lazy(() => import('./pages/materials/MaterialsPage'))
const MapsPage = lazy(() => import('./pages/maps/MapsPage'))
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'))
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage'))
const AdvancedPage = lazy(() => import('./pages/advanced/AdvancedPage'))
const IntegrationsPage = lazy(() => import('./pages/integrations/IntegrationsPage'))

function App() {
  const { t } = useTranslation()

  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '48px' }}>🏗️</div>
        <p>{t('loading')}...</p>
      </div>
    }>
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Authentication Management */}
          <Route path="auth" element={<AuthPage />} />
          <Route path="authentication" element={<AuthPage />} />
          
          {/* Business Management */}
          <Route path="company" element={<CompanyPage />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="employee-and-costs" element={<EmployeePage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="supplier-service" element={<SuppliersPage />} />
          
          {/* Financial Management */}
          <Route path="cash-flow" element={<CashFlowPage />} />
          <Route path="accounts-payable" element={<AccountsPayablePage />} />
          <Route path="accounts-receivable" element={<AccountsReceivablePage />} />
          
          {/* Construction & Materials */}
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="calculation-materials" element={<MaterialsPage />} />
          <Route path="construction-materials" element={<MaterialsPage />} />
          
          {/* Maps & Location */}
          <Route path="maps" element={<MapsPage />} />
          <Route path="employee-map" element={<MapsPage />} />
          <Route path="project-map" element={<MapsPage />} />
          
          {/* Reports & Analytics */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="financial-reports" element={<ReportsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="data-analytics" element={<AnalyticsPage />} />
          
          {/* Advanced Features */}
          <Route path="advanced" element={<AdvancedPage />} />
          <Route path="financial-advanced" element={<AdvancedPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          
          {/* API Routes (for direct microservice access) */}
          <Route path="api/authentication" element={<AuthPage />} />
          <Route path="api/company" element={<CompanyPage />} />
          <Route path="api/employee-and-costs" element={<EmployeePage />} />
          <Route path="api/supplier-service" element={<SuppliersPage />} />
          <Route path="api/accounts-payable" element={<AccountsPayablePage />} />
          <Route path="api/accounts-receivable" element={<AccountsReceivablePage />} />
          <Route path="api/cash-flow" element={<CashFlowPage />} />
          <Route path="api/calculation-materials" element={<MaterialsPage />} />
          <Route path="api/create-people" element={<EmployeePage />} />
          <Route path="api/financial-reports" element={<ReportsPage />} />
          <Route path="api/data-analytics" element={<AnalyticsPage />} />
          <Route path="api/financial-advanced" element={<AdvancedPage />} />
          <Route path="api/integrations" element={<IntegrationsPage />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App

