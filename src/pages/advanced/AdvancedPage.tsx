import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSettings, FiDollarSign, FiTrendingUp, FiShield, FiZap, FiTool } from 'react-icons/fi'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'

// Interfaces
interface AdvancedFeature {
  id: string
  title: string
  description: string
  category: 'risk_management' | 'financial_planning' | 'automation' | 'custom_tools'
  status: 'active' | 'beta' | 'coming_soon'
  icon: React.ReactNode
  settings?: Record<string, any>
}

interface RiskScenario {
  id: string
  name: string
  probability: number // 0 to 1
  impact: number // 0 to 1
  mitigation: string
}

interface InvestmentOption {
  name: string
  type: string
  expectedReturn: number
  riskLevel: 'low' | 'medium' | 'high'
  amount: number
  color: string
}

interface AutomationTask {
  name: string
  frequency: string
  lastRun: string
  status: 'success' | 'failed' | 'running'
}

// Mock data
const mockAdvancedFeatures: AdvancedFeature[] = [
  {
    id: '1',
    title: 'Análise de Risco Avançada',
    description: 'Modelagem de cenários de risco e simulações financeiras.',
    category: 'risk_management',
    status: 'active',
    icon: <FiShield className="w-6 h-6 text-red-600" />,
    settings: { sensitivityAnalysis: true, stressTesting: false }
  },
  {
    id: '2',
    title: 'Planejamento de Investimentos',
    description: 'Ferramentas para análise e otimização de portfólio de investimentos.',
    category: 'financial_planning',
    status: 'active',
    icon: <FiTrendingUp className="w-6 h-6 text-green-600" />
  },
  {
    id: '3',
    title: 'Automação de Processos Financeiros',
    description: 'Robôs para automatizar tarefas repetitivas como conciliação e pagamentos.',
    category: 'automation',
    status: 'beta',
    icon: <FiZap className="w-6 h-6 text-blue-600" />
  },
  {
    id: '4',
    title: 'Ferramentas de Orçamento Personalizado',
    description: 'Crie e gerencie orçamentos detalhados para projetos específicos.',
    category: 'custom_tools',
    status: 'active',
    icon: <FiTool className="w-6 h-6 text-purple-600" />
  },
  {
    id: '5',
    title: 'Previsão de Demanda com IA',
    description: 'Utilize inteligência artificial para prever demandas futuras de materiais e serviços.',
    category: 'financial_planning',
    status: 'coming_soon',
    icon: <FiDollarSign className="w-6 h-6 text-yellow-600" />
  }
];

const mockRiskScenarios: RiskScenario[] = [
  { id: 'rs1', name: 'Aumento de Juros', probability: 0.3, impact: 0.6, mitigation: 'Hedge cambial e renegociação de dívidas.' },
  { id: 'rs2', name: 'Atraso em Projeto Chave', probability: 0.2, impact: 0.8, mitigation: 'Plano de contingência e alocação de recursos extras.' },
  { id: 'rs3', name: 'Inadimplência de Cliente Importante', probability: 0.1, impact: 0.5, mitigation: 'Seguro de crédito e análise de crédito rigorosa.' },
  { id: 'rs4', name: 'Flutuação Cambial', probability: 0.4, impact: 0.4, mitigation: 'Contratos com cláusula de variação cambial.' }
];

const mockInvestmentOptions: InvestmentOption[] = [
  { name: 'CDB Pós-Fixado', type: 'Renda Fixa', expectedReturn: 0.12, riskLevel: 'low', amount: 250000, color: '#3B82F6' },
  { name: 'Ações Blue Chip', type: 'Renda Variável', expectedReturn: 0.18, riskLevel: 'medium', amount: 150000, color: '#10B981' },
  { name: 'Fundos Imobiliários', type: 'Renda Variável', expectedReturn: 0.15, riskLevel: 'medium', amount: 300000, color: '#F97316' },
  { name: 'Tesouro Direto', type: 'Renda Fixa', expectedReturn: 0.10, riskLevel: 'low', amount: 200000, color: '#8B5CF6' },
  { name: 'Criptomoedas', type: 'Renda Variável', expectedReturn: 0.35, riskLevel: 'high', amount: 100000, color: '#EF4444' }
];

