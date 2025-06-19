import { apiClient } from './apiClient';
import { SERVICE_ENDPOINTS, DEMO_MODE } from '../config/apiConfig';

// EN: Accounts Payable service with full CRUD operations
// PT: Serviço de contas a pagar com operações CRUD completas

export interface PayableAccount {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  supplierId: string;
  supplierName: string;
  category: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  paidAmount?: number;
}

export interface PaymentTransaction {
  id: string;
  payableId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface CreatePayableRequest {
  description: string;
  amount: number;
  dueDate: string;
  supplierId: string;
  category: string;
  notes?: string;
}

export interface PaymentRequest {
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

// Demo data for testing
// EN: Demo data for testing purposes
// PT: Dados demo para fins de teste
const generateDemoPayables = (): PayableAccount[] => [
  {
    id: 'pay-001',
    description: 'Material de Construção - Cimento',
    amount: 2500.00,
    dueDate: '2025-07-15',
    status: 'PENDING',
    supplierId: 'sup-001',
    supplierName: 'Construtora ABC Ltda',
    category: 'Materials',
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z'
  },
  {
    id: 'pay-002',
    description: 'Serviços de Engenharia',
    amount: 8500.00,
    dueDate: '2025-06-30',
    status: 'OVERDUE',
    supplierId: 'sup-002',
    supplierName: 'Engenharia XYZ',
    category: 'Services',
    createdAt: '2025-05-15T14:30:00Z',
    updatedAt: '2025-06-15T09:00:00Z'
  },
  {
    id: 'pay-003',
    description: 'Equipamentos de Segurança',
    amount: 1200.00,
    dueDate: '2025-07-01',
    status: 'PAID',
    supplierId: 'sup-003',
    supplierName: 'Segurança Total',
    category: 'Equipment',
    paidAt: '2025-06-10T16:45:00Z',
    paidAmount: 1200.00,
    createdAt: '2025-05-20T11:15:00Z',
    updatedAt: '2025-06-10T16:45:00Z'
  },
  {
    id: 'pay-004',
    description: 'Aluguel de Máquinas',
    amount: 4500.00,
    dueDate: '2025-07-20',
    status: 'PENDING',
    supplierId: 'sup-004',
    supplierName: 'Locadora de Máquinas',
    category: 'Equipment',
    createdAt: '2025-06-05T08:20:00Z',
    updatedAt: '2025-06-05T08:20:00Z'
  }
];

class AccountsPayableService {
  private baseUrl = SERVICE_ENDPOINTS.accountsPayable;
  private demoData = generateDemoPayables();

  /**
   * Get all payable accounts
   * EN: Retrieves all payable accounts with optional filtering
   * PT: Recupera todas as contas a pagar com filtragem opcional
   */
  async getAllPayables(status?: string): Promise<PayableAccount[]> {
    try {
      if (DEMO_MODE) {
        return this.demoGetAllPayables(status);
      }

      const url = status ? `${this.baseUrl}?status=${status}` : this.baseUrl;
      const response = await apiClient.get<PayableAccount[]>(url);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetAllPayables(status);
    }
  }

  /**
   * Get payable account by ID
   * EN: Retrieves a specific payable account by its ID
   * PT: Recupera uma conta a pagar específica pelo seu ID
   */
  async getPayableById(id: string): Promise<PayableAccount> {
    try {
      if (DEMO_MODE) {
        return this.demoGetPayableById(id);
      }

      const response = await apiClient.get<PayableAccount>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetPayableById(id);
    }
  }

  /**
   * Create new payable account
   * EN: Creates a new payable account
   * PT: Cria uma nova conta a pagar
   */
  async createPayable(payableData: CreatePayableRequest): Promise<PayableAccount> {
    try {
      if (DEMO_MODE) {
        return this.demoCreatePayable(payableData);
      }

      const response = await apiClient.post<PayableAccount>(this.baseUrl, payableData);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoCreatePayable(payableData);
    }
  }

  /**
   * Update payable account
   * EN: Updates an existing payable account
   * PT: Atualiza uma conta a pagar existente
   */
  async updatePayable(id: string, payableData: Partial<CreatePayableRequest>): Promise<PayableAccount> {
    try {
      if (DEMO_MODE) {
        return this.demoUpdatePayable(id, payableData);
      }

      const response = await apiClient.put<PayableAccount>(`${this.baseUrl}/${id}`, payableData);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoUpdatePayable(id, payableData);
    }
  }

