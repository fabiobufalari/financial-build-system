import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiRefreshCw, FiDownload, FiFilter, FiFileText, FiPrinter, FiMail } from 'react-icons/fi'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'

// Interfaces
interface Report {
  id: string
  title: string
  type: 'financial' | 'operational' | 'project' | 'custom'
  description: string
  createdAt: string
  lastGenerated?: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on_demand'
  status: 'active' | 'inactive' | 'archived'
  format: 'pdf' | 'excel' | 'csv' | 'html'
  recipients?: string[]
  parameters?: Record<string, any>
}

interface ReportTypeSummary {
  name: string
  count: number
  color: string
}

interface ReportFrequencySummary {
  name: string
  count: number
  color: string
}

// Mock data
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Relatório Financeiro Mensal',
    type: 'financial',
    description: 'Resumo mensal de receitas, despesas e fluxo de caixa',
    createdAt: '2025-01-15',
    lastGenerated: '2025-06-01',
    frequency: 'monthly',
    status: 'active',
    format: 'pdf',
    recipients: ['diretoria@financialbuilding.com', 'financeiro@financialbuilding.com'],
    parameters: {
      includeCharts: true,
      includeTables: true,
      comparePreviousPeriod: true
    }
  },
  {
    id: '2',
    title: 'Relatório de Projetos em Andamento',
    type: 'project',
    description: 'Status de todos os projetos ativos, custos e cronograma',
    createdAt: '2025-02-10',
    lastGenerated: '2025-06-05',
    frequency: 'weekly',
    status: 'active',
    format: 'excel',
    recipients: ['projetos@financialbuilding.com', 'gerentes@financialbuilding.com']
  },
  {
    id: '3',
    title: 'Análise de Contas a Receber',
    type: 'financial',
    description: 'Detalhamento de contas a receber, aging e previsão de recebimentos',
    createdAt: '2025-03-05',
    lastGenerated: '2025-06-01',
    frequency: 'monthly',
    status: 'active',
    format: 'pdf',
    recipients: ['financeiro@financialbuilding.com']
  },
  {
    id: '4',
    title: 'Inventário de Materiais',
    type: 'operational',
    description: 'Inventário completo de materiais, estoque e valorizações',
    createdAt: '2025-02-20',
    lastGenerated: '2025-06-01',
    frequency: 'monthly',
    status: 'active',
    format: 'excel',
    recipients: ['estoque@financialbuilding.com', 'compras@financialbuilding.com']
  },
  {
    id: '5',
    title: 'Relatório de Fornecedores',
    type: 'operational',
    description: 'Lista de fornecedores, valores pagos e pendentes',
    createdAt: '2025-03-15',
    lastGenerated: '2025-06-01',
    frequency: 'monthly',
    status: 'active',
    format: 'pdf',
    recipients: ['compras@financialbuilding.com', 'financeiro@financialbuilding.com']
  },
  {
    id: '6',
    title: 'Análise de Lucratividade por Projeto',
    type: 'financial',
    description: 'Análise detalhada de custos, receitas e margens por projeto',
    createdAt: '2025-04-10',
    lastGenerated: '2025-06-01',
    frequency: 'monthly',
    status: 'active',
    format: 'pdf',
    recipients: ['diretoria@financialbuilding.com', 'financeiro@financialbuilding.com']
  },
  {
    id: '7',
    title: 'Relatório de Funcionários e Custos',
    type: 'operational',
    description: 'Detalhamento de funcionários, custos e produtividade',
    createdAt: '2025-03-25',
    lastGenerated: '2025-06-01',
    frequency: 'monthly',
    status: 'active',
    format: 'excel',
    recipients: ['rh@financialbuilding.com', 'financeiro@financialbuilding.com']
  },
  {
    id: '8',
    title: 'Previsão Orçamentária Anual',
    type: 'financial',
    description: 'Projeção financeira para o ano fiscal',
    createdAt: '2025-01-05',
    lastGenerated: '2025-01-10',
    frequency: 'yearly',
    status: 'inactive',
    format: 'excel',
    recipients: ['diretoria@financialbuilding.com', 'financeiro@financialbuilding.com']
  },
  {
    id: '9',
    title: 'Relatório de Impostos',
    type: 'financial',
    description: 'Resumo de impostos pagos e a pagar',
    createdAt: '2025-02-15',
    lastGenerated: '2025-06-01',
    frequency: 'monthly',
    status: 'active',
    format: 'pdf',
    recipients: ['contabilidade@financialbuilding.com', 'financeiro@financialbuilding.com']
  },
  {
    id: '10',
    title: 'Análise de Mercado',
    type: 'custom',
    description: 'Análise de tendências do mercado de construção',
    createdAt: '2025-04-20',
    lastGenerated: '2025-04-25',
    frequency: 'quarterly',
    status: 'active',
    format: 'pdf',
    recipients: ['diretoria@financialbuilding.com', 'marketing@financialbuilding.com']
  }
];

