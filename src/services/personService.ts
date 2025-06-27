import { apiClient } from './apiClient';
import { SERVICE_ENDPOINTS } from '../config/apiConfig';

// Person interfaces
export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  nationality?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  documents?: {
    type: 'SSN' | 'PASSPORT' | 'DRIVER_LICENSE' | 'OTHER';
    number: string;
    issueDate?: string;
    expiryDate?: string;
  }[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  nationality?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  documents?: {
    type: 'SSN' | 'PASSPORT' | 'DRIVER_LICENSE' | 'OTHER';
    number: string;
    issueDate?: string;
    expiryDate?: string;
  }[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
}

export interface UpdatePersonRequest extends Partial<CreatePersonRequest> {
  id: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Demo data for fallback
const DEMO_PEOPLE: Person[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-416-555-0101',
    dateOfBirth: '1985-03-15',
    gender: 'MALE',
    nationality: 'Canadian',
    address: {
      street: '123 Main St',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M5V 1A1',
      country: 'Canada'
    },
    documents: [
      {
        type: 'SSN',
        number: '123-45-6789',
        issueDate: '2005-01-01'
      }
    ],
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1-416-555-0102',
      email: 'jane.smith@email.com'
    },
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-604-555-0201',
    dateOfBirth: '1990-07-22',
    gender: 'FEMALE',
    nationality: 'Canadian',
    address: {
      street: '456 Oak Ave',
      city: 'Vancouver',
      state: 'BC',
      zipCode: 'V6B 2B2',
      country: 'Canada'
    },
    status: 'ACTIVE',
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  },
  {
    id: '3',
    firstName: 'David',
    lastName: 'Johnson',
    email: 'david.johnson@email.com',
    phone: '+1-403-555-0301',
    dateOfBirth: '1988-11-08',
    gender: 'MALE',
    nationality: 'Canadian',
    address: {
      street: '789 Pine Rd',
      city: 'Calgary',
      state: 'AB',
      zipCode: 'T2P 3C3',
      country: 'Canada'
    },
    status: 'ACTIVE',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z'
  }
];

class PersonService {
  private baseUrl: string;
  private demoData: Person[];

  constructor() {
    this.baseUrl = SERVICE_ENDPOINTS.people;
    this.demoData = [...DEMO_PEOPLE];
  }

  /**
   * Get all people
   */
  async getPeople(): Promise<Person[]> {
    try {
      console.log('👥 Fetching people from API:', this.baseUrl);
      const response = await apiClient.get<Person[]>(`${this.baseUrl}`);
      console.log('✅ People fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, using demo data:', error.message);
      return this.demoData;
    }
  }

  /**
   * Get person by ID
   */
  async getPersonById(id: string): Promise<Person | null> {
    try {
      console.log('👥 Fetching person by ID:', id);
      const response = await apiClient.get<Person>(`${this.baseUrl}/${id}`);
      console.log('✅ Person fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, using demo data:', error.message);
      const person = this.demoData.find(p => p.id === id);
      return person || null;
    }
  }

  /**
   * Create new person
   */
  async createPerson(personData: CreatePersonRequest): Promise<Person> {
    try {
      console.log('👥 Creating person via API:', personData);
      const response = await apiClient.post<Person>(`${this.baseUrl}`, personData);
      console.log('✅ Person created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, creating in demo data:', error.message);
      
      // Create in demo data
      const newPerson: Person = {
        id: Date.now().toString(),
        ...personData,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.demoData.push(newPerson);
      console.log('✅ Person created in demo data:', newPerson);
      return newPerson;
    }
  }

  /**
   * Update person
   */
  async updatePerson(personData: UpdatePersonRequest): Promise<Person> {
    try {
      console.log('👥 Updating person via API:', personData);
      const response = await apiClient.put<Person>(`${this.baseUrl}/${personData.id}`, personData);
      console.log('✅ Person updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('❌ API call failed, updating in demo data:', error.message);
      
      // Update in demo data
      const index = this.demoData.findIndex(p => p.id === personData.id);
      if (index !== -1) {
        this.demoData[index] = {
          ...this.demoData[index],
          ...personData,
          updatedAt: new Date().toISOString()
        };
        console.log('✅ Person updated in demo data:', this.demoData[index]);
        return this.demoData[index];
      }
      throw new Error('Person not found');
    }
  }

  /**
   * Delete person
   */
  async deletePerson(id: string): Promise<boolean> {
    try {
      console.log('👥 Deleting person via API:', id);
      await apiClient.delete(`${this.baseUrl}/${id}`);
      console.log('✅ Person deleted successfully');
      return true;
    } catch (error: any) {
      console.warn('❌ API call failed, deleting from demo data:', error.message);
      
      // Delete from demo data
      const index = this.demoData.findIndex(p => p.id === id);
      if (index !== -1) {
        this.demoData.splice(index, 1);
        console.log('✅ Person deleted from demo data');
        return true;
      }
      return false;
    }
  }

  /**
   * Search people by name or email
   */
  async searchPeople(query: string): Promise<Person[]> {
    const people = await this.getPeople();
    const lowercaseQuery = query.toLowerCase();
    
    return people.filter(person => 
      person.firstName.toLowerCase().includes(lowercaseQuery) ||
      person.lastName.toLowerCase().includes(lowercaseQuery) ||
      person.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get active people
   */
  async getActivePeople(): Promise<Person[]> {
    const people = await this.getPeople();
    return people.filter(person => person.status === 'ACTIVE');
  }
}

export const personService = new PersonService();
export default personService;

