import React, { useState, useEffect } from 'react';
import { FiHome, FiDollarSign, FiTrendingUp, FiCalendar, FiMap, FiCloud, FiUsers, FiCamera, FiBarChart2, FiPlus } from 'react-icons/fi';
import { useAuthStore } from '../../stores/authStore';
import { dashboardService } from '../../services/dashboardService';
import ProjectMap from '../../components/dashboard/ProjectMap';
import WeatherWidget from '../../components/dashboard/WeatherWidget';
import FinancialAnalysis from '../../components/dashboard/FinancialAnalysis';
import ExpenseModal from '../../components/dashboard/ExpenseModal';

/**
 * Dashboard principal do sistema de recuperação financeira
 * Main dashboard for the financial recovery system
 */
const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [projectStats, setProjectStats] = useState({
    active: 0,
    pending: 0,
    paused: 0,
    completed: 0
  });
  const [financialStats, setFinancialStats] = useState({
    totalBudget: 0,
    totalExpenses: 0,
    materialCosts: 0,
    laborCosts: 0,
    projectedProfit: 0
  });
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Efeito para carregar dados do dashboard
  // Effect to load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obter estatísticas de projetos
        // Get project statistics
        const projectStatsData = await dashboardService.getProjectStats();
        setProjectStats(projectStatsData);
        
        // Obter estatísticas financeiras
        // Get financial statistics
        const financialStatsData = await dashboardService.getFinancialStats();
        setFinancialStats(financialStatsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard / Error loading dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Formatar valores monetários
  // Format monetary values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho / Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Sistema de Recuperação Financeira</h1>
              <p className="text-blue-100">Habermehl Construction</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Bem-vindo, {user?.firstName || 'Usuário'}</p>
                <p className="text-sm text-blue-200">{user?.roles?.join(', ') || 'Usuário'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal / Main content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Cartões de estatísticas / Statistics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Projetos Ativos</p>
                    <p className="text-2xl font-bold text-gray-800">{projectStats.active}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <FiHome className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Orçamento Total</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(financialStats.totalBudget)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full text-green-600">
                    <FiDollarSign className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Custos de Materiais</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(financialStats.materialCosts)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                    <FiBarChart2 className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Lucro Projetado</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(financialStats.projectedProfit)}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                    <FiTrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seções principais / Main sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Gráfico financeiro / Financial chart */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Análise Financeira</h2>
                <div className="h-80">
                  <FinancialAnalysis />
                </div>
              </div>
              
              {/* Alertas de clima / Weather alerts */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Alertas de Clima</h2>
                  <FiCloud className="h-5 w-5 text-blue-500" />
                </div>
                
                <div className="h-80">
                  <WeatherWidget />
                </div>
              </div>
            </div>
            
            {/* Seção de mapa e projetos / Map and projects section */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Mapa de Projetos</h2>
                <FiMap className="h-5 w-5 text-blue-500" />
              </div>
              
              <div className="h-96">
                <ProjectMap />
              </div>
            </div>
            
            {/* Ações rápidas / Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button 
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/projects/new'}
              >
                <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-3">
                  <FiHome className="h-6 w-6" />
                </div>
                <p className="font-medium text-gray-800">Novo Projeto</p>
              </button>
              
              <button 
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
                onClick={() => setShowExpenseModal(true)}
              >
                <div className="p-3 bg-green-100 rounded-full text-green-600 mb-3">
                  <FiDollarSign className="h-6 w-6" />
                </div>
                <p className="font-medium text-gray-800">Registrar Despesa</p>
              </button>
              
              <button 
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/projects/photos'}
              >
                <div className="p-3 bg-purple-100 rounded-full text-purple-600 mb-3">
                  <FiCamera className="h-6 w-6" />
                </div>
                <p className="font-medium text-gray-800">Enviar Fotos</p>
              </button>
              
              <button 
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/teams'}
              >
                <div className="p-3 bg-amber-100 rounded-full text-amber-600 mb-3">
                  <FiUsers className="h-6 w-6" />
                </div>
                <p className="font-medium text-gray-800">Gerenciar Equipes</p>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Modal de despesa / Expense modal */}
      <ExpenseModal 
        isOpen={showExpenseModal} 
        onClose={() => setShowExpenseModal(false)} 
      />
    </div>
  );
};

export default Dashboard;
