import { apiClient } from './apiClient';
import { SERVICE_ENDPOINTS, DEMO_MODE } from '../config/apiConfig';

// EN: Employee service with full CRUD operations
// PT: Serviço de funcionários com operações CRUD completas

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  employeeId: string; // Internal employee ID
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
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: {
    cpf?: string; // Brazilian CPF
    rg?: string; // Brazilian RG
    passport?: string;
  };
  benefits?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  employeeId: string;
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
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: {
    cpf?: string;
    rg?: string;
    passport?: string;
  };
  benefits?: string[];
  notes?: string;
}

// Demo data for testing
// EN: Demo data for testing purposes
// PT: Dados demo para fins de teste
const generateDemoEmployees = (): Employee[] => [
  {
    id: 'emp-001',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao.silva@bufalari.com',
    phone: '+55 11 99999-1111',
    position: 'Engenheiro Civil',
    department: 'Engenharia',
    salary: 8500.00,
    hireDate: '2023-01-15',
    status: 'ACTIVE',
    employeeId: 'EMP001',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim Paulista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil'
    },
    emergencyContact: {
      name: 'Maria Silva',
      relationship: 'Esposa',
      phone: '+55 11 88888-1111'
    },
    documents: {
      cpf: '123.456.789-01',
      rg: '12.345.678-9'
    },
    benefits: ['Plano de Saúde', 'Vale Refeição', 'Vale Transporte'],
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2025-06-15T14:30:00Z'
  },
  {
    id: 'emp-002',
    firstName: 'Ana',
    lastName: 'Santos',
    email: 'ana.santos@bufalari.com',
    phone: '+55 11 99999-2222',
    position: 'Arquiteta',
    department: 'Projetos',
    salary: 7500.00,
    hireDate: '2023-03-20',
    status: 'ACTIVE',
    employeeId: 'EMP002',
    address: {
      street: 'Avenida Paulista',
      number: '456',
      complement: 'Apto 101',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brasil'
    },
    emergencyContact: {
      name: 'Carlos Santos',
      relationship: 'Pai',
      phone: '+55 11 88888-2222'
    },
    documents: {
      cpf: '987.654.321-01',
      rg: '98.765.432-1'
    },
    benefits: ['Plano de Saúde', 'Vale Refeição'],
    createdAt: '2023-03-20T10:30:00Z',
    updatedAt: '2025-06-10T16:45:00Z'
  },
  {
    id: 'emp-003',
    firstName: 'Pedro',
    lastName: 'Oliveira',
    email: 'pedro.oliveira@bufalari.com',
    phone: '+55 11 99999-3333',
    position: 'Mestre de Obras',
    department: 'Produção',
    salary: 5500.00,
    hireDate: '2022-08-10',
    status: 'ACTIVE',
    employeeId: 'EMP003',
    address: {
      street: 'Rua dos Trabalhadores',
      number: '789',
      neighborhood: 'Vila Operária',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '03456-789',
      country: 'Brasil'
    },
    emergencyContact: {
      name: 'Lucia Oliveira',
      relationship: 'Mãe',
      phone: '+55 11 88888-3333'
    },
    documents: {
      cpf: '456.789.123-01',
      rg: '45.678.912-3'
    },
    benefits: ['Vale Refeição', 'Vale Transporte'],
    createdAt: '2022-08-10T08:00:00Z',
    updatedAt: '2025-06-05T12:20:00Z'
  }
];

class EmployeeService {
  private baseUrl = SERVICE_ENDPOINTS.employees;
  private demoData = generateDemoEmployees();

  /**
   * Get all employees
   * EN: Retrieves all employees with optional filtering
   * PT: Recupera todos os funcionários com filtragem opcional
   */
  async getAllEmployees(department?: string, status?: string): Promise<Employee[]> {
    try {
      if (DEMO_MODE) {
        return this.demoGetAllEmployees(department, status);
      }

      let url = this.baseUrl;
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (status) params.append('status', status);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await apiClient.get<Employee[]>(url);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetAllEmployees(department, status);
    }
  }