const mockAutomationTasks: AutomationTask[] = [
  { name: 'Conciliação Bancária Diária', frequency: 'Diária', lastRun: '2025-06-11 08:00', status: 'success' },
  { name: 'Geração de Relatório de Fluxo de Caixa', frequency: 'Semanal', lastRun: '2025-06-10 17:00', status: 'success' },
  { name: 'Pagamento de Fornecedores Programados', frequency: 'Mensal', lastRun: '2025-06-05 10:00', status: 'failed' },
  { name: 'Envio de Cobranças Automáticas', frequency: 'Diária', lastRun: '2025-06-11 09:30', status: 'running' }
];

const AdvancedPage = () => {
  const { t } = useTranslation();
  const [features, setFeatures] = useState<AdvancedFeature[]>(mockAdvancedFeatures);
  const [riskScenarios, setRiskScenarios] = useState<RiskScenario[]>(mockRiskScenarios);
  const [investments, setInvestments] = useState<InvestmentOption[]>(mockInvestmentOptions);
  const [automationTasks, setAutomationTasks] = useState<AutomationTask[]>(mockAutomationTasks);
  const [selectedFeature, setSelectedFeature] = useState<AdvancedFeature | null>(null);

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para formatar percentuais
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Função para obter cor do nível de risco
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Função para obter cor do status da automação
  const getAutomationStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFeatureContent = (feature: AdvancedFeature) => {
    switch (feature.category) {
      case 'risk_management':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Cenários de Risco</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cenário</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Probabilidade</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Impacto</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mitigação</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {riskScenarios.map(scenario => (
                    <tr key={scenario.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{scenario.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{formatPercentage(scenario.probability)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{formatPercentage(scenario.impact)}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{scenario.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskScenarios} layout="vertical" margin={{ left: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 1]} tickFormatter={formatPercentage} />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip formatter={(value: number) => formatPercentage(value)} />
                  <Legend />
                  <Bar dataKey="probability" name="Probabilidade" fill="#FBBF24" />
                  <Bar dataKey="impact" name="Impacto" fill="#F87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'financial_planning':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Portfólio de Investimentos</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {investments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Retorno Esperado</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nível de Risco</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Valor Alocado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investments.map(inv => (
                    <tr key={inv.name}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{inv.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{inv.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{formatPercentage(inv.expectedReturn)}</td>
                      <td className={`px-4 py-2 whitespace-nowrap text-sm ${getRiskColor(inv.riskLevel)}`}>{inv.riskLevel.toUpperCase()}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-right">{formatCurrency(inv.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'automation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Tarefas Automatizadas</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarefa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequência</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Última Execução</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {automationTasks.map(task => (
                    <tr key={task.name}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{task.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{task.frequency}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{task.lastRun}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getAutomationStatusColor(task.status)}`}>
                          {task.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-yellow-600">Este módulo está em BETA. Novas automações serão adicionadas em breve.</p>
          </div>
        );
      default:
        return <p className="text-gray-600">Conteúdo para esta funcionalidade avançada será implementado em breve.</p>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('menu.advanced')}
          </h1>
          <p className="text-gray-600 mt-1">
            Explore ferramentas e análises financeiras avançadas
          </p>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
          <FiSettings className="w-4 h-4" />
          Configurações Avançadas
        </button>
      </div>

      {/* Lista de Funcionalidades Avançadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(feature => (
          <div 
            key={feature.id} 
            className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 ${selectedFeature?.id === feature.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedFeature(feature)}
          >
            <div className="flex items-center mb-3">
              {feature.icon}
              <h2 className="text-lg font-semibold text-gray-800 ml-3">{feature.title}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
            <div className="flex justify-between items-center text-xs">
              <span className={`px-2 py-0.5 rounded-full font-medium ${ 
                feature.status === 'active' ? 'bg-green-100 text-green-800' : 
                feature.status === 'beta' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {feature.status === 'active' ? 'Ativo' : feature.status === 'beta' ? 'BETA' : 'Em Breve'}
              </span>
              <span className="text-gray-500">{feature.category.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Conteúdo da Funcionalidade Selecionada */}
      {selectedFeature && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">{selectedFeature.title}</h2>
            <button 
              onClick={() => setSelectedFeature(null)} 
              className="text-gray-500 hover:text-gray-700"
            >
              &times; Fechar
            </button>
          </div>
          {renderFeatureContent(selectedFeature)}
        </div>
      )}

      {!selectedFeature && (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200 mt-6">
          <FiSettings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700">Selecione uma Funcionalidade</h3>
          <p className="text-gray-500 mt-2">Clique em um dos cards acima para explorar as ferramentas avançadas.</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedPage;

