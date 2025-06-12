import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiRefreshCw, FiDownload, FiFilter, FiCalendar, FiDollarSign, FiClock } from 'react-icons/fi'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'

// Interfaces
interface AccountReceivable {
  id: string
  invoiceNumber: string
  client: string
  description: string
  amount: number
  dueDate: string
  issueDate: string
  status: 'received' | 'pending' | 'overdue' | 'cancelled'
  paymentMethod?: string
  paymentDate?: string
  category: string
  project?: string
  notes?: string
}

interface AgingSummary {
  range: string
  amount: number
  percentage: number
  color: string
}

interface CategorySummary {
  name: string
  value: number
  color: string
}

// Mock data
const mockAccountsReceivable: AccountReceivable[] = [
  {
    id: '1',
    invoiceNumber: 'REC-2025-001',
    client: 'Empresa ABC',
    description: 'Projeto Residencial - Fase 1',
    amount: 45000,
    dueDate: '2025-06-15',
    issueDate: '2025-06-01',
    status: 'pending',
    category: 'Projetos Residenciais',
    project: 'Residencial Vila Nova',
    notes: 'Pagamento parcelado em 3x'
  },
  {
    id: '2',
    invoiceNumber: 'REC-2025-002',
    client: 'Construtora XYZ',
    description: 'Consultoria Técnica',
    amount: 12500,
    dueDate: '2025-06-10',
    issueDate: '2025-05-25',
    status: 'received',
    paymentMethod: 'Transferência Bancária',
    paymentDate: '2025-06-08',
    category: 'Consultoria',
    project: 'Comercial Centro'
  },
  {
    id: '3',
    invoiceNumber: 'REC-2025-003',
    client: 'Incorporadora 123',
    description: 'Projeto Comercial - Fase Final',
    amount: 38500,
    dueDate: '2025-06-05',
    issueDate: '2025-05-20',
    status: 'overdue',
    category: 'Projetos Comerciais',
    project: 'Comercial Centro'
  },
  {
    id: '4',
    invoiceNumber: 'REC-2025-004',
    client: 'Condomínio Jardins',
    description: 'Reforma da Área Comum',
    amount: 27500,
    dueDate: '2025-06-20',
    issueDate: '2025-06-05',
    status: 'pending',
    category: 'Reformas',
    project: 'Reforma Condomínio'
  },
  {
    id: '5',
    invoiceNumber: 'REC-2025-005',
    client: 'Empresa de Engenharia',
    description: 'Parceria em Projeto Industrial',
    amount: 64500,
    dueDate: '2025-06-12',
    issueDate: '2025-05-28',
    status: 'received',
    paymentMethod: 'Boleto Bancário',
    paymentDate: '2025-06-10',
    category: 'Projetos Industriais',
    project: 'Industrial Zona Leste'
  },
  {
    id: '6',
    invoiceNumber: 'REC-2025-006',
    client: 'Prefeitura Municipal',
    description: 'Projeto de Infraestrutura',
    amount: 85800,
    dueDate: '2025-06-18',
    issueDate: '2025-06-03',
    status: 'pending',
    category: 'Projetos Públicos',
    project: 'Infraestrutura Urbana'
  },
  {
    id: '7',
    invoiceNumber: 'REC-2025-007',
    client: 'Escola Particular',
    description: 'Ampliação de Instalações',
    amount: 42300,
    dueDate: '2025-06-08',
    issueDate: '2025-05-23',
    status: 'overdue',
    category: 'Projetos Educacionais',
    project: 'Ampliação Escola'
  },
  {
    id: '8',
    invoiceNumber: 'REC-2025-008',
    client: 'Hospital Regional',
    description: 'Reforma da Ala Leste',
    amount: 54200,
    dueDate: '2025-06-25',
    issueDate: '2025-06-10',
    status: 'pending',
    category: 'Projetos Hospitalares',
    project: 'Reforma Hospital'
  },
  {
    id: '9',
    invoiceNumber: 'REC-2025-009',
    client: 'Shopping Center',
    description: 'Expansão da Área Comercial',
    amount: 91800,
    dueDate: '2025-06-15',
    issueDate: '2025-06-01',
    status: 'received',
    paymentMethod: 'Transferência Bancária',
    paymentDate: '2025-06-12',
    category: 'Projetos Comerciais',
    project: 'Expansão Shopping'
  },
  {
    id: '10',
    invoiceNumber: 'REC-2025-010',
    client: 'Rede de Hotéis',
    description: 'Projeto de Novo Hotel',
    amount: 126500,
    dueDate: '2025-06-30',
    issueDate: '2025-06-15',
    status: 'pending',
    category: 'Projetos Hoteleiros',
    project: 'Novo Hotel'
  }
];

