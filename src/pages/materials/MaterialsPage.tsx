import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiRefreshCw, FiDownload, FiFilter, FiPackage, FiTruck, FiBarChart2 } from 'react-icons/fi'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'

// Interfaces
interface Material {
  id: string
  code: string
  name: string
  category: string
  unit: string
  unitPrice: number
  stock: number
  minStock: number
  supplier: string
  lastPurchase?: string
  location?: string
  status: 'available' | 'low' | 'out_of_stock'
  notes?: string
}

interface CategorySummary {
  name: string
  value: number
  color: string
}

interface StockSummary {
  status: string
  count: number
  percentage: number
  color: string
}

interface PriceHistory {
  month: string
  price: number
}

// Mock data
const mockMaterials: Material[] = [
  {
    id: '1',
    code: 'MAT-001',
    name: 'Cimento Portland CP-II',
    category: 'Cimento e Argamassa',
    unit: 'Saco 50kg',
    unitPrice: 32.50,
    stock: 120,
    minStock: 50,
    supplier: 'ABC Materiais de Construção',
    lastPurchase: '2025-05-15',
    location: 'Depósito A - Prateleira 1',
    status: 'available',
    notes: 'Validade: 3 meses'
  },
  {
    id: '2',
    code: 'MAT-002',
    name: 'Tijolo Cerâmico 9x19x19',
    category: 'Alvenaria',
    unit: 'Milheiro',
    unitPrice: 850.00,
    stock: 5,
    minStock: 2,
    supplier: 'Cerâmica XYZ',
    lastPurchase: '2025-05-20',
    location: 'Depósito B',
    status: 'available'
  },
  {
    id: '3',
    code: 'MAT-003',
    name: 'Areia Média',
    category: 'Agregados',
    unit: 'm³',
    unitPrice: 120.00,
    stock: 15,
    minStock: 10,
    supplier: 'Mineradora 123',
    lastPurchase: '2025-05-10',
    location: 'Pátio Externo',
    status: 'available'
  },
  {
    id: '4',
    code: 'MAT-004',
    name: 'Brita nº 1',
    category: 'Agregados',
    unit: 'm³',
    unitPrice: 135.00,
    stock: 8,
    minStock: 10,
    supplier: 'Mineradora 123',
    lastPurchase: '2025-05-10',
    location: 'Pátio Externo',
    status: 'low'
  },
  {
    id: '5',
    code: 'MAT-005',
    name: 'Vergalhão CA-50 10mm',
    category: 'Aço e Metais',
    unit: 'Barra 12m',
    unitPrice: 45.80,
    stock: 80,
    minStock: 30,
    supplier: 'Ferro & Aço Ltda',
    lastPurchase: '2025-05-25',
    location: 'Depósito A - Prateleira 3',
    status: 'available'
  },
  {
    id: '6',
    code: 'MAT-006',
    name: 'Tinta Acrílica Branca',
    category: 'Tintas e Solventes',
    unit: 'Lata 18L',
    unitPrice: 289.90,
    stock: 12,
    minStock: 5,
    supplier: 'Tintas Premium',
    lastPurchase: '2025-06-01',
    location: 'Depósito C - Prateleira 2',
    status: 'available'
  },
  {
    id: '7',
    code: 'MAT-007',
    name: 'Tubo PVC 100mm',
    category: 'Hidráulica',
    unit: 'Barra 6m',
    unitPrice: 89.50,
    stock: 25,
    minStock: 10,
    supplier: 'Hidráulica Express',
    lastPurchase: '2025-05-18',
    location: 'Depósito B - Prateleira 4',
    status: 'available'
  },
  {
    id: '8',
    code: 'MAT-008',
    name: 'Fio Elétrico 2.5mm²',
    category: 'Elétrica',
    unit: 'Rolo 100m',
    unitPrice: 178.90,
    stock: 0,
    minStock: 5,
    supplier: 'Materiais Elétricos SA',
    lastPurchase: '2025-04-10',
    location: 'Depósito C - Prateleira 1',
    status: 'out_of_stock'
  },
  {
    id: '9',
    code: 'MAT-009',
    name: 'Telha Cerâmica Portuguesa',
    category: 'Cobertura',
    unit: 'Milheiro',
    unitPrice: 1850.00,
    stock: 1,
    minStock: 1,
    supplier: 'Cerâmica XYZ',
    lastPurchase: '2025-05-05',
    location: 'Depósito B',
    status: 'low'
  },
  {
    id: '10',
    code: 'MAT-010',
    name: 'Argamassa Colante AC-II',
    category: 'Cimento e Argamassa',
    unit: 'Saco 20kg',
    unitPrice: 28.90,
    stock: 45,
    minStock: 20,
    supplier: 'ABC Materiais de Construção',
    lastPurchase: '2025-05-22',
    location: 'Depósito A - Prateleira 2',
    status: 'available'
  }
];

