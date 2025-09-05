// Clean data structures for production use
// EN: Clean data structures without mock data for production environment
// PT: Estruturas de dados limpas sem dados simulados para ambiente de produção

export const mockFinancialData = {
  activeProjects: {
    value: 0,
    change: 0,
    trend: 'neutral'
  },
  totalRevenue: {
    value: 0,
    change: 0,
    trend: 'neutral'
  },
  cashFlow: {
    value: 0,
    change: 0,
    trend: 'neutral'
  },
  pendingPayments: {
    value: 0,
    change: 0,
    trend: 'neutral'
  }
}

export const mockCompanyData = {
  name: '',
  cnpj: '',
  address: '',
  phone: '',
  email: '',
  employees: 0,
  activeProjects: 0,
  monthlyRevenue: 0
}

export const mockEmployeesData: any[] = []

export const mockProjectsData: any[] = []

export const mockSuppliersData: any[] = []

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(value)
}

export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value}%`
}