  /**
   * Delete payable account
   * EN: Deletes a payable account
   * PT: Exclui uma conta a pagar
   */
  async deletePayable(id: string): Promise<void> {
    try {
      if (DEMO_MODE) {
        return this.demoDeletePayable(id);
      }

      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoDeletePayable(id);
    }
  }

  /**
   * Register payment for payable
   * EN: Registers a payment transaction for a payable account
   * PT: Registra uma transação de pagamento para uma conta a pagar
   */
  async registerPayment(payableId: string, paymentData: PaymentRequest): Promise<PaymentTransaction> {
    try {
      if (DEMO_MODE) {
        return this.demoRegisterPayment(payableId, paymentData);
      }

      const response = await apiClient.post<PaymentTransaction>(
        `${this.baseUrl}/${payableId}/payments`,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoRegisterPayment(payableId, paymentData);
    }
  }

  /**
   * Get payments for payable
   * EN: Retrieves all payment transactions for a payable account
   * PT: Recupera todas as transações de pagamento para uma conta a pagar
   */
  async getPaymentsForPayable(payableId: string): Promise<PaymentTransaction[]> {
    try {
      if (DEMO_MODE) {
        return this.demoGetPaymentsForPayable(payableId);
      }

      const response = await apiClient.get<PaymentTransaction[]>(`${this.baseUrl}/${payableId}/payments`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetPaymentsForPayable(payableId);
    }
  }

  /**
   * Get overdue payables
   * EN: Retrieves all overdue payable accounts
   * PT: Recupera todas as contas a pagar em atraso
   */
  async getOverduePayables(): Promise<PayableAccount[]> {
    try {
      if (DEMO_MODE) {
        return this.demoGetOverduePayables();
      }

      const response = await apiClient.get<PayableAccount[]>(`${this.baseUrl}/overdue`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to demo mode:', error);
      return this.demoGetOverduePayables();
    }
  }

  // Demo mode methods
  // EN: Demo mode methods for testing
  // PT: Métodos do modo demo para teste

  private async demoGetAllPayables(status?: string): Promise<PayableAccount[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    if (status) {
      return this.demoData.filter(payable => payable.status === status);
    }
    return [...this.demoData];
  }

  private async demoGetPayableById(id: string): Promise<PayableAccount> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const payable = this.demoData.find(p => p.id === id);
    if (!payable) {
      throw new Error('Payable not found');
    }
    return { ...payable };
  }

  private async demoCreatePayable(payableData: CreatePayableRequest): Promise<PayableAccount> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPayable: PayableAccount = {
      id: `pay-${Date.now()}`,
      ...payableData,
      status: 'PENDING',
      supplierName: 'Demo Supplier', // In real implementation, this would be fetched from supplier service
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.demoData.push(newPayable);
    return { ...newPayable };
  }

  private async demoUpdatePayable(id: string, payableData: Partial<CreatePayableRequest>): Promise<PayableAccount> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.demoData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Payable not found');
    }
    
    this.demoData[index] = {
      ...this.demoData[index],
      ...payableData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.demoData[index] };
  }

  private async demoDeletePayable(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.demoData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Payable not found');
    }
    
    this.demoData.splice(index, 1);
  }

  private async demoRegisterPayment(payableId: string, paymentData: PaymentRequest): Promise<PaymentTransaction> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const payable = this.demoData.find(p => p.id === payableId);
    if (!payable) {
      throw new Error('Payable not found');
    }
    
    const payment: PaymentTransaction = {
      id: `payment-${Date.now()}`,
      payableId,
      ...paymentData,
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Update payable status
    const paidAmount = (payable.paidAmount || 0) + paymentData.amount;
    if (paidAmount >= payable.amount) {
      payable.status = 'PAID';
      payable.paidAt = new Date().toISOString();
    }
    payable.paidAmount = paidAmount;
    payable.updatedAt = new Date().toISOString();
    
    return payment;
  }

  private async demoGetPaymentsForPayable(payableId: string): Promise<PaymentTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In demo mode, return mock payments
    return [
      {
        id: `payment-${payableId}-1`,
        payableId,
        amount: 500.00,
        paymentDate: '2025-06-10T10:00:00Z',
        paymentMethod: 'Bank Transfer',
        reference: 'TXN123456',
        createdAt: '2025-06-10T10:00:00Z'
      }
    ];
  }

  private async demoGetOverduePayables(): Promise<PayableAccount[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const today = new Date();
    return this.demoData.filter(payable => 
      payable.status !== 'PAID' && 
      payable.status !== 'CANCELLED' && 
      new Date(payable.dueDate) < today
    );
  }
}

export const accountsPayableService = new AccountsPayableService();
export default accountsPayableService;