// Mock data para gráficos
const mockMonthlyReceivables = [
  { month: 'Jan', amount: 285000 },
  { month: 'Fev', amount: 238000 },
  { month: 'Mar', amount: 352000 },
  { month: 'Abr', amount: 289000 },
  { month: 'Mai', amount: 325000 },
  { month: 'Jun', amount: 588600 }
];

// Dados de aging (vencimento)
const mockAgingData: AgingSummary[] = [
  { range: 'A vencer', amount: 304000, percentage: 52, color: '#10B981' },
  { range: '1-15 dias', amount: 85800, percentage: 15, color: '#FBBF24' },
  { range: '16-30 dias', amount: 118500, percentage: 20, color: '#F97316' },
  { range: '> 30 dias', amount: 80300, percentage: 13, color: '#EF4444' }
];

// Dados por categoria
const mockCategoryData: CategorySummary[] = [
  { name: 'Projetos Residenciais', value: 45000, color: '#3B82F6' },
  { name: 'Projetos Comerciais', value: 130300, color: '#8B5CF6' },
  { name: 'Projetos Industriais', value: 64500, color: '#EC4899' },
  { name: 'Projetos Públicos', value: 85800, color: '#F97316' },
  { name: 'Reformas', value: 27500, color: '#10B981' },
  { name: 'Outros', value: 235500, color: '#6B7280' }
];

