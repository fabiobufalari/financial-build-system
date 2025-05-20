import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { dashboardService } from '../../services/dashboardService';

/**
 * Interface para dados do gráfico
 * Interface for chart data
 */
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

/**
 * Componente de análise financeira para o dashboard
 * Financial analysis component for dashboard
 */
const FinancialAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('budget');
  const [budgetVsExpensesData, setBudgetVsExpensesData] = useState<ChartData | null>(null);
  const [materialCostsData, setMaterialCostsData] = useState<ChartData | null>(null);
  const [profitabilityData, setProfitabilityData] = useState<ChartData | null>(null);
  
  // Efeito para carregar dados financeiros
  // Effect to load financial data
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, estas chamadas seriam para endpoints reais
        // In a real environment, these calls would be to real endpoints
        const financialStats = await dashboardService.getFinancialStats();
        
        // Simulação de dados para desenvolvimento
        // Simulated data for development
        
        // Dados de orçamento vs despesas
        // Budget vs expenses data
        setBudgetVsExpensesData({
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [
            {
              label: 'Orçamento',
              data: [150000, 180000, 210000, 240000, 270000, 300000],
              borderColor: '#3b82f6',
              borderWidth: 2
            },
            {
              label: 'Despesas',
              data: [120000, 160000, 190000, 210000, 230000, 250000],
              borderColor: '#ef4444',
              borderWidth: 2
            }
          ]
        });
        
        // Dados de custos de materiais
        // Material costs data
        setMaterialCostsData({
          labels: ['Concreto', 'Madeira', 'Aço', 'Elétrica', 'Hidráulica', 'Acabamento'],
          datasets: [
            {
              label: 'Custos de Materiais',
              data: [120000, 80000, 60000, 45000, 35000, 110000],
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(236, 72, 153, 0.7)',
                'rgba(248, 113, 113, 0.7)',
                'rgba(251, 146, 60, 0.7)',
                'rgba(16, 185, 129, 0.7)'
              ],
              borderWidth: 1
            }
          ]
        });
        
        // Dados de rentabilidade por tipo de projeto
        // Profitability by project type data
        setProfitabilityData({
          labels: ['Residencial', 'Comercial', 'Industrial', 'Reforma'],
          datasets: [
            {
              label: 'Margem de Lucro (%)',
              data: [32, 28, 24, 38],
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(236, 72, 153, 0.7)',
                'rgba(16, 185, 129, 0.7)'
              ],
              borderWidth: 1
            }
          ]
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados financeiros / Error loading financial data:', error);
        setLoading(false);
      }
    };
    
    fetchFinancialData();
  }, []);
  
  // Renderiza o gráfico ativo
  // Renders the active chart
  const renderActiveChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'budget':
        return (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Gráfico de Orçamento vs Despesas será exibido aqui</p>
            {/* Em um ambiente real, um componente de gráfico seria usado aqui */}
            {/* In a real environment, a chart component would be used here */}
          </div>
        );
      case 'materials':
        return (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Gráfico de Custos de Materiais será exibido aqui</p>
            {/* Em um ambiente real, um componente de gráfico seria usado aqui */}
            {/* In a real environment, a chart component would be used here */}
          </div>
        );
      case 'profitability':
        return (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Gráfico de Rentabilidade por Tipo de Projeto será exibido aqui</p>
            {/* Em um ambiente real, um componente de gráfico seria usado aqui */}
            {/* In a real environment, a chart component would be used here */}
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Abas / Tabs */}
      <div className="flex space-x-2 mb-4">
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
            activeTab === 'budget' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('budget')}
        >
          <FiDollarSign className="mr-1 h-4 w-4" />
          Orçamento vs Despesas
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
            activeTab === 'materials' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('materials')}
        >
          <FiBarChart2 className="mr-1 h-4 w-4" />
          Custos de Materiais
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
            activeTab === 'profitability' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('profitability')}
        >
          <FiPieChart className="mr-1 h-4 w-4" />
          Rentabilidade
        </button>
      </div>
      
      {/* Gráfico ativo / Active chart */}
      <div className="flex-grow">
        {renderActiveChart()}
      </div>
      
      {/* Insights / Insights */}
      <div className="mt-4">
        <h3 className="font-medium text-gray-800 mb-2">Insights Financeiros</h3>
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          {activeTab === 'budget' && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Análise:</span> As despesas estão 16% abaixo do orçamento planejado, indicando boa gestão financeira. Continue monitorando para manter esta tendência.
            </p>
          )}
          {activeTab === 'materials' && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Análise:</span> Concreto e Acabamento representam 51% dos custos de materiais. Considere negociar com fornecedores para obter melhores preços nestes itens.
            </p>
          )}
          {activeTab === 'profitability' && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Análise:</span> Projetos de Reforma apresentam a maior margem de lucro (38%). Considere focar em mais projetos deste tipo para aumentar a rentabilidade geral.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;