// Mock data para gráficos
const mockCategoryData: CategorySummary[] = [
  { name: 'Cimento e Argamassa', value: 2950, color: '#3B82F6' },
  { name: 'Alvenaria', value: 4250, color: '#8B5CF6' },
  { name: 'Agregados', value: 3150, color: '#EC4899' },
  { name: 'Aço e Metais', value: 3664, color: '#F97316' },
  { name: 'Tintas e Solventes', value: 3479, color: '#10B981' },
  { name: 'Hidráulica', value: 2238, color: '#6B7280' },
  { name: 'Elétrica', value: 0, color: '#EF4444' },
  { name: 'Cobertura', value: 1850, color: '#F59E0B' }
];

// Dados de status de estoque
const mockStockData: StockSummary[] = [
  { status: 'Disponível', count: 7, percentage: 70, color: '#10B981' },
  { status: 'Baixo Estoque', count: 2, percentage: 20, color: '#F59E0B' },
  { status: 'Sem Estoque', count: 1, percentage: 10, color: '#EF4444' }
];

// Histórico de preços
const mockPriceHistory: PriceHistory[] = [
  { month: 'Jan', price: 28.50 },
  { month: 'Fev', price: 29.20 },
  { month: 'Mar', price: 30.00 },
  { month: 'Abr', price: 31.25 },
  { month: 'Mai', price: 32.50 },
  { month: 'Jun', price: 32.50 }
];