const AccountsReceivablePage = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<AccountReceivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2025-06-01',
    end: '2025-06-30'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalReceivable: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    receivedAmount: 0
  });

  // Função para buscar contas a receber
  const fetchAccountsReceivable = async () => {
    try {
      setLoading(true);
      // Em produção, substituir por chamada real à API
      // const response = await fetch('/api/accounts-receivable');
      // const data = await response.json();
      
      // Simulando delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccounts(mockAccountsReceivable);
      calculateSummary(mockAccountsReceivable);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar contas a receber:', err);
      setError('Erro ao carregar contas a receber. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Calcular resumo financeiro
  const calculateSummary = (data: AccountReceivable[]) => {
    const summary = data.reduce((acc, account) => {
      acc.totalReceivable += account.amount;
      
      if (account.status === 'pending') {
        acc.pendingAmount += account.amount;
      } else if (account.status === 'overdue') {
        acc.overdueAmount += account.amount;
      } else if (account.status === 'received') {
        acc.receivedAmount += account.amount;
      }
      
      return acc;
    }, {
      totalReceivable: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      receivedAmount: 0
    });
    
    setSummaryData(summary);
  };

  useEffect(() => {
    fetchAccountsReceivable();
  }, []);

  // Função para ordenar contas
  const sortAccounts = (a: AccountReceivable, b: AccountReceivable) => {
    let fieldA: any = a[sortField as keyof AccountReceivable];
    let fieldB: any = b[sortField as keyof AccountReceivable];
    
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

  // Filtrar contas com base nos critérios
  const filteredAccounts = accounts
    .filter(account => 
      (account.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       account.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
       account.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus.length === 0 || filterStatus.includes(account.status)) &&
      (filterCategory.length === 0 || filterCategory.includes(account.category)) &&
      new Date(account.dueDate) >= new Date(dateRange.start) &&
      new Date(account.dueDate) <= new Date(dateRange.end)
    )
    .sort(sortAccounts);

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  // Funções para navegação de páginas
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Função para abrir modal de filtros
  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    setIsFilterModalOpen(false);
    setCurrentPage(1); // Resetar para primeira página ao filtrar
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilterStatus([]);
    setFilterCategory([]);
    setSearchTerm('');
    setDateRange({
      start: '2025-06-01',
      end: '2025-06-30'
    });
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  // Função para exportar dados
  const exportData = () => {
    const csvContent = [
      ['ID', 'Nº Fatura', 'Cliente', 'Descrição', 'Valor', 'Data Vencimento', 'Data Emissão', 'Status', 'Método Pagamento', 'Data Pagamento', 'Categoria', 'Projeto', 'Observações'].join(','),
      ...filteredAccounts.map(account => [
        account.id,
        account.invoiceNumber,
        account.client,
        account.description,
        account.amount.toFixed(2),
        account.dueDate,
        account.issueDate,
        account.status,
        account.paymentMethod || '',
        account.paymentDate || '',
        account.category,
        account.project || '',
        account.notes || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'contas-a-receber.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'Recebido';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Vencido';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Função para calcular dias até o vencimento
  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Função para obter texto de dias até o vencimento
  const getDueDaysText = (dueDate: string, status: string) => {
    if (status === 'received') return 'Recebido';
    if (status === 'cancelled') return 'Cancelado';
    
    const days = getDaysUntilDue(dueDate);
    
    if (days < 0) {
      return `Vencido há ${Math.abs(days)} dias`;
    } else if (days === 0) {
      return 'Vence hoje';
    } else {
      return `Vence em ${days} dias`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('menu.accountsReceivable')}
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie faturas e recebimentos de clientes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAccountsReceivable}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total a Receber</p>
              <p className="text-xl font-semibold text-gray-900">{formatCurrency(summaryData.totalReceivable)}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <FiDollarSign className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {accounts.length} faturas no total
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Pendente</p>
              <p className="text-xl font-semibold text-yellow-600">{formatCurrency(summaryData.pendingAmount)}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <FiClock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {accounts.filter(a => a.status === 'pending').length} faturas pendentes
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Vencido</p>
              <p className="text-xl font-semibold text-red-600">{formatCurrency(summaryData.overdueAmount)}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <FiClock className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {accounts.filter(a => a.status === 'overdue').length} faturas vencidas
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Recebido</p>
              <p className="text-xl font-semibold text-green-600">{formatCurrency(summaryData.receivedAmount)}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {accounts.filter(a => a.status === 'received').length} faturas recebidas
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Contas a Receber por Mês */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contas a Receber por Mês</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockMonthlyReceivables}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="amount" name="Valor" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Aging (Vencimento) */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Aging de Contas</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAgingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="range"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockAgingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Legenda</h3>
            <div className="grid grid-cols-2 gap-2">
              {mockAgingData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Categorias */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Contas por Categoria</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockCategoryData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="value" name="Valor">
                {mockCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar fatura, cliente..."
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
            {(filterStatus.length > 0 || filterCategory.length > 0) && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filterStatus.length + filterCategory.length}
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

      {/* Tabela de contas a receber */}
      {loading && !accounts.length ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={fetchAccountsReceivable}
            className="ml-2 text-red-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
          {searchTerm || filterStatus.length > 0 || filterCategory.length > 0 ? 
            "Nenhuma conta a receber encontrada com os filtros aplicados." : 
            "Nenhuma conta a receber registrada no período selecionado."}
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
                      onClick={() => toggleSort('dueDate')}
                    >
                      <div className="flex items-center">
                        Vencimento
                        {sortField === 'dueDate' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('invoiceNumber')}
                    >
                      <div className="flex items-center">
                        Nº Fatura
                        {sortField === 'invoiceNumber' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('client')}
                    >
                      <div className="flex items-center">
                        Cliente
                        {sortField === 'client' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('description')}
                    >
                      <div className="flex items-center">
                        Descrição
                        {sortField === 'description' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('amount')}
                    >
                      <div className="flex items-center justify-end">
                        Valor
                        {sortField === 'amount' && (
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(account.dueDate).toLocaleDateString('pt-BR')}</div>
                        <div className="text-xs text-gray-500">{getDueDaysText(account.dueDate, account.status)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.client}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{account.description}</div>
                        {account.project && (
                          <div className="text-xs text-gray-500">Projeto: {account.project}</div>
                        )}
                        {account.category && (
                          <div className="text-xs text-gray-500">Categoria: {account.category}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {formatCurrency(account.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(account.status)}`}>
                          {getStatusText(account.status)}
                        </span>
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
                Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, filteredAccounts.length)}</span> de <span className="font-medium">{filteredAccounts.length}</span> resultados
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
              {/* Filtro por Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {['received', 'pending', 'overdue', 'cancelled'].map((status) => (
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
              
              {/* Filtro por Período */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período de Vencimento
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Data Inicial
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Data Final
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              {/* Filtro por Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorias
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {Array.from(new Set(accounts.map(a => a.category))).map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`filter-category-${category}`}
                        checked={filterCategory.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterCategory([...filterCategory, category]);
                          } else {
                            setFilterCategory(filterCategory.filter(c => c !== category));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`filter-category-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
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
    </div>
  );
};

export default AccountsReceivablePage;
