import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiRefreshCw, FiDownload, FiFilter, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

// Interfaces
interface AnalyticsData {
  id: string
  title: string
  type: 'financial' | 'operational' | 'project' | 'forecast'
  description: string
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  lastUpdated: string
  status: 'updated' | 'outdated' | 'processing'
}

interface FinancialMetric {
  name: string
  value: number
  trend: 'up' | 'down' | 'stable'
  percentage: number
  color: string
}

interface ProjectPerformance {
  name: string
  budget: number
  actual: number
  variance: number
}

interface MonthlyRevenue {
  month: string
  revenue: number
  expenses: number
  profit: number
}

interface CategoryDistribution {
  name: string
  value: number
  color: string
}

interface PerformanceMetric {
  subject: string
  A: number
  B: number
  fullMark: number
}

// Mock data
const mockAnalytics: AnalyticsData[] = [
  {
    id: '1',
    title: 'Análise Financeira Mensal',
    type: 'financial',
    description: 'Visão geral do desempenho financeiro mensal',
    period: 'monthly',
    lastUpdated: '2025-06-01',
    status: 'updated'
  },
  {
    id: '2',
    title: 'Desempenho de Projetos',
    type: 'project',
    description: 'Análise de desempenho de projetos ativos',
    period: 'weekly',
    lastUpdated: '2025-06-05',
    status: 'updated'
  },
  {
    id: '3',
    title: 'Previsão de Fluxo de Caixa',
    type: 'forecast',
    description: 'Previsão de fluxo de caixa para os próximos 6 meses',
    period: 'monthly',
    lastUpdated: '2025-06-01',
    status: 'updated'
  },
  {
    id: '4',
    title: 'Análise de Eficiência Operacional',
    type: 'operational',
    description: 'Métricas de eficiência operacional',
    period: 'monthly',
    lastUpdated: '2025-06-01',
    status: 'updated'
  },
  {
    id: '5',
    title: 'Tendências de Mercado',
    type: 'forecast',
    description: 'Análise de tendências do mercado de construção',
    period: 'quarterly',
    lastUpdated: '2025-04-01',
    status: 'outdated'
  }
];

// Mock data para métricas financeiras
const mockFinancialMetrics: FinancialMetric[] = [
  { name: 'Receita Total', value: 1250000, trend: 'up', percentage: 12, color: '#10B981' },
  { name: 'Despesas', value: 875000, trend: 'down', percentage: 5, color: '#3B82F6' },
  { name: 'Lucro Líquido', value: 375000, trend: 'up', percentage: 18, color: '#8B5CF6' },
  { name: 'ROI', value: 22, trend: 'up', percentage: 3, color: '#F97316' }
];

// Mock data para desempenho de projetos
const mockProjectPerformance: ProjectPerformance[] = [
  { name: 'Projeto A', budget: 500000, actual: 480000, variance: 20000 },
  { name: 'Projeto B', budget: 750000, actual: 800000, variance: -50000 },
  { name: 'Projeto C', budget: 300000, actual: 290000, variance: 10000 },
  { name: 'Projeto D', budget: 1200000, actual: 1150000, variance: 50000 },
  { name: 'Projeto E', budget: 600000, actual: 650000, variance: -50000 }
];

// Mock data para receita mensal
const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: 'Jan', revenue: 950000, expenses: 700000, profit: 250000 },
  { month: 'Fev', revenue: 880000, expenses: 650000, profit: 230000 },
  { month: 'Mar', revenue: 1050000, expenses: 720000, profit: 330000 },
  { month: 'Abr', revenue: 1100000, expenses: 750000, profit: 350000 },
  { month: 'Mai', revenue: 1180000, expenses: 820000, profit: 360000 },
  { month: 'Jun', revenue: 1250000, expenses: 875000, profit: 375000 }
];

// Mock data para distribuição por categoria
const mockCategoryDistribution: CategoryDistribution[] = [
  { name: 'Projetos Residenciais', value: 45, color: '#3B82F6' },
  { name: 'Projetos Comerciais', value: 30, color: '#8B5CF6' },
  { name: 'Projetos Industriais', value: 15, color: '#EC4899' },
  { name: 'Reformas', value: 10, color: '#F97316' }
];

// Mock data para métricas de desempenho
const mockPerformanceMetrics: PerformanceMetric[] = [
  { subject: 'Eficiência', A: 120, B: 110, fullMark: 150 },
  { subject: 'Qualidade', A: 98, B: 130, fullMark: 150 },
  { subject: 'Prazo', A: 86, B: 130, fullMark: 150 },
  { subject: 'Custo', A: 99, B: 100, fullMark: 150 },
  { subject: 'Satisfação', A: 85, B: 90, fullMark: 150 },
  { subject: 'Inovação', A: 65, B: 85, fullMark: 150 }
];

