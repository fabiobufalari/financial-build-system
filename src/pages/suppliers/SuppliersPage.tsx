import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiRefreshCw, FiDownload, FiFilter, FiPlus, FiEdit, FiTrash2, FiStar, FiSearch } from 'react-icons/fi'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'

// Interfaces
interface Supplier {
  id: string
  name: string
  category: string
  contactName: string
  email: string
  phone: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  rating: number
  status: 'active' | 'inactive' | 'pending'
  totalOrders: number
  lastOrder?: string
  paymentTerms?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

interface SupplierFormData {
  id?: string
  name: string
  category: string
  contactName: string
  email: string
  phone: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  rating: number
  status: 'active' | 'inactive' | 'pending'
  totalOrders: number
  lastOrder?: string
  paymentTerms?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

interface SupplierCategory {
  name: string
  count: number
  color: string
}

interface SupplierRating {
  rating: number
  count: number
}

interface SupplierStatus {
  status: string
  count: number
  color: string
}

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Construtora ABC Ltda',
    category: 'Materiais de Construção',
    contactName: 'João Silva',
    email: 'joao.silva@abc.com',
    phone: '+1 (416) 555-0100',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M5V 2A8',
      country: 'Canadá'
    },
    rating: 4.8,
    status: 'active',
    totalOrders: 45,
    lastOrder: '2025-06-01',
    paymentTerms: '30 dias',
    notes: 'Fornecedor principal de materiais básicos',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Ferragens Toronto',
    category: 'Ferramentas e Equipamentos',
    contactName: 'Maria Santos',
    email: 'maria@ferragens.ca',
    phone: '+1 (416) 555-0200',
    address: {
      street: 'Avenida Principal',
      number: '456',
      complement: 'Sala 302',
      neighborhood: 'Downtown',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M4B 1B3',
      country: 'Canadá'
    },
    rating: 4.5,
    status: 'active',
    totalOrders: 32,
    lastOrder: '2025-05-28',
    paymentTerms: '15 dias',
    createdAt: '2024-02-10'
  },
  {
    id: '3',
    name: 'Elétrica Moderna',
    category: 'Material Elétrico',
    contactName: 'Carlos Oliveira',
    email: 'carlos@eletrica.ca',
    phone: '+1 (416) 555-0300',
    address: {
      street: 'Rua dos Técnicos',
      number: '789',
      neighborhood: 'Industrial',
      city: 'Mississauga',
      state: 'ON',
      zipCode: 'L5R 3G5',
      country: 'Canadá'
    },
    rating: 4.2,
    status: 'active',
    totalOrders: 28,
    lastOrder: '2025-06-05',
    paymentTerms: '30 dias',
    notes: 'Especializado em materiais elétricos de alta qualidade',
    createdAt: '2024-03-05'
  },
  {
    id: '4',
    name: 'Hidráulica Express',
    category: 'Material Hidráulico',
    contactName: 'Ana Pereira',
    email: 'ana@hidraulica.ca',
    phone: '+1 (416) 555-0400',
    address: {
      street: 'Avenida das Águas',
      number: '101',
      neighborhood: 'Comercial',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M3C 1C5',
      country: 'Canadá'
    },
    rating: 3.9,
    status: 'inactive',
    totalOrders: 15,
    lastOrder: '2025-04-20',
    paymentTerms: '15 dias',
    createdAt: '2024-04-12'
  },
  {
    id: '5',
    name: 'Acabamentos Premium',
    category: 'Acabamentos',
    contactName: 'Roberto Almeida',
    email: 'roberto@premium.ca',
    phone: '+1 (416) 555-0500',
    address: {
      street: 'Rua da Qualidade',
      number: '222',
      complement: 'Andar 5',
      neighborhood: 'Luxo',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M5H 1T1',
      country: 'Canadá'
    },
    rating: 4.9,
    status: 'active',
    totalOrders: 22,
    lastOrder: '2025-06-03',
    paymentTerms: '45 dias',
    notes: 'Fornecedor de acabamentos de alto padrão',
    createdAt: '2024-02-28'
  },
  {
    id: '6',
    name: 'Madeiras Sustentáveis',
    category: 'Madeiras',
    contactName: 'Fernanda Lima',
    email: 'fernanda@madeiras.ca',
    phone: '+1 (416) 555-0600',
    address: {
      street: 'Estrada das Árvores',
      number: '333',
      neighborhood: 'Florestal',
      city: 'Vancouver',
      state: 'BC',
      zipCode: 'V6B 5K2',
      country: 'Canadá'
    },
    rating: 4.7,
    status: 'pending',
    totalOrders: 8,
    paymentTerms: '30 dias',
    notes: 'Fornecedor de madeiras certificadas',
    createdAt: '2025-05-10'
  }
];

