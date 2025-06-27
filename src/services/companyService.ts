import { apiClient } from './apiClient';
import { SERVICE_ENDPOINTS } from '../config/apiConfig';

// Company/Group interfaces
export interface Company {
  id: string;
  name: string;
  description?: string;
  type: 'CONSTRUCTION' | 'ENGINEERING' | 'CONSULTING' | 'OTHER';
  status: 'ACTIVE' | 'INACTIVE';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo?: {
    phone: string;
    email: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  description?: string;
  type: 'CONSTRUCTION' | 'ENGINEERING' | 'CONSULTING' | 'OTHER';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo?: {
    phone: string;
    email: string;
    website?: string;
  };
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  id: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Demo data for fallback
const DEMO_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Construction Solutions Inc.',
    description: 'Leading construction company specializing in commercial buildings',
    type: 'CONSTRUCTION',
    status: 'ACTIVE',
    address: {
      street: '123 Builder St',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M5V 3A8',
      country: 'Canada'
    },
    contactInfo: {
      phone: '+1-416-555-0123',
      email: 'info@constructionsolutions.ca',
      website: 'https://constructionsolutions.ca'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Engineering Excellence Ltd.',
    description: 'Structural and civil engineering services',
    type: 'ENGINEERING',
    status: 'ACTIVE',
    address: {
      street: '456 Engineer Ave',
      city: 'Vancouver',
      state: 'BC',
      zipCode: 'V6B 1A1',
      country: 'Canada'
    },
    contactInfo: {
      phone: '+1-604-555-0456',
      email: 'contact@engexcellence.ca'
    },
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  },
  {
    id: '3',
    name: 'Project Consulting Group',
    description: 'Construction project management and consulting',
    type: 'CONSULTING',
    status: 'ACTIVE',
    address: {
      street: '789 Consultant Blvd',
      city: 'Calgary',
      state: 'AB',
      zipCode: 'T2P 1J9',
      country: 'Canada'
    },
    contactInfo: {
      phone: '+1-403-555-0789',
      email: 'hello@projectconsulting.ca',
      website: 'https://projectconsulting.ca'
    },
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z'
  }
];

class CompanyService {
  private baseUrl: string;
  private demoData: Company[];

  constructor() {
    this.baseUrl = SERVICE_ENDPOINTS.company;
    this.demoData = [...DEMO_COMPANIES];
  }

  /**
   * Get all companies
   */
  async getCompanies(): Promise<Company[]> {
    try {
      console.log('🏢 Fetching companies from API:', this.baseUrl);
      const response = await apiClient.get<Company[]>(`${this.baseUrl}`);
      console.log('✅ Companies fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, using demo data:', error.message);
      return this.demoData;
    }
  }

  /**
   * Get company by ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    try {
      console.log('🏢 Fetching company by ID:', id);
      const response = await apiClient.get<Company>(`${this.baseUrl}/${id}`);
      console.log('✅ Company fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, using demo data:', error.message);
      const company = this.demoData.find(c => c.id === id);
      return company || null;
    }
  }

  /**
   * Create new company
   */
  async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    try {
      console.log('🏢 Creating company via API:', companyData);
      const response = await apiClient.post<Company>(`${this.baseUrl}`, companyData);
      console.log('✅ Company created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, creating in demo data:', error.message);
      
      // Create in demo data
      const newCompany: Company = {
        id: Date.now().toString(),
        ...companyData,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.demoData.push(newCompany);
      console.log('✅ Company created in demo data:', newCompany);
      return newCompany;
    }
  }

  /**
   * Update company
   */
  async updateCompany(companyData: UpdateCompanyRequest): Promise<Company> {
    try {
      console.log('🏢 Updating company via API:', companyData);
      const response = await apiClient.put<Company>(`${this.baseUrl}/${companyData.id}`, companyData);
      console.log('✅ Company updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, updating in demo data:', error.message);
      
      // Update in demo data
      const index = this.demoData.findIndex(c => c.id === companyData.id);
      if (index !== -1) {
        this.demoData[index] = {
          ...this.demoData[index],
          ...companyData,
          updatedAt: new Date().toISOString()
        };
        console.log('✅ Company updated in demo data:', this.demoData[index]);
        return this.demoData[index];
      }
      throw new Error('Company not found');
    }
  }

  /**
   * Delete company
   */
  async deleteCompany(id: string): Promise<boolean> {
    try {
      console.log('🏢 Deleting company via API:', id);
      await apiClient.delete(`${this.baseUrl}/${id}`);
      console.log('✅ Company deleted successfully');
      return true;
    } catch (error: any) {
      console.warn('❌ API call failed, deleting from demo data:', error.message);
      
      // Delete from demo data
      const index = this.demoData.findIndex(c => c.id === id);
      if (index !== -1) {
        this.demoData.splice(index, 1);
        console.log('✅ Company deleted from demo data');
        return true;
      }
      return false;
    }
  }

  /**
   * Get companies by type
   */
  async getCompaniesByType(type: Company['type']): Promise<Company[]> {
    const companies = await this.getCompanies();
    return companies.filter(company => company.type === type);
  }

  /**
   * Get active companies
   */
  async getActiveCompanies(): Promise<Company[]> {
    const companies = await this.getCompanies();
    return companies.filter(company => company.status === 'ACTIVE');
  }
}

export const companyService = new CompanyService();
export default companyService;