// Componente principal da página de análise de dados
// Main component for the data analytics page
const AnalyticsPage = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Função para buscar dados de análise
  // Function to fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Em produção, substituir por chamada real à API
      // In production, replace with actual API call
      // const response = await fetch('/api/analytics');
      // const data = await response.json();
      
      // Simulando delay de API
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalytics(mockAnalytics);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar dados de análise:', err);
      setError('Erro ao carregar dados de análise. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar dados de análise
  // Function to refresh analytics data
  const refreshAnalytics = async () => {
    try {
      setRefreshing(true);
      
      // Simulando atualização de dados
      // Simulating data update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar status dos dados
      // Update data status
      const updatedAnalytics = analytics.map(item => ({
        ...item,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: 'updated' as const
      }));
      
      setAnalytics(updatedAnalytics);
      
      // Mostrar mensagem de sucesso (em produção, usar um sistema de notificações)
      // Show success message (in production, use a notification system)
      alert('Dados de análise atualizados com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar dados de análise:', err);
      alert('Erro ao atualizar dados de análise. Tente novamente.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Filtrar análises com base nos critérios
  // Filter analytics based on criteria
  const filteredAnalytics = analytics.filter(item => 
    (selectedPeriod === 'all' || item.period === selectedPeriod) &&
    (selectedType === 'all' || item.type === selectedType)
  );

  // Função para formatar valores monetários
  // Function to format monetary values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para formatar percentuais
  // Function to format percentages
  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  // Função para obter cor do status
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'updated': return 'bg-green-100 text-green-800';
      case 'outdated': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto do status
  // Function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'updated': return 'Atualizado';
      case 'outdated': return 'Desatualizado';
      case 'processing': return 'Processando';
      default: return status;
    }
  };

  // Função para obter texto do tipo
  // Function to get type text
  const getTypeText = (type: string) => {
    switch (type) {
      case 'financial': return 'Financeiro';
      case 'operational': return 'Operacional';
      case 'project': return 'Projeto';
      case 'forecast': return 'Previsão';
      default: return type;
    }
  };

  // Função para obter texto do período
  // Function to get period text
  const getPeriodText = (period: string) => {
    switch (period) {
      case 'daily': return 'Diário';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
      case 'quarterly': return 'Trimestral';
      case 'yearly': return 'Anual';
      default: return period;
    }
  };

  // Função para obter ícone de tendência
  // Function to get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <span className="text-green-600">↑</span>;
      case 'down': return <span className="text-red-600">↓</span>;
      case 'stable': return <span className="text-gray-600">→</span>;
      default: return null;
    }
  };

  // Função para exportar dados
  // Function to export data
  const exportData = () => {
    const csvContent = [
      ['ID', 'Título', 'Tipo', 'Descrição', 'Período', 'Última Atualização', 'Status'].join(','),
      ...filteredAnalytics.map(item => [
        item.id,
        item.title,
        getTypeText(item.type),
        item.description,
        getPeriodText(item.period),
        item.lastUpdated,
        getStatusText(item.status)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'analise-dados.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('menu.analytics')}
          </h1>
          <p className="text-gray-600 mt-1">
            Análise de dados e métricas de desempenho
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            disabled={refreshing}
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar Dados'}
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Todos os Períodos</option>
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Análise
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Todos os Tipos</option>
              <option value="financial">Financeiro</option>
              <option value="operational">Operacional</option>
              <option value="project">Projeto</option>
              <option value="forecast">Previsão</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas Financeiras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockFinancialMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{metric.name}</p>
                <p className="text-xl font-semibold text-gray-900">
                  {metric.name === 'ROI' ? formatPercentage(metric.value) : formatCurrency(metric.value)}
                </p>
              </div>
              <div className={`bg-${metric.color.replace('#', '')}-100 p-2 rounded-lg`} style={{ backgroundColor: `${metric.color}20` }}>
                <FiBarChart2 className="w-5 h-5" style={{ color: metric.color }} />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {getTrendIcon(metric.trend)} {metric.percentage}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs. mês anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Receita Mensal */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Receita x Despesas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockMonthlyRevenue}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Receita" stroke="#10B981" fill="#10B98120" />
                <Area type="monotone" dataKey="expenses" name="Despesas" stroke="#EF4444" fill="#EF444420" />
                <Area type="monotone" dataKey="profit" name="Lucro" stroke="#3B82F6" fill="#3B82F620" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Desempenho de Projetos */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Desempenho de Projetos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockProjectPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="budget" name="Orçamento" fill="#3B82F6" />
                <Bar dataKey="actual" name="Realizado" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Distribuição por Categoria */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Categoria</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockCategoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Radar de Métricas de Desempenho */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Métricas de Desempenho</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockPerformanceMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="Atual" dataKey="A" stroke="#8B5CF6" fill="#8B5CF680" fillOpacity={0.6} />
                <Radar name="Meta" dataKey="B" stroke="#10B981" fill="#10B98180" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista de Análises Disponíveis */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Análises Disponíveis</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={fetchAnalytics}
              className="ml-2 text-red-700 underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredAnalytics.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
            Nenhuma análise encontrada com os filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atualização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAnalytics.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTypeText(item.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPeriodText(item.period)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.lastUpdated).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => alert(`Visualizando análise: ${item.title}`)}
                      >
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Insights e Recomendações */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Insights e Recomendações</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FiTrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Crescimento de Receita</h3>
                <p className="text-sm text-blue-700 mt-1">
                  A receita cresceu 12% em relação ao mês anterior, impulsionada principalmente pelos projetos residenciais.
                  Recomendamos aumentar o foco neste segmento para o próximo trimestre.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <FiBarChart2 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Atenção ao Projeto B</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  O Projeto B está 6.7% acima do orçamento previsto. Recomendamos uma revisão detalhada dos custos
                  e possíveis ajustes no cronograma para evitar impactos maiores na margem.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <FiPieChart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-green-800">Eficiência Operacional</h3>
                <p className="text-sm text-green-700 mt-1">
                  As melhorias nos processos resultaram em uma redução de 5% nas despesas operacionais.
                  Continue implementando as práticas de otimização de recursos e gestão de fornecedores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
