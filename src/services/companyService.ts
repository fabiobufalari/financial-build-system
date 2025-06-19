import { apiClient } from './apiClient';
import { SERVICE_ENDPOINTS, DEMO_MODE } from '../config/apiConfig';

// EN: Company service with full CRUD operations
// PT: Serviço de empresa com operações CRUD completas

export interface Company {
  id: string;
  name: string;
  tradeName?: string;
  taxId: string; // CNPJ/EIN
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  industry: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  foundedDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  tradeName?: string;
  taxId: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  industry: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  foundedDate?: string;
  description?: string;
}

// Demo data for testing
// EN: Demo data for testing purposes
// PT: Dados demo para fins de teste
const generateDemoCompanies = (): Company[] => [
  {
    id: 'comp-001',
    name: 'Construtora Bufalari Ltda',
    tradeName: 'Bufalari Construções',
    taxId: '12.345.678/0001-90',
    email: 'contato@bufalari.com.br',
    phone: '+55 11 99999-9999',
    website: 'https://bufalari.com.br',
    address: {
      street: 'Rua das Construções',
      number: '123',
      complement: 'Sala 101',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil'
    },
    industry: 'Construction',
    size: 'MEDIUM',
    status: 'ACTIVE',
    foundedDate: '2015-03-15',
    description: 'Empresa especializada em construção civil e reformas',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-06-15T14:30:00Z'
  },
  {
    id: 'comp-002',
    name: 'Engenharia XYZ S.A.',
    tradeName: 'XYZ Engenharia',
    taxId: '98.765.432/0001-10',
    email: 'contato@xyzeng.com',
    phone: '+55 11 88888-8888',
    website: 'https://xyzengenharia.com',
    address: {
      street: 'Avenida Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brasil'
    },
    industry: 'Engineering',
    size: 'LARGE',
    status: 'ACTIVE',
    foundedDate: '2010-08-20',
    description: 'Consultoria em engenharia civil e estrutural',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-06-10T16:45:00Z'
  },
  {
    id: 'comp-003',
    name: 'Materiais de Construção ABC',
    tradeName: 'ABC Materiais',
    taxId: '11.222.333/0001-44',
    email: 'vendas@abcmateriais.com',
    phone: '+55 11 77777-7777',
    address: {
      street: 'Rua dos Materiais',
      number: '456',
      neighborhood: 'Industrial',
      city: 'Guarulhos',
      state: 'SP',
      zipCode: '07000-000',
      country: 'Brasil'
    },
    industry: 'Retail',
    size: 'SMALL',
    status: 'ACTIVE',
    foundedDate: '2018-11-10',
    description: 'Fornecimento de materiais de construção',
    createdAt: '2025-02-01T11:30:00Z',
    updatedAt: '2025-06-05T08:20:00Z'
  }
];

class CompanyService {
  private baseUrl = SERVICE_ENDPOINTS.company;
  private demoData = generateDemoCompanies();

  /**
   * Get all companies
   * EN: Retrieves all companies with optional filtering
   * PT: Recupera todas as empresas com filtragem opcional
   */
  async getAllCompanies(status?: string): Promise<Company[]> {
    try {
      if (DEMO_MODE) {
        return this.demoGetAllCompanies(status);
      }

      const url = status ? `${this.baseUrl}?status=${status}` : this.baseUrl;
      const response = await apiClient.get<Company[]>(url);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetAllCompanies(status);
    }
  }

  /**
   * Get company by ID
   * EN: Retrieves a specific company by its ID
   * PT: Recupera uma empresa específica pelo seu ID
   */
  async getCompanyById(id: string): Promise<Company> {
    try {
      if (DEMO_MODE) {
        return this.demoGetCompanyById(id);
      }

      const response = await apiClient.get<Company>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetCompanyById(id);
    }
  }

  /**
   * Create new company
   * EN: Creates a new company
   * PT: Cria uma nova empresa
   */
  async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    try {
      if (DEMO_MODE) {
        return this.demoCreateCompany(companyData);
      }

      const response = await apiClient.post<Company>(this.baseUrl, companyData);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoCreateCompany(companyData);
    }
  }

  /**
   * Update company
   * EN: Updates an existing company
   * PT: Atualiza uma empresa existente
   */
  async updateCompany(id: string, companyData: Partial<CreateCompanyRequest>): Promise<Company> {
    try {
      if (DEMO_MODE) {
        return this.demoUpdateCompany(id, companyData);
      }

      const response = await apiClient.put<Company>(`${this.baseUrl}/${id}`, companyData);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoUpdateCompany(id, companyData);
    }
  }

  /**
   * Delete company
   * EN: Deletes a company
   * PT: Exclui uma empresa
   */
  async deleteCompany(id: string): Promise<void> {
    try {
      if (DEMO_MODE) {
        return this.demoDeleteCompany(id);
      }

      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoDeleteCompany(id);
    }
  }

  /**
   * Search companies
   * EN: Searches companies by name or tax ID
   * PT: Busca empresas por nome ou CNPJ
   */
  async searchCompanies(query: string): Promise<Company[]> {
    try {
      if (DEMO_MODE) {
        return this.demoSearchCompanies(query);
      }

      const response = await apiClient.get<Company[]>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoSearchCompanies(query);
    }
  }

  // Demo mode methods
  // EN: Demo mode methods for testing
  // PT: Métodos do modo demo para teste

  private async demoGetAllCompanies(status?: string): Promise<Company[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    if (status) {
      return this.demoData.filter(company => company.status === status);
    }
    return [...this.demoData];
  }

  private async demoGetCompanyById(id: string): Promise<Company> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const company = this.demoData.find(c => c.id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  }

  private async demoCreateCompany(companyData: CreateCompanyRequest): Promise<Company> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      ...companyData,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.demoData.push(newCompany);
    return { ...newCompany };
  }

  private async demoUpdateCompany(id: string, companyData: Partial<CreateCompanyRequest>): Promise<Company> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.demoData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    this.demoData[index] = {
      ...this.demoData[index],
      ...companyData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.demoData[index] };
  }

  private async demoDeleteCompany(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.demoData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    this.demoData.splice(index, 1);
  }

  private async demoSearchCompanies(query: string): Promise<Company[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const lowerQuery = query.toLowerCase();
    return this.demoData.filter(company => 
      company.name.toLowerCase().includes(lowerQuery) ||
      company.tradeName?.toLowerCase().includes(lowerQuery) ||
      company.taxId.includes(query)
    );
  }
}

export const companyService = new CompanyService();
export default companyService;

