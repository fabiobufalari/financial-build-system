import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiRefreshCw, FiDownload, FiFilter, FiCalendar, FiDollarSign, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'

// Interfaces
interface Transaction {
  id: string
  date: string
  description: string
  category: string
  type: 'income' | 'expense'
  amount: number
  status: 'completed' | 'pending' | 'cancelled'
  account: string
  project?: string
}

interface SummaryData {
  totalIncome: number
  totalExpense: number
  balance: number
  pendingIncome: number
  pendingExpense: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}

interface MonthlyData {
  month: string
  income: number
  expense: number
  balance: number
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    date: '2025-06-01',
    description: 'Pagamento Projeto Residencial',
    category: 'Receita de Projeto',
    type: 'income',
    amount: 45000,
    status: 'completed',
    account: 'Conta Principal'
  },
  {
    id: 'tx2',
    date: '2025-06-03',
    description: 'Compra de Materiais',
    category: 'Materiais',
    type: 'expense',
    amount: 12500,
    status: 'completed',
    account: 'Conta Principal',
    project: 'Projeto Residencial'
  },
  {
    id: 'tx3',
    date: '2025-06-05',
    description: 'Pagamento de Fornecedor',
    category: 'Fornecedores',
    type: 'expense',
    amount: 8750,
    status: 'completed',
    account: 'Conta Principal',
    project: 'Projeto Comercial'
  },
  {
    id: 'tx4',
    date: '2025-06-08',
    description: 'Adiantamento de Cliente',
    category: 'Receita de Projeto',
    type: 'income',
    amount: 30000,
    status: 'completed',
    account: 'Conta Secundária',
    project: 'Projeto Comercial'
  },
  {
    id: 'tx5',
    date: '2025-06-10',
    description: 'Pagamento de Funcionários',
    category: 'Folha de Pagamento',
    type: 'expense',
    amount: 22000,
    status: 'completed',
    account: 'Conta Principal'
  },
  {
    id: 'tx6',
    date: '2025-06-15',
    description: 'Fatura Pendente',
    category: 'Receita de Projeto',
    type: 'income',
    amount: 18500,
    status: 'pending',
    account: 'Conta Principal',
    project: 'Projeto Residencial'
  },
  {
    id: 'tx7',
    date: '2025-06-18',
    description: 'Aluguel de Equipamentos',
    category: 'Equipamentos',
    type: 'expense',
    amount: 5800,
    status: 'pending',
    account: 'Conta Principal',
    project: 'Projeto Comercial'
  },
  {
    id: 'tx8',
    date: '2025-06-20',
    description: 'Pagamento de Impostos',
    category: 'Impostos',
    type: 'expense',
    amount: 15200,
    status: 'pending',
    account: 'Conta Principal'
  }
];

// Mock data para categorias de despesas
const mockExpenseCategories: CategoryData[] = [
  { name: 'Materiais', value: 12500, color: '#3B82F6' },
  { name: 'Fornecedores', value: 8750, color: '#10B981' },
  { name: 'Folha de Pagamento', value: 22000, color: '#F97316' },
  { name: 'Equipamentos', value: 5800, color: '#8B5CF6' },
  { name: 'Impostos', value: 15200, color: '#EF4444' }
];

// Mock data para dados mensais
const mockMonthlyData: MonthlyData[] = [
  { month: 'Jan', income: 85000, expense: 65000, balance: 20000 },
  { month: 'Fev', income: 92000, expense: 70000, balance: 22000 },
  { month: 'Mar', income: 78000, expense: 62000, balance: 16000 },
  { month: 'Abr', income: 95000, expense: 68000, balance: 27000 },
  { month: 'Mai', income: 88000, expense: 72000, balance: 16000 },
  { month: 'Jun', income: 93500, expense: 64250, balance: 29250 }
];