const MaterialsPage = () => {
  const { t } = useTranslation();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  });

  // Função para buscar materiais
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      // Em produção, substituir por chamada real à API
      // const response = await fetch('/api/materials');
      // const data = await response.json();
      
      // Simulando delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMaterials(mockMaterials);
      calculateSummary(mockMaterials);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar materiais:', err);
      setError('Erro ao carregar materiais. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Calcular resumo de materiais
  const calculateSummary = (data: Material[]) => {
    const summary = data.reduce((acc, material) => {
      acc.totalItems += material.stock;
      acc.totalValue += material.stock * material.unitPrice;
      
      if (material.status === 'low') {
        acc.lowStockItems += 1;
      } else if (material.status === 'out_of_stock') {
        acc.outOfStockItems += 1;
      }
      
      return acc;
    }, {
      totalItems: 0,
      totalValue: 0,
      lowStockItems: 0,
      outOfStockItems: 0
    });
    
    setSummaryData(summary);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Função para ordenar materiais
  const sortMaterials = (a: Material, b: Material) => {
    let fieldA: any = a[sortField as keyof Material];
    let fieldB: any = b[sortField as keyof Material];
    
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

  // Filtrar materiais com base nos critérios
  const filteredMaterials = materials
    .filter(material => 
      (material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
       material.supplier.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory.length === 0 || filterCategory.includes(material.category)) &&
      (filterStatus.length === 0 || filterStatus.includes(material.status))
    )
    .sort(sortMaterials);

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

  // Funções para navegação de páginas
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Função para abrir modal de filtros
  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  // Função para abrir modal de detalhes
  const openDetailModal = (material: Material) => {
    setSelectedMaterial(material);
    setIsDetailModalOpen(true);
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    setIsFilterModalOpen(false);
    setCurrentPage(1); // Resetar para primeira página ao filtrar
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilterCategory([]);
    setFilterStatus([]);
    setSearchTerm('');
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  // Função para exportar dados
  const exportData = () => {
    const csvContent = [
      ['Código', 'Nome', 'Categoria', 'Unidade', 'Preço Unitário', 'Estoque', 'Estoque Mínimo', 'Fornecedor', 'Última Compra', 'Localização', 'Status', 'Observações'].join(','),
      ...filteredMaterials.map(material => [
        material.code,
        material.name,
        material.category,
        material.unit,
        material.unitPrice.toFixed(2),
        material.stock,
        material.minStock,
        material.supplier,
        material.lastPurchase || '',
        material.location || '',
        material.status,
        material.notes || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'materiais.csv');
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
      case 'available': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'low': return 'Baixo Estoque';
      case 'out_of_stock': return 'Sem Estoque';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('menu.materials')}
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie materiais de construção e estoque
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchMaterials}
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
              <p className="text-sm text-gray-500">Total de Itens</p>
              <p className="text-xl font-semibold text-gray-900">{summaryData.totalItems}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <FiPackage className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {materials.length} tipos de materiais
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Valor em Estoque</p>
              <p className="text-xl font-semibold text-blue-600">{formatCurrency(summaryData.totalValue)}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiBarChart2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Valor total dos materiais
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Baixo Estoque</p>
              <p className="text-xl font-semibold text-yellow-600">{summaryData.lowStockItems}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <FiPackage className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Materiais abaixo do estoque mínimo
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Sem Estoque</p>
              <p className="text-xl font-semibold text-red-600">{summaryData.outOfStockItems}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <FiTruck className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Materiais esgotados
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Valor por Categoria */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Valor por Categoria</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockCategoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
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

        {/* Gráfico de Status de Estoque */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Status de Estoque</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockStockData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockStockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Legenda</h3>
            <div className="grid grid-cols-1 gap-2">
              {mockStockData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.status}: {item.count} itens</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Histórico de Preços */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Histórico de Preços - Cimento Portland CP-II</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockPriceHistory}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Line type="monotone" dataKey="price" name="Preço" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
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
            placeholder="Buscar material, código..."
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
            {(filterCategory.length > 0 || filterStatus.length > 0) && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filterCategory.length + filterStatus.length}
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

      {/* Tabela de materiais */}
      {loading && !materials.length ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={fetchMaterials}
            className="ml-2 text-red-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
          {searchTerm || filterCategory.length > 0 || filterStatus.length > 0 ? 
            "Nenhum material encontrado com os filtros aplicados." : 
            "Nenhum material cadastrado."}
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
                      onClick={() => toggleSort('code')}
                    >
                      <div className="flex items-center">
                        Código
                        {sortField === 'code' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('name')}
                    >
                      <div className="flex items-center">
                        Nome
                        {sortField === 'name' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('category')}
                    >
                      <div className="flex items-center">
                        Categoria
                        {sortField === 'category' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('unitPrice')}
                    >
                      <div className="flex items-center justify-end">
                        Preço Unit.
                        {sortField === 'unitPrice' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('stock')}
                    >
                      <div className="flex items-center justify-end">
                        Estoque
                        {sortField === 'stock' && (
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
                  {currentItems.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {material.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {material.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {material.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {formatCurrency(material.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center">
                          <span className={`${
                            material.stock < material.minStock 
                              ? material.stock === 0 
                                ? 'text-red-600' 
                                : 'text-yellow-600' 
                              : 'text-green-600'
                          }`}>
                            {material.stock}
                          </span>
                          <span className="text-gray-400 ml-1">/ {material.minStock}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(material.status)}`}>
                          {getStatusText(material.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openDetailModal(material)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Detalhes
                        </button>
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
                Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, filteredMaterials.length)}</span> de <span className="font-medium">{filteredMaterials.length}</span> resultados
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
                  {['available', 'low', 'out_of_stock'].map((status) => (
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
              
              {/* Filtro por Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorias
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {Array.from(new Set(materials.map(m => m.category))).map((category) => (
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

      {/* Modal de Detalhes */}
      {isDetailModalOpen && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalhes do Material
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Informações Básicas</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Código:</span>
                      <p className="text-sm text-gray-900">{selectedMaterial.code}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Nome:</span>
                      <p className="text-sm text-gray-900">{selectedMaterial.name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Categoria:</span>
                      <p className="text-sm text-gray-900">{selectedMaterial.category}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Unidade:</span>
                      <p className="text-sm text-gray-900">{selectedMaterial.unit}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Preço Unitário:</span>
                      <p className="text-sm text-gray-900">{formatCurrency(selectedMaterial.unitPrice)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Estoque</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Estoque Atual:</span>
                      <p className="text-sm text-gray-900">{selectedMaterial.stock}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Estoque Mínimo:</span>
                      <p className="text-sm text-gray-900">{selectedMaterial.minStock}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Status:</span>
                      <p className="text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedMaterial.status)}`}>
                          {getStatusText(selectedMaterial.status)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Localização:</span>
                      <p className="text-sm text-gray-900">{selectedMaterial.location || 'Não especificada'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Valor Total em Estoque:</span>
                      <p className="text-sm text-gray-900">{formatCurrency(selectedMaterial.stock * selectedMaterial.unitPrice)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Informações Adicionais</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Fornecedor:</span>
                    <p className="text-sm text-gray-900">{selectedMaterial.supplier}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Última Compra:</span>
                    <p className="text-sm text-gray-900">{selectedMaterial.lastPurchase ? new Date(selectedMaterial.lastPurchase).toLocaleDateString('pt-BR') : 'Não registrada'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Observações:</span>
                    <p className="text-sm text-gray-900">{selectedMaterial.notes || 'Nenhuma observação'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
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
    </div>
  );
};

export default MaterialsPage;