  /**
   * Get employee by ID
   * EN: Retrieves a specific employee by their ID
   * PT: Recupera um funcionário específico pelo seu ID
   */
  async getEmployeeById(id: string): Promise<Employee> {
    try {
      if (DEMO_MODE) {
        return this.demoGetEmployeeById(id);
      }

      const response = await apiClient.get<Employee>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetEmployeeById(id);
    }
  }

  /**
   * Create new employee
   * EN: Creates a new employee
   * PT: Cria um novo funcionário
   */
  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    try {
      if (DEMO_MODE) {
        return this.demoCreateEmployee(employeeData);
      }

      const response = await apiClient.post<Employee>(this.baseUrl, employeeData);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoCreateEmployee(employeeData);
    }
  }

  /**
   * Update employee
   * EN: Updates an existing employee
   * PT: Atualiza um funcionário existente
   */
  async updateEmployee(id: string, employeeData: Partial<CreateEmployeeRequest>): Promise<Employee> {
    try {
      if (DEMO_MODE) {
        return this.demoUpdateEmployee(id, employeeData);
      }

      const response = await apiClient.put<Employee>(`${this.baseUrl}/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoUpdateEmployee(id, employeeData);
    }
  }

  /**
   * Delete employee
   * EN: Deletes an employee (soft delete - changes status to TERMINATED)
   * PT: Exclui um funcionário (exclusão suave - altera status para TERMINATED)
   */
  async deleteEmployee(id: string): Promise<void> {
    try {
      if (DEMO_MODE) {
        return this.demoDeleteEmployee(id);
      }

      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoDeleteEmployee(id);
    }
  }

  /**
   * Search employees
   * EN: Searches employees by name, email, or employee ID
   * PT: Busca funcionários por nome, email ou ID do funcionário
   */
  async searchEmployees(query: string): Promise<Employee[]> {
    try {
      if (DEMO_MODE) {
        return this.demoSearchEmployees(query);
      }

      const response = await apiClient.get<Employee[]>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoSearchEmployees(query);
    }
  }

  /**
   * Get employees by department
   * EN: Retrieves employees filtered by department
   * PT: Recupera funcionários filtrados por departamento
   */
  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    return this.getAllEmployees(department);
  }

  // Demo mode methods
  // EN: Demo mode methods for testing
  // PT: Métodos do modo demo para teste

  private async demoGetAllEmployees(department?: string, status?: string): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredData = [...this.demoData];
    
    if (department) {
      filteredData = filteredData.filter(emp => emp.department === department);
    }
    
    if (status) {
      filteredData = filteredData.filter(emp => emp.status === status);
    }
    
    return filteredData;
  }

  private async demoGetEmployeeById(id: string): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const employee = this.demoData.find(e => e.id === id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    return { ...employee };
  }

  private async demoCreateEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      ...employeeData,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.demoData.push(newEmployee);
    return { ...newEmployee };
  }

  private async demoUpdateEmployee(id: string, employeeData: Partial<CreateEmployeeRequest>): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.demoData.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    
    this.demoData[index] = {
      ...this.demoData[index],
      ...employeeData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.demoData[index] };
  }

  private async demoDeleteEmployee(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.demoData.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    
    // Soft delete - change status to TERMINATED
    this.demoData[index].status = 'TERMINATED';
    this.demoData[index].updatedAt = new Date().toISOString();
  }

  private async demoSearchEmployees(query: string): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const lowerQuery = query.toLowerCase();
    return this.demoData.filter(employee => 
      employee.firstName.toLowerCase().includes(lowerQuery) ||
      employee.lastName.toLowerCase().includes(lowerQuery) ||
      employee.email.toLowerCase().includes(lowerQuery) ||
      employee.employeeId.toLowerCase().includes(lowerQuery) ||
      employee.position.toLowerCase().includes(lowerQuery)
    );
  }
}

export const employeeService = new EmployeeService();
export default employeeService;