// Mock data para gráficos
const mockReportTypeData: ReportTypeSummary[] = [
  { name: 'Financeiro', count: 5, color: '#3B82F6' },
  { name: 'Operacional', count: 3, color: '#10B981' },
  { name: 'Projeto', count: 1, color: '#F97316' },
  { name: 'Personalizado', count: 1, color: '#8B5CF6' }
];

// Dados de frequência de relatórios
const mockFrequencyData: ReportFrequencySummary[] = [
  { name: 'Diário', count: 0, color: '#EF4444' },
  { name: 'Semanal', count: 1, color: '#F97316' },
  { name: 'Mensal', count: 7, color: '#3B82F6' },
  { name: 'Trimestral', count: 1, color: '#10B981' },
  { name: 'Anual', count: 1, color: '#8B5CF6' },
  { name: 'Sob Demanda', count: 0, color: '#6B7280' }
];

// Dados de geração de relatórios por mês
const mockReportGenerationData = [
  { month: 'Jan', count: 10 },
  { month: 'Fev', count: 15 },
  { month: 'Mar', count: 18 },
  { month: 'Abr', count: 25 },
  { month: 'Mai', count: 30 },
  { month: 'Jun', count: 28 }
];

const ReportsPage = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterFormat, setFilterFormat] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Função para buscar relatórios
  const fetchReports = async () => {
    try {
      setLoading(true);
      // Em produção, substituir por chamada real à API
      // const response = await fetch('/api/reports');
      // const data = await response.json();
      
      // Simulando delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(mockReports);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar relatórios:', err);
      setError('Erro ao carregar relatórios. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Função para ordenar relatórios
  const sortReports = (a: Report, b: Report) => {
    let fieldA: any = a[sortField as keyof Report];
    let fieldB: any = b[sortField as keyof Report];
    
    if (typeof fieldA === 'string') {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  };

  // Função para alternar a direção da ordenação
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrar relatórios com base nos critérios
  const filteredReports = reports
    .filter(report => 
      (report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       report.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType.length === 0 || filterType.includes(report.type)) &&
      (filterStatus.length === 0 || filterStatus.includes(report.status)) &&
      (filterFormat.length === 0 || filterFormat.includes(report.format))
    )
    .sort(sortReports);

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // Funções para navegação de páginas
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Função para abrir modal de filtros
  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  // Função para abrir modal de detalhes
  const openDetailModal = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  // Função para abrir modal de geração de relatório
  const openGenerateModal = (report: Report) => {
    setSelectedReport(report);
    setIsGenerateModalOpen(true);
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    setIsFilterModalOpen(false);
    setCurrentPage(1); // Resetar para primeira página ao filtrar
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilterType([]);
    setFilterStatus([]);
    setFilterFormat([]);
    setSearchTerm('');
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  // Função para exportar dados
  const exportData = () => {
    const csvContent = [
      ['ID', 'Título', 'Tipo', 'Descrição', 'Data de Criação', 'Última Geração', 'Frequência', 'Status', 'Formato', 'Destinatários'].join(','),
      ...filteredReports.map(report => [
        report.id,
        report.title,
        report.type,
        report.description,
        report.createdAt,
        report.lastGenerated || '',
        report.frequency,
        report.status,
        report.format,
        report.recipients ? report.recipients.join('; ') : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para gerar relatório
  const generateReport = async () => {
    if (!selectedReport) return;
    
    setGeneratingReport(true);
    
    try {
      // Simulando geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar data de última geração
      const updatedReports = reports.map(report => {
        if (report.id === selectedReport.id) {
          return {
            ...report,
            lastGenerated: new Date().toISOString().split('T')[0]
          };
        }
        return report;
      });
      
      setReports(updatedReports);
      setIsGenerateModalOpen(false);
      
      // Mostrar mensagem de sucesso (em produção, usar um sistema de notificações)
      alert(`Relatório "${selectedReport.title}" gerado com sucesso!`);
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGeneratingReport(false);
    }
  };

  // Função para obter texto do tipo de relatório
  const getReportTypeText = (type: string) => {
    switch (type) {
      case 'financial': return 'Financeiro';
      case 'operational': return 'Operacional';
      case 'project': return 'Projeto';
      case 'custom': return 'Personalizado';
      default: return type;
    }
  };

  // Função para obter cor do tipo de relatório
  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-blue-100 text-blue-800';
      case 'operational': return 'bg-green-100 text-green-800';
      case 'project': return 'bg-orange-100 text-orange-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto da frequência
  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Diário';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
      case 'quarterly': return 'Trimestral';
      case 'yearly': return 'Anual';
      case 'on_demand': return 'Sob Demanda';
      default: return frequency;
    }
  };

  // Função para obter texto do formato
  const getFormatText = (format: string) => {
    return format.toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('menu.reports')}
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie e gere relatórios financeiros e operacionais
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchReports}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Tipos de Relatórios */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tipos de Relatórios</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockReportTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockReportTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Frequência de Relatórios */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Frequência de Relatórios</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockFrequencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockFrequencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Geração de Relatórios por Mês */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Relatórios Gerados por Mês</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockReportGenerationData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Relatórios Gerados" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar relatório..."
            className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={openFilterModal}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <FiFilter className="w-4 h-4" />
            Filtros
            {(filterType.length > 0 || filterStatus.length > 0 || filterFormat.length > 0) && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filterType.length + filterStatus.length + filterFormat.length}
              </span>
            )}
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

      {/* Tabela de relatórios */}
      {loading && !reports.length ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={fetchReports}
            className="ml-2 text-red-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
          {searchTerm || filterType.length > 0 || filterStatus.length > 0 || filterFormat.length > 0 ? 
            "Nenhum relatório encontrado com os filtros aplicados." : 
            "Nenhum relatório cadastrado."}
        </div>
      ) : (
        <>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('title')}
                    >
                      <div className="flex items-center">
                        Título
                        {sortField === 'title' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('type')}
                    >
                      <div className="flex items-center">
                        Tipo
                        {sortField === 'type' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('frequency')}
                    >
                      <div className="flex items-center">
                        Frequência
                        {sortField === 'frequency' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('lastGenerated')}
                    >
                      <div className="flex items-center">
                        Última Geração
                        {sortField === 'lastGenerated' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('format')}
                    >
                      <div className="flex items-center">
                        Formato
                        {sortField === 'format' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-xs text-gray-500">{report.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getReportTypeColor(report.type)}`}>
                          {getReportTypeText(report.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getFrequencyText(report.frequency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString('pt-BR') : 'Nunca'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getFormatText(report.format)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openDetailModal(report)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Detalhes
                          </button>
                          {report.status === 'active' && (
                            <button
                              onClick={() => openGenerateModal(report)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Gerar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, filteredReports.length)}</span> de <span className="font-medium">{filteredReports.length}</span> resultados
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Anterior
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Lógica para mostrar páginas ao redor da página atual
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de Filtros */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Filtros
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Filtro por Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Relatório
                </label>
                <div className="space-y-2">
                  {['financial', 'operational', 'project', 'custom'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`filter-type-${type}`}
                        checked={filterType.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterType([...filterType, type]);
                          } else {
                            setFilterType(filterType.filter(t => t !== type));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`filter-type-${type}`} className="ml-2 text-sm text-gray-700">
                        {getReportTypeText(type)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filtro por Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {['active', 'inactive', 'archived'].map((status) => (
                    <div key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`filter-status-${status}`}
                        checked={filterStatus.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterStatus([...filterStatus, status]);
                          } else {
                            setFilterStatus(filterStatus.filter(s => s !== status));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`filter-status-${status}`} className="ml-2 text-sm text-gray-700">
                        {getStatusText(status)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filtro por Formato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato
                </label>
                <div className="space-y-2">
                  {['pdf', 'excel', 'csv', 'html'].map((format) => (
                    <div key={format} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`filter-format-${format}`}
                        checked={filterFormat.includes(format)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterFormat([...filterFormat, format]);
                          } else {
                            setFilterFormat(filterFormat.filter(f => f !== format));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`filter-format-${format}`} className="ml-2 text-sm text-gray-700">
                        {getFormatText(format)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Limpar Filtros
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {isDetailModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalhes do Relatório
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Informações Básicas</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Título:</span>
                      <p className="text-sm text-gray-900">{selectedReport.title}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Descrição:</span>
                      <p className="text-sm text-gray-900">{selectedReport.description}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Tipo:</span>
                      <p className="text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getReportTypeColor(selectedReport.type)}`}>
                          {getReportTypeText(selectedReport.type)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Status:</span>
                      <p className="text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                          {getStatusText(selectedReport.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Configurações</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Frequência:</span>
                      <p className="text-sm text-gray-900">{getFrequencyText(selectedReport.frequency)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Formato:</span>
                      <p className="text-sm text-gray-900">{getFormatText(selectedReport.format)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Data de Criação:</span>
                      <p className="text-sm text-gray-900">{new Date(selectedReport.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Última Geração:</span>
                      <p className="text-sm text-gray-900">{selectedReport.lastGenerated ? new Date(selectedReport.lastGenerated).toLocaleDateString('pt-BR') : 'Nunca'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Destinatários</h4>
                <div className="space-y-2">
                  {selectedReport.recipients && selectedReport.recipients.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.recipients.map((recipient, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {recipient}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum destinatário configurado</p>
                  )}
                </div>
              </div>
              {selectedReport.parameters && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Parâmetros</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedReport.parameters, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <div>
                {selectedReport.status === 'active' && (
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      openGenerateModal(selectedReport);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FiFileText className="w-4 h-4" />
                    Gerar Relatório
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Geração de Relatório */}
      {isGenerateModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Gerar Relatório
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4">
                Você está prestes a gerar o relatório <strong>{selectedReport.title}</strong>.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formato
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    defaultValue={selectedReport.format}
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="html">HTML</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Data Inicial
                      </label>
                      <input
                        type="date"
                        defaultValue="2025-06-01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Data Final
                      </label>
                      <input
                        type="date"
                        defaultValue="2025-06-30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opções de Entrega
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="option-download"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="option-download" className="ml-2 text-sm text-gray-700">
                        <FiDownload className="w-4 h-4 inline mr-1" />
                        Download
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="option-print"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="option-print" className="ml-2 text-sm text-gray-700">
                        <FiPrinter className="w-4 h-4 inline mr-1" />
                        Imprimir
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="option-email"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="option-email" className="ml-2 text-sm text-gray-700">
                        <FiMail className="w-4 h-4 inline mr-1" />
                        Enviar por E-mail
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={generateReport}
                disabled={generatingReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                {generatingReport ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <FiFileText className="w-4 h-4" />
                    Gerar Relatório
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