// Mock data para categorias de fornecedores
const mockSupplierCategories: SupplierCategory[] = [
  { name: 'Materiais de Construção', count: 12, color: '#3B82F6' },
  { name: 'Ferramentas e Equipamentos', count: 8, color: '#10B981' },
  { name: 'Material Elétrico', count: 5, color: '#F97316' },
  { name: 'Material Hidráulico', count: 4, color: '#8B5CF6' },
  { name: 'Acabamentos', count: 7, color: '#EC4899' },
  { name: 'Madeiras', count: 3, color: '#F59E0B' }
];

// Mock data para avaliações de fornecedores
const mockSupplierRatings: SupplierRating[] = [
  { rating: 5, count: 15 },
  { rating: 4, count: 22 },
  { rating: 3, count: 8 },
  { rating: 2, count: 3 },
  { rating: 1, count: 1 }
];

// Mock data para status de fornecedores
const mockSupplierStatus: SupplierStatus[] = [
  { status: 'active', count: 35, color: '#10B981' },
  { status: 'inactive', count: 8, color: '#6B7280' },
  { status: 'pending', count: 6, color: '#F59E0B' }
];

// Componente principal da página de fornecedores
// Main component for the suppliers page
const SuppliersPage = () => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    category: '',
    contactName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    rating: 0,
    status: 'pending',
    totalOrders: 0,
    createdAt: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [supplierCategories, setSupplierCategories] = useState<SupplierCategory[]>([]);
  const [supplierRatings, setSupplierRatings] = useState<SupplierRating[]>([]);
  const [supplierStatus, setSupplierStatus] = useState<SupplierStatus[]>([]);

  // Função para buscar fornecedores
  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      // Em produção, substituir por chamada real à API
      // In production, replace with actual API call
      // const response = await fetch('/api/suppliers');
      // const data = await response.json();
      
      // Simulando delay de API
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuppliers(mockSuppliers);
      setFilteredSuppliers(mockSuppliers);
      setSupplierCategories(mockSupplierCategories);
      setSupplierRatings(mockSupplierRatings);
      setSupplierStatus(mockSupplierStatus);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Efeito para filtrar e ordenar fornecedores
  // Effect to filter and sort suppliers
  useEffect(() => {
    let result = [...suppliers];
    
    // Aplicar filtro de busca
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(supplier => 
        supplier.name.toLowerCase().includes(term) ||
        supplier.contactName.toLowerCase().includes(term) ||
        supplier.email.toLowerCase().includes(term) ||
        supplier.category.toLowerCase().includes(term)
      );
    }
    
    // Aplicar filtro de categoria
    // Apply category filter
    if (filterCategory) {
      result = result.filter(supplier => supplier.category === filterCategory);
    }
    
    // Aplicar filtro de status
    // Apply status filter
    if (filterStatus) {
      result = result.filter(supplier => supplier.status === filterStatus);
    }
    
    // Aplicar filtro de avaliação
    // Apply rating filter
    if (filterRating > 0) {
      result = result.filter(supplier => supplier.rating >= filterRating);
    }
    
    // Aplicar ordenação
    // Apply sorting
    result.sort((a, b) => {
      let valueA: any = a[sortField as keyof Supplier];
      let valueB: any = b[sortField as keyof Supplier];
      
      // Tratamento especial para campos aninhados
      // Special handling for nested fields
      if (sortField === 'address.city') {
        valueA = a.address.city;
        valueB = b.address.city;
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return sortDirection === 'asc' 
        ? (valueA > valueB ? 1 : -1) 
        : (valueA < valueB ? 1 : -1);
    });
    
    setFilteredSuppliers(result);
    setCurrentPage(1);
  }, [suppliers, searchTerm, filterCategory, filterStatus, filterRating, sortField, sortDirection]);

  // Função para abrir modal de criação/edição
  // Function to open creation/editing modal
  const openModal = (supplier?: Supplier) => {
    if (supplier) {
      setFormData({ ...supplier });
      setIsEditing(true);
    } else {
      setFormData({
        name: '',
        category: '',
        contactName: '',
        email: '',
        phone: '',
        address: {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        rating: 0,
        status: 'pending',
        totalOrders: 0,
        createdAt: new Date().toISOString().split('T')[0]
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  // Função para fechar modal
  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Função para lidar com mudanças no formulário
  // Function to handle form changes
  const handleFormChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      
      // Corrigido: Garantindo que estamos lidando com o objeto address
      // Fixed: Ensuring we're dealing with the address object
      if (parent === 'address') {
        setFormData(prev => {
          // Garantir que o endereço existe e tem todos os campos obrigatórios
          // Ensure address exists and has all required fields
          const currentAddress = prev.address || {
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          };
          
          return {
            ...prev,
            address: {
              ...currentAddress,
              [child]: value
            }
          };
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Função para salvar fornecedor
  // Function to save supplier
  const saveSupplier = () => {
    if (isEditing) {
      // Atualizar fornecedor existente
      // Update existing supplier
      const updatedSuppliers = suppliers.map(supplier => 
        supplier.id === formData.id ? { ...formData as Supplier, updatedAt: new Date().toISOString().split('T')[0] } : supplier
      );
      setSuppliers(updatedSuppliers);
    } else {
      // Criar novo fornecedor
      // Create new supplier
      const newSupplier: Supplier = {
        ...(formData as Supplier),
        id: `${suppliers.length + 1}`,
        totalOrders: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    closeModal();
  };

  // Função para excluir fornecedor
  // Function to delete supplier
  const deleteSupplier = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
      setSuppliers(updatedSuppliers);
    }
  };

  // Função para alternar direção de ordenação
  // Function to toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Função para exportar dados
  // Function to export data
  const exportData = () => {
    const csvContent = [
      ['ID', 'Nome', 'Categoria', 'Contato', 'Email', 'Telefone', 'Cidade', 'Estado', 'Avaliação', 'Status', 'Total de Pedidos'].join(','),
      ...filteredSuppliers.map(supplier => [
        supplier.id,
        supplier.name,
        supplier.category,
        supplier.contactName,
        supplier.email,
        supplier.phone,
        supplier.address.city,
        supplier.address.state,
        supplier.rating,
        supplier.status,
        supplier.totalOrders
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'fornecedores.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para obter texto do status
  // Function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  // Função para obter cor do status
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para renderizar estrelas de avaliação
  // Function to render rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FiStar key={i} className="w-4 h-4 text-yellow-500 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FiStar key={i} className="w-4 h-4 text-yellow-500 fill-current opacity-50" />);
      } else {
        stars.push(<FiStar key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Calcular paginação
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  // Função para mudar de página
  // Function to change page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('menu.suppliers')}
          </h1>
          <p className="text-gray-600 mt-1">
            Gerenciamento de fornecedores e contratos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSuppliers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Novo Fornecedor
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Distribuição por Categoria */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Categoria</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={supplierCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {supplierCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} fornecedores`, 'Quantidade']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por Avaliação */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Avaliação</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={supplierRatings}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} fornecedores`, 'Quantidade']} />
                <Bar dataKey="count" name="Fornecedores" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por Status */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={supplierStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ name, percent }) => `${getStatusText(name)}: ${(percent * 100).toFixed(0)}%`}
                >
                  {supplierStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} fornecedores`, 'Quantidade']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar fornecedor..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas as Categorias</option>
              {supplierCategories.map((category, index) => (
                <option key={index} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="md:w-40">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="pending">Pendente</option>
            </select>
          </div>
          <div className="md:w-40">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="0">Todas as Avaliações</option>
              <option value="4">4+ Estrelas</option>
              <option value="3">3+ Estrelas</option>
              <option value="2">2+ Estrelas</option>
              <option value="1">1+ Estrelas</option>
            </select>
          </div>
          <div className="md:w-40">
            <button
              onClick={exportData}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Fornecedores */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
            Nenhum fornecedor encontrado com os filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('name')}
                  >
                    Nome {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('category')}
                  >
                    Categoria {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('contactName')}
                  >
                    Contato {sortField === 'contactName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('address.city')}
                  >
                    Cidade {sortField === 'address.city' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('rating')}
                  >
                    Avaliação {sortField === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('totalOrders')}
                  >
                    Pedidos {sortField === 'totalOrders' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-xs text-gray-500">{supplier.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.contactName}
                      <div className="text-xs text-gray-500">{supplier.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.address.city}, {supplier.address.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderRatingStars(supplier.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                        {getStatusText(supplier.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.totalOrders}
                      {supplier.lastOrder && (
                        <div className="text-xs text-gray-500">
                          Último: {new Date(supplier.lastOrder).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal(supplier)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSupplier(supplier.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Paginação */}
        {filteredSuppliers.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, filteredSuppliers.length)}</span> de <span className="font-medium">{filteredSuppliers.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Anterior</span>
                    &lsaquo;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === number
                          ? 'bg-blue-50 border-blue-500 text-blue-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Próximo</span>
                    &rsaquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? `Editar Fornecedor: ${formData.name}` : 'Novo Fornecedor'}
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Informações Básicas</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Fornecedor *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria *
                    </label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {supplierCategories.map((category, index) => (
                        <option key={index} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Contato *
                    </label>
                    <input
                      type="text"
                      value={formData.contactName || ''}
                      onChange={(e) => handleFormChange('contactName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={formData.status || 'pending'}
                      onChange={(e) => handleFormChange('status', e.target.value as 'active' | 'inactive' | 'pending')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="pending">Pendente</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avaliação
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating || 0}
                      onChange={(e) => handleFormChange('rating', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condições de Pagamento
                    </label>
                    <input
                      type="text"
                      value={formData.paymentTerms || ''}
                      onChange={(e) => handleFormChange('paymentTerms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ex: 30 dias"
                    />
                  </div>
                </div>
                
                {/* Endereço */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Endereço</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua *
                    </label>
                    <input
                      type="text"
                      value={formData.address?.street || ''}
                      onChange={(e) => handleFormChange('address.street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={formData.address?.number || ''}
                        onChange={(e) => handleFormChange('address.number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={formData.address?.complement || ''}
                        onChange={(e) => handleFormChange('address.complement', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={formData.address?.neighborhood || ''}
                      onChange={(e) => handleFormChange('address.neighborhood', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={formData.address?.city || ''}
                        onChange={(e) => handleFormChange('address.city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado/Província *
                      </label>
                      <input
                        type="text"
                        value={formData.address?.state || ''}
                        onChange={(e) => handleFormChange('address.state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CEP/Código Postal *
                      </label>
                      <input
                        type="text"
                        value={formData.address?.zipCode || ''}
                        onChange={(e) => handleFormChange('address.zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        País *
                      </label>
                      <input
                        type="text"
                        value={formData.address?.country || ''}
                        onChange={(e) => handleFormChange('address.country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={saveSupplier}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!formData.name || !formData.category || !formData.contactName || !formData.email || !formData.phone}
              >
                {isEditing ? 'Atualizar Fornecedor' : 'Criar Fornecedor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;
