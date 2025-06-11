// Mock data para demonstração do sistema
export const mockFinancialData = {
  activeProjects: {
    value: 15,
    change: 12,
    trend: 'up'
  },
  totalRevenue: {
    value: 2450000,
    change: 8,
    trend: 'up'
  },
  cashFlow: {
    value: 485000,
    change: 15,
    trend: 'up'
  },
  pendingPayments: {
    value: 125000,
    change: -5,
    trend: 'down'
  }
}

export const mockCompanyData = {
  name: 'Habermatt Construction',
  cnpj: '12.345.678/0001-90',
  address: '123 Construction Ave, Toronto, ON',
  phone: '+1 (416) 555-0123',
  email: 'contact@habermatt.ca',
  employees: 45,
  activeProjects: 12,
  monthlyRevenue: 125000
}

export const mockEmployeesData = [
  {
    id: 1,
    name: 'João Silva',
    position: 'Engenheiro Civil',
    salary: 8500,
    department: 'Engenharia',
    startDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Maria Santos',
    position: 'Arquiteta',
    salary: 7800,
    department: 'Projetos',
    startDate: '2023-03-20'
  },
  {
    id: 3,
    name: 'Carlos Oliveira',
    position: 'Mestre de Obras',
    salary: 6200,
    department: 'Construção',
    startDate: '2022-11-10'
  }
]

export const mockProjectsData = [
  {
    id: 1,
    name: 'Residencial Maple Heights',
    status: 'active',
    progress: 75,
    budget: 850000,
    spent: 637500,
    startDate: '2024-01-15',
    endDate: '2024-08-30'
  },
  {
    id: 2,
    name: 'Centro Comercial Downtown',
    status: 'negotiation',
    progress: 0,
    budget: 1200000,
    spent: 0,
    startDate: '2024-06-01',
    endDate: '2025-02-28'
  },
  {
    id: 3,
    name: 'Reforma Hospital Central',
    status: 'paused',
    progress: 45,
    budget: 650000,
    spent: 292500,
    startDate: '2024-02-01',
    endDate: '2024-09-15'
  }
]

export const mockSuppliersData = [
  {
    id: 1,
    name: 'Construtora ABC Ltda',
    category: 'Materiais de Construção',
    contact: 'vendas@abc.com',
    phone: '+1 (416) 555-0100',
    rating: 4.8,
    totalOrders: 45
  },
  {
    id: 2,
    name: 'Ferragens Toronto',
    category: 'Ferramentas e Equipamentos',
    contact: 'atendimento@ferragens.ca',
    phone: '+1 (416) 555-0200',
    rating: 4.5,
    totalOrders: 32
  }
]

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'CAD'
  }).format(value)
}

export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value}%`
}

