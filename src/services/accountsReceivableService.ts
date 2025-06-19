import { apiClient } from './apiClient';
import { SERVICE_ENDPOINTS, DEMO_MODE } from '../config/apiConfig';

// EN: Accounts Receivable service with full CRUD operations
// PT: Serviço de contas a receber com operações CRUD completas

export interface ReceivableAccount {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'RECEIVED' | 'OVERDUE' | 'CANCELLED';
  customerId: string;
  customerName: string;
  category: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  receivedAt?: string;
  receivedAmount?: number;
}

export interface ReceiptTransaction {
  id: string;
  receivableId: string;
  amount: number;
  receiptDate: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateReceivableRequest {
  description: string;
  amount: number;
  dueDate: string;
  customerId: string;
  category: string;
  notes?: string;
}

export interface ReceiptRequest {
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

// Demo data for testing
// EN: Demo data for testing purposes
// PT: Dados demo para fins de teste
const generateDemoReceivables = (): ReceivableAccount[] => [
  {
    id: 'rec-001',
    description: 'Projeto Residencial - Casa 1',
    amount: 15000.00,
    dueDate: '2025-07-10',
    status: 'PENDING',
    customerId: 'cust-001',
    customerName: 'João Silva',
    category: 'Construction',
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z'
  },
  {
    id: 'rec-002',
    description: 'Consultoria Técnica',
    amount: 5500.00,
    dueDate: '2025-06-25',
    status: 'OVERDUE',
    customerId: 'cust-002',
    customerName: 'Empresa ABC Ltda',
    category: 'Consulting',
    createdAt: '2025-05-10T14:30:00Z',
    updatedAt: '2025-06-15T09:00:00Z'
  },
  {
    id: 'rec-003',
    description: 'Reforma Comercial',
    amount: 8200.00,
    dueDate: '2025-07-05',
    status: 'RECEIVED',
    customerId: 'cust-003',
    customerName: 'Loja XYZ',
    category: 'Renovation',
    receivedAt: '2025-06-12T16:45:00Z',
    receivedAmount: 8200.00,
    createdAt: '2025-05-20T11:15:00Z',
    updatedAt: '2025-06-12T16:45:00Z'
  },
  {
    id: 'rec-004',
    description: 'Projeto Paisagismo',
    amount: 3500.00,
    dueDate: '2025-07-25',
    status: 'PENDING',
    customerId: 'cust-004',
    customerName: 'Maria Santos',
    category: 'Landscaping',
    createdAt: '2025-06-05T08:20:00Z',
    updatedAt: '2025-06-05T08:20:00Z'
  }
];

class AccountsReceivableService {
  private baseUrl = SERVICE_ENDPOINTS.accountsReceivable;
  private demoData = generateDemoReceivables();

  /**
   * Get all receivable accounts
   * EN: Retrieves all receivable accounts with optional filtering
   * PT: Recupera todas as contas a receber com filtragem opcional
   */
  async getAllReceivables(status?: string): Promise<ReceivableAccount[]> {
    try {
      if (DEMO_MODE) {
        return this.demoGetAllReceivables(status);
      }

      const url = status ? `${this.baseUrl}?status=${status}` : this.baseUrl;
      const response = await apiClient.get<ReceivableAccount[]>(url);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetAllReceivables(status);
    }
  }

  /**
   * Get receivable account by ID
   * EN: Retrieves a specific receivable account by its ID
   * PT: Recupera uma conta a receber específica pelo seu ID
   */
  async getReceivableById(id: string): Promise<ReceivableAccount> {
    try {
      if (DEMO_MODE) {
        return this.demoGetReceivableById(id);
      }

      const response = await apiClient.get<ReceivableAccount>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetReceivableById(id);
    }
  }

  /**
   * Create new receivable account
   * EN: Creates a new receivable account
   * PT: Cria uma nova conta a receber
   */
  async createReceivable(receivableData: CreateReceivableRequest): Promise<ReceivableAccount> {
    try {
      if (DEMO_MODE) {
        return this.demoCreateReceivable(receivableData);
      }

      const response = await apiClient.post<ReceivableAccount>(this.baseUrl, receivableData);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoCreateReceivable(receivableData);
    }
  }

  /**
   * Update receivable account
   * EN: Updates an existing receivable account
   * PT: Atualiza uma conta a receber existente
   */
  async updateReceivable(id: string, receivableData: Partial<CreateReceivableRequest>): Promise<ReceivableAccount> {
    try {
      if (DEMO_MODE) {
        return this.demoUpdateReceivable(id, receivableData);
      }

      const response = await apiClient.put<ReceivableAccount>(`${this.baseUrl}/${id}`, receivableData);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoUpdateReceivable(id, receivableData);
    }
  }

