import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import EmployeePage from './pages/employees/EmployeePage';
import MapsPage from './pages/maps/MapsPage';
import CompanyPage from './pages/company/CompanyPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import AccountsPayablePage from './pages/accounts/AccountsPayablePage';
import AccountsReceivablePage from './pages/accounts/AccountsReceivablePage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<EmployeePage />} />
            <Route path="maps" element={<MapsPage />} />
            <Route path="company" element={<CompanyPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="accounts-payable" element={<AccountsPayablePage />} />
            <Route path="accounts-receivable" element={<AccountsReceivablePage />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