const CashFlowPage = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<string>('month');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    pendingIncome: 0,
    pendingExpense: 0
  });
  const [expenseCategories, setExpenseCategories] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  // Função para buscar transações
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Em produção, substituir por chamada real à API
      // const response = await fetch('/api/transactions');
      // const data = await response.json();
      
      // Simulando delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setExpenseCategories(mockExpenseCategories);
      setMonthlyData(mockMonthlyData);
      
      // Calcular dados de resumo
      calculateSummary(mockTransactions);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular resumo financeiro
  const calculateSummary = (transactions: Transaction[]) => {
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      pendingIncome: 0,
      pendingExpense: 0
    };
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        if (transaction.status === 'completed') {
          summary.totalIncome += transaction.amount;
        } else if (transaction.status === 'pending') {
          summary.pendingIncome += transaction.amount;
        }
      } else if (transaction.type === 'expense') {
        if (transaction.status === 'completed') {
          summary.totalExpense += transaction.amount;
        } else if (transaction.status === 'pending') {
          summary.pendingExpense += transaction.amount;
        }
      }
    });
    
    summary.balance = summary.totalIncome - summary.totalExpense;
    setSummaryData(summary);
  };

  // Função para filtrar transações
  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Filtrar por tipo de transação
    if (transactionType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === transactionType);
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.description.toLowerCase().includes(term) ||
        transaction.category.toLowerCase().includes(term) ||
        transaction.account.toLowerCase().includes(term) ||
        (transaction.project && transaction.project.toLowerCase().includes(term))
      );
    }
    
    // Filtrar por período
    const today = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Desde o início
    }
    
    filtered = filtered.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= today;
    });
    
    setFilteredTransactions(filtered);
    calculateSummary(filtered);
  };

  // Efeito para buscar transações ao carregar
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Efeito para filtrar transações quando os filtros mudam
  useEffect(() => {
    if (transactions.length > 0) {
      filterTransactions();
    }
  }, [dateRange, transactionType, searchTerm, transactions]);

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para exportar dados
  const exportData = () => {
    const csvContent = [
      ['ID', 'Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Status', 'Conta', 'Projeto'].join(','),
      ...filteredTransactions.map(transaction => [
        transaction.id,
        transaction.date,
        `"${transaction.description}"`,
        transaction.category,
        transaction.type === 'income' ? 'Receita' : 'Despesa',
        transaction.amount,
        transaction.status === 'completed' ? 'Concluído' : transaction.status === 'pending' ? 'Pendente' : 'Cancelado',
        transaction.account,
        transaction.project || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'fluxo-de-caixa.csv');
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
            {t('menu.cashflow')}
          </h1>
          <p className="text-gray-600 mt-1">
            Monitoramento e projeções de fluxo de caixa
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Atualizando...' : 'Atualizar'}
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

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Receita Total</p>
              <p className="text-xl font-semibold text-gray-900">{formatCurrency(summaryData.totalIncome)}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <FiArrowUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Receitas confirmadas no período</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Despesa Total</p>
              <p className="text-xl font-semibold text-gray-900">{formatCurrency(summaryData.totalExpense)}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <FiArrowDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Despesas confirmadas no período</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Saldo</p>
              <p className={`text-xl font-semibold ${summaryData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summaryData.balance)}
              </p>
            </div>
            <div className={`${summaryData.balance >= 0 ? 'bg-green-100' : 'bg-red-100'} p-2 rounded-lg`}>
              <FiDollarSign className={`w-5 h-5 ${summaryData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Receitas - Despesas</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Receitas Pendentes</p>
              <p className="text-xl font-semibold text-blue-600">{formatCurrency(summaryData.pendingIncome)}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiCalendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Receitas ainda não confirmadas</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Despesas Pendentes</p>
              <p className="text-xl font-semibold text-orange-600">{formatCurrency(summaryData.pendingExpense)}</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <FiCalendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Despesas ainda não confirmadas</p>
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
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="quarter">Último Trimestre</option>
              <option value="year">Último Ano</option>
              <option value="all">Todo o Período</option>
            </select>
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Transação
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Todas as Transações</option>
              <option value="income">Apenas Receitas</option>
              <option value="expense">Apenas Despesas</option>
            </select>
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descrição, categoria..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Receitas x Despesas */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Receitas x Despesas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area type="monotone" dataKey="income" name="Receitas" stroke="#10B981" fill="#10B98120" />
                <Area type="monotone" dataKey="expense" name="Despesas" stroke="#EF4444" fill="#EF444420" />
                <Area type="monotone" dataKey="balance" name="Saldo" stroke="#3B82F6" fill="#3B82F620" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Categorias de Despesas */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Categorias de Despesas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Transações</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
            Nenhuma transação encontrada com os filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projeto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.account}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.project || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'completed' ? 'Concluído' : 
                         transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashFlowPage;