  /**
   * Delete receivable account
   * EN: Deletes a receivable account
   * PT: Exclui uma conta a receber
   */
  async deleteReceivable(id: string): Promise<void> {
    try {
      if (DEMO_MODE) {
        return this.demoDeleteReceivable(id);
      }

      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoDeleteReceivable(id);
    }
  }

  /**
   * Register receipt for receivable
   * EN: Registers a receipt transaction for a receivable account
   * PT: Registra uma transação de recebimento para uma conta a receber
   */
  async registerReceipt(receivableId: string, receiptData: ReceiptRequest): Promise<ReceiptTransaction> {
    try {
      if (DEMO_MODE) {
        return this.demoRegisterReceipt(receivableId, receiptData);
      }

      const response = await apiClient.post<ReceiptTransaction>(
        `${this.baseUrl}/${receivableId}/receipts`,
        receiptData
      );
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoRegisterReceipt(receivableId, receiptData);
    }
  }

  /**
   * Get receipts for receivable
   * EN: Retrieves all receipt transactions for a receivable account
   * PT: Recupera todas as transações de recebimento para uma conta a receber
   */
  async getReceiptsForReceivable(receivableId: string): Promise<ReceiptTransaction[]> {
    try {
      if (DEMO_MODE) {
        return this.demoGetReceiptsForReceivable(receivableId);
      }

      const response = await apiClient.get<ReceiptTransaction[]>(`${this.baseUrl}/${receivableId}/receipts`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetReceiptsForReceivable(receivableId);
    }
  }

  /**
   * Get overdue receivables
   * EN: Retrieves all overdue receivable accounts
   * PT: Recupera todas as contas a receber em atraso
   */
  async getOverdueReceivables(): Promise<ReceivableAccount[]> {
    try {
      if (DEMO_MODE) {
        return this.demoGetOverdueReceivables();
      }

      const response = await apiClient.get<ReceivableAccount[]>(`${this.baseUrl}/overdue`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetOverdueReceivables();
    }
  }

  // Demo mode methods
  // EN: Demo mode methods for testing
  // PT: Métodos do modo demo para teste

  private async demoGetAllReceivables(status?: string): Promise<ReceivableAccount[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    if (status) {
      return this.demoData.filter(receivable => receivable.status === status);
    }
    return [...this.demoData];
  }

  private async demoGetReceivableById(id: string): Promise<ReceivableAccount> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const receivable = this.demoData.find(r => r.id === id);
    if (!receivable) {
      throw new Error('Receivable not found');
    }
    return { ...receivable };
  }

  private async demoCreateReceivable(receivableData: CreateReceivableRequest): Promise<ReceivableAccount> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newReceivable: ReceivableAccount = {
      id: `rec-${Date.now()}`,
      ...receivableData,
      status: 'PENDING',
      customerName: 'Demo Customer', // In real implementation, this would be fetched from customer service
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.demoData.push(newReceivable);
    return { ...newReceivable };
  }

  private async demoUpdateReceivable(id: string, receivableData: Partial<CreateReceivableRequest>): Promise<ReceivableAccount> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.demoData.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Receivable not found');
    }
    
    this.demoData[index] = {
      ...this.demoData[index],
      ...receivableData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.demoData[index] };
  }

  private async demoDeleteReceivable(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.demoData.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Receivable not found');
    }
    
    this.demoData.splice(index, 1);
  }

  private async demoRegisterReceipt(receivableId: string, receiptData: ReceiptRequest): Promise<ReceiptTransaction> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const receivable = this.demoData.find(r => r.id === receivableId);
    if (!receivable) {
      throw new Error('Receivable not found');
    }
    
    const receipt: ReceiptTransaction = {
      id: `receipt-${Date.now()}`,
      receivableId,
      ...receiptData,
      receiptDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Update receivable status
    const receivedAmount = (receivable.receivedAmount || 0) + receiptData.amount;
    if (receivedAmount >= receivable.amount) {
      receivable.status = 'RECEIVED';
      receivable.receivedAt = new Date().toISOString();
    }
    receivable.receivedAmount = receivedAmount;
    receivable.updatedAt = new Date().toISOString();
    
    return receipt;
  }

  private async demoGetReceiptsForReceivable(receivableId: string): Promise<ReceiptTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In demo mode, return mock receipts
    return [
      {
        id: `receipt-${receivableId}-1`,
        receivableId,
        amount: 1000.00,
        receiptDate: '2025-06-12T10:00:00Z',
        paymentMethod: 'Bank Transfer',
        reference: 'REC123456',
        createdAt: '2025-06-12T10:00:00Z'
      }
    ];
  }

  private async demoGetOverdueReceivables(): Promise<ReceivableAccount[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const today = new Date();
    return this.demoData.filter(receivable => 
      receivable.status !== 'RECEIVED' && 
      receivable.status !== 'CANCELLED' && 
      new Date(receivable.dueDate) < today
    );
  }
}

export const accountsReceivableService = new AccountsReceivableService();
export default accountsReceivableService;

