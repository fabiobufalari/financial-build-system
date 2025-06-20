import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import AuthPage from './pages/auth/AuthPage';
import Dashboard from './pages/dashboard/Dashboard';
import CompanyPage from './pages/company/CompanyPage';
import EmployeePage from './pages/employees/EmployeePage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import CashFlowPage from './pages/cashflow/CashFlowPage';
import AccountsPayablePage from './pages/accounts/AccountsPayablePage';
import AccountsReceivablePage from './pages/accounts/AccountsReceivablePage';
import MaterialsPage from './pages/materials/MaterialsPage';
import ReportsPage from './pages/reports/ReportsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import AdvancedPage from './pages/advanced/AdvancedPage';
import IntegrationsPage from './pages/integrations/IntegrationsPage';
import MapsPage from './pages/maps/MapsPage';

/**
 * Main application component with routing configuration
 * EN: Main application component with comprehensive routing for all microservices
 * PT: Componente principal da aplicação com roteamento abrangente para todos os microserviços
 */
const App = () => {
  return (
    <Suspense fallback={
      <div className="loading-fallback">
        <div className="loading-spinner"></div>
        <p>Carregando aplicação...</p>
      </div>
    }>
      <Routes>
        {/* Public route for login - Rota pública para login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes with layout - Rotas protegidas com layout */}
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        
        {/* Authentication Management - Gerenciamento de Autenticação */}
        <Route path="/auth" element={<ProtectedRoute><Layout><AuthPage /></Layout></ProtectedRoute>} />
        
        {/* Business Management - Gerenciamento Empresarial */}
        <Route path="/company" element={<ProtectedRoute><Layout><CompanyPage /></Layout></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><Layout><EmployeePage /></Layout></ProtectedRoute>} />
        <Route path="/employee-and-costs" element={<ProtectedRoute><Layout><EmployeePage /></Layout></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute><Layout><SuppliersPage /></Layout></ProtectedRoute>} />
        <Route path="/supplier-service" element={<ProtectedRoute><Layout><SuppliersPage /></Layout></ProtectedRoute>} />
        
        {/* Financial Management - Gerenciamento Financeiro */}
        <Route path="/cash-flow" element={<ProtectedRoute><Layout><CashFlowPage /></Layout></ProtectedRoute>} />
        <Route path="/accounts-payable" element={<ProtectedRoute><Layout><AccountsPayablePage /></Layout></ProtectedRoute>} />
        <Route path="/accounts-receivable" element={<ProtectedRoute><Layout><AccountsReceivablePage /></Layout></ProtectedRoute>} />
        
        {/* Project Management - Gerenciamento de Projetos */}
        <Route path="/materials" element={<ProtectedRoute><Layout><MaterialsPage /></Layout></ProtectedRoute>} />
        <Route path="/calculation-materials" element={<ProtectedRoute><Layout><MaterialsPage /></Layout></ProtectedRoute>} />
        <Route path="/maps" element={<ProtectedRoute><Layout><MapsPage /></Layout></ProtectedRoute>} />
        <Route path="/project-map" element={<ProtectedRoute><Layout><MapsPage /></Layout></ProtectedRoute>} />
        
        {/* Reports and Analytics - Relatórios e Analytics */}
        <Route path="/reports" element={<ProtectedRoute><Layout><ReportsPage /></Layout></ProtectedRoute>} />
        <Route path="/financial-reports" element={<ProtectedRoute><Layout><ReportsPage /></Layout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />
        <Route path="/api/data-analytics" element={<ProtectedRoute><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />
        
        {/* Advanced Features - Funcionalidades Avançadas */}
        <Route path="/advanced" element={<ProtectedRoute><Layout><AdvancedPage /></Layout></ProtectedRoute>} />
        <Route path="/api/financial-advanced" element={<ProtectedRoute><Layout><AdvancedPage /></Layout></ProtectedRoute>} />
        <Route path="/integrations" element={<ProtectedRoute><Layout><IntegrationsPage /></Layout></ProtectedRoute>} />
        <Route path="/api/integrations" element={<ProtectedRoute><Layout><IntegrationsPage /></Layout></ProtectedRoute>} />
        
        {/* Fallback route - Rota de fallback */}
        <Route path="*" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
};

export default App;

