import { apiClient } from './apiClient';
import { SERVICE_ENDPOINTS } from '../config/apiConfig';
import { Company } from './companyService';
import { Person } from './personService';

// Employee interfaces
export interface Employee {
  id: string;
  employeeId: string; // Internal employee ID
  personId: string; // Reference to Person
  companyId: string; // Reference to Company
  person: Person; // Populated person data
  company: Company; // Populated company data
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  workLocation?: {
    type: 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FIELD';
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  benefits?: string[];
  skills?: string[];
  certifications?: {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }[];
  manager?: {
    employeeId: string;
    name: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  personId: string;
  companyId: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  workLocation?: {
    type: 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FIELD';
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  benefits?: string[];
  skills?: string[];
  certifications?: {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }[];
  managerId?: string;
  notes?: string;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

// Demo data for fallback
const DEMO_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    personId: '1',
    companyId: '1',
    person: {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@constructionsolutions.ca',
      phone: '+1-416-555-0101',
      dateOfBirth: '1985-03-15',
      gender: 'MALE',
      nationality: 'Canadian',
      status: 'ACTIVE',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    company: {
      id: '1',
      name: 'Construction Solutions Inc.',
      description: 'Leading construction company',
      type: 'CONSTRUCTION',
      status: 'ACTIVE',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    position: 'Senior Project Manager',
    department: 'Construction',
    salary: 85000,
    hireDate: '2022-03-15',
    status: 'ACTIVE',
    workLocation: {
      type: 'HYBRID',
      address: '123 Builder St, Toronto, ON',
      coordinates: {
        latitude: 43.6532,
        longitude: -79.3832
      }
    },
    benefits: ['Health Insurance', 'Dental', 'Vision', '401k'],
    skills: ['Project Management', 'Construction', 'Leadership', 'AutoCAD'],
    certifications: [
      {
        name: 'PMP Certification',
        issuer: 'PMI',
        issueDate: '2021-06-15',
        expiryDate: '2024-06-15'
      }
    ],
    createdAt: '2022-03-15T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    personId: '2',
    companyId: '2',
    person: {
      id: '2',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@engexcellence.ca',
      phone: '+1-604-555-0201',
      dateOfBirth: '1990-07-22',
      gender: 'FEMALE',
      nationality: 'Canadian',
      status: 'ACTIVE',
      createdAt: '2024-02-01T14:30:00Z',
      updatedAt: '2024-02-01T14:30:00Z'
    },
    company: {
      id: '2',
      name: 'Engineering Excellence Ltd.',
      description: 'Structural and civil engineering services',
      type: 'ENGINEERING',
      status: 'ACTIVE',
      createdAt: '2024-02-01T14:30:00Z',
      updatedAt: '2024-02-01T14:30:00Z'
    },
    position: 'Structural Engineer',
    department: 'Engineering',
    salary: 75000,
    hireDate: '2023-01-10',
    status: 'ACTIVE',
    workLocation: {
      type: 'OFFICE',
      address: '456 Engineer Ave, Vancouver, BC'
    },
    benefits: ['Health Insurance', 'Dental', 'Professional Development'],
    skills: ['Structural Analysis', 'AutoCAD', 'Revit', 'ETABS'],
    createdAt: '2023-01-10T08:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    personId: '3',
    companyId: '3',
    person: {
      id: '3',
      firstName: 'David',
      lastName: 'Johnson',
      email: 'david.johnson@projectconsulting.ca',
      phone: '+1-403-555-0301',
      dateOfBirth: '1988-11-08',
      gender: 'MALE',
      nationality: 'Canadian',
      status: 'ACTIVE',
      createdAt: '2024-03-10T09:15:00Z',
      updatedAt: '2024-03-10T09:15:00Z'
    },
    company: {
      id: '3',
      name: 'Project Consulting Group',
      description: 'Construction project management and consulting',
      type: 'CONSULTING',
      status: 'ACTIVE',
      createdAt: '2024-03-10T09:15:00Z',
      updatedAt: '2024-03-10T09:15:00Z'
    },
    position: 'Project Consultant',
    department: 'Consulting',
    salary: 70000,
    hireDate: '2023-06-01',
    status: 'ACTIVE',
    workLocation: {
      type: 'FIELD',
      address: 'Various project sites'
    },
    benefits: ['Health Insurance', 'Travel Allowance'],
    skills: ['Project Management', 'Consulting', 'Risk Assessment'],
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2024-03-10T09:15:00Z'
  }
];

class EmployeeService {
  private baseUrl: string;
  private demoData: Employee[];

  constructor() {
    this.baseUrl = SERVICE_ENDPOINTS.employees;
    this.demoData = [...DEMO_EMPLOYEES];
  }

  /**
   * Get all employees
   */
  async getEmployees(): Promise<Employee[]> {
    try {
      console.log('👨‍💼 Fetching employees from API:', this.baseUrl);
      const response = await apiClient.get<Employee[]>(`${this.baseUrl}`);
      console.log('✅ Employees fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, using demo data:', error.message);
      return this.demoData;
    }
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      console.log('👨‍💼 Fetching employee by ID:', id);
      const response = await apiClient.get<Employee>(`${this.baseUrl}/${id}`);
      console.log('✅ Employee fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, using demo data:', error.message);
      const employee = this.demoData.find(e => e.id === id);
      return employee || null;
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    try {
      console.log('👨‍💼 Creating employee via API:', employeeData);
      const response = await apiClient.post<Employee>(`${this.baseUrl}`, employeeData);
      console.log('✅ Employee created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, creating in demo data:', error.message);
      
      // Create in demo data
      const newEmployee: Employee = {
        id: Date.now().toString(),
        employeeId: `EMP${String(this.demoData.length + 1).padStart(3, '0')}`,
        ...employeeData,
        person: {
          id: employeeData.personId,
          firstName: 'Demo',
          lastName: 'Person',
          email: 'demo@example.com',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        company: {
          id: employeeData.companyId,
          name: 'Demo Company',
          type: 'CONSTRUCTION',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.demoData.push(newEmployee);
      console.log('✅ Employee created in demo data:', newEmployee);
      return newEmployee;
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(employeeData: UpdateEmployeeRequest): Promise<Employee> {
    try {
      console.log('👨‍💼 Updating employee via API:', employeeData);
      const response = await apiClient.put<Employee>(`${this.baseUrl}/${employeeData.id}`, employeeData);
      console.log('✅ Employee updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, updating in demo data:', error.message);
      
      // Update in demo data
      const index = this.demoData.findIndex(e => e.id === employeeData.id);
      if (index !== -1) {
        this.demoData[index] = {
          ...this.demoData[index],
          ...employeeData,
          updatedAt: new Date().toISOString()
        };
        console.log('✅ Employee updated in demo data:', this.demoData[index]);
        return this.demoData[index];
      }
      throw new Error('Employee not found');
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      console.log('👨‍💼 Deleting employee via API:', id);
      await apiClient.delete(`${this.baseUrl}/${id}`);
      console.log('✅ Employee deleted successfully');
      return true;
    } catch (error: any) {
      console.warn('❌ API call failed, deleting from demo data:', error.message);
      
      // Delete from demo data
      const index = this.demoData.findIndex(e => e.id === id);
      if (index !== -1) {
        this.demoData.splice(index, 1);
        console.log('✅ Employee deleted from demo data');
        return true;
      }
      return false;
    }
  }

  /**
   * Search employees by name, position, or department
   */
  async searchEmployees(query: string): Promise<Employee[]> {
    const employees = await this.getEmployees();
    const lowercaseQuery = query.toLowerCase();
    
    return employees.filter(employee => 
      employee.person.firstName.toLowerCase().includes(lowercaseQuery) ||
      employee.person.lastName.toLowerCase().includes(lowercaseQuery) ||
      employee.position.toLowerCase().includes(lowercaseQuery) ||
      employee.department.toLowerCase().includes(lowercaseQuery) ||
      employee.employeeId.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get employees by company
   */
  async getEmployeesByCompany(companyId: string): Promise<Employee[]> {
    const employees = await this.getEmployees();
    return employees.filter(employee => employee.companyId === companyId);
  }

  /**
   * Get employees by department
   */
  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    const employees = await this.getEmployees();
    return employees.filter(employee => employee.department === department);
  }

  /**
   * Get active employees
   */
  async getActiveEmployees(): Promise<Employee[]> {
    const employees = await this.getEmployees();
    return employees.filter(employee => employee.status === 'ACTIVE');
  }

  /**
   * Get employees with location data for maps
   */
  async getEmployeesWithLocation(): Promise<Employee[]> {
    const employees = await this.getEmployees();
    return employees.filter(employee => 
      employee.workLocation?.coordinates?.latitude && 
      employee.workLocation?.coordinates?.longitude
    );
  }
}

export const employeeService = new EmployeeService();
export default employeeService;

