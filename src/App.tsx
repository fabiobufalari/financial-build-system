import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import AuthPage from './pages/auth/AuthPage';
import Dashboard from './pages/dashboard/Dashboard';
import CompanyPage from './pages/company/CompanyPage';
import EmployeesPage from './pages/employees/EmployeesPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import CashFlowPage from './pages/cashflow/CashFlowPage';
import AccountsPayablePage from './pages/accounts/AccountsPayablePage';
import AccountsReceivablePage from './pages/accounts/AccountsReceivablePage';
import MaterialsPage from './pages/materials/MaterialsPage';
import ReportsPage from './pages/reports/ReportsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import AdvancedPage from './pages/advanced/AdvancedPage';
import IntegrationsPage from './pages/integrations/IntegrationsPage';
import ProjectMapPage from './pages/projects/ProjectMapPage';

/**
 * Main application component with routing configuration
 * Componente principal da aplicação com configuração de roteamento
 */
const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public route for login - Rota pública para login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes with layout - Rotas protegidas com layout */}
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/auth" element={<ProtectedRoute><Layout><AuthPage /></Layout></ProtectedRoute>} />
        <Route path="/company" element={<ProtectedRoute><Layout><CompanyPage /></Layout></ProtectedRoute>} />
        <Route path="/employee-and-costs" element={<ProtectedRoute><Layout><EmployeesPage /></Layout></ProtectedRoute>} />
        <Route path="/supplier-service" element={<ProtectedRoute><Layout><SuppliersPage /></Layout></ProtectedRoute>} />
        <Route path="/cash-flow" element={<ProtectedRoute><Layout><CashFlowPage /></Layout></ProtectedRoute>} />
        <Route path="/accounts-payable" element={<ProtectedRoute><Layout><AccountsPayablePage /></Layout></ProtectedRoute>} />
        <Route path="/accounts-receivable" element={<ProtectedRoute><Layout><AccountsReceivablePage /></Layout></ProtectedRoute>} />
        <Route path="/calculation-materials" element={<ProtectedRoute><Layout><MaterialsPage /></Layout></ProtectedRoute>} />
        <Route path="/project-map" element={<ProtectedRoute><Layout><ProjectMapPage /></Layout></ProtectedRoute>} />
        <Route path="/financial-reports" element={<ProtectedRoute><Layout><ReportsPage /></Layout></ProtectedRoute>} />
        <Route path="/api/data-analytics" element={<ProtectedRoute><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />
        <Route path="/api/financial-advanced" element={<ProtectedRoute><Layout><AdvancedPage /></Layout></ProtectedRoute>} />
        <Route path="/api/integrations" element={<ProtectedRoute><Layout><IntegrationsPage /></Layout></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
};

export default App;
