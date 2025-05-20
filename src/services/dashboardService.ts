import { apiClient } from './apiClient';

/**
 * Interface para estatísticas de projetos
 * Interface for project statistics
 */
interface ProjectStats {
  active: number;
  pending: number;
  paused: number;
  completed: number;
}

/**
 * Interface para estatísticas financeiras
 * Interface for financial statistics
 */
interface FinancialStats {
  totalBudget: number;
  totalExpenses: number;
  materialCosts: number;
  laborCosts: number;
  projectedProfit: number;
}

/**
 * Interface para dados de projeto
 * Interface for project data
 */
interface Project {
  id: string;
  name: string;
  address: string;
  status: string;
  progress: number;
  startDate: string;
  estimatedEndDate: string;
  budget: number;
  expenses: number;
  clientId: string;
  clientName: string;
  teamMembers: {
    id: string;
    name: string;
    role: string;
    photo?: string;
  }[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

/**
 * Interface para dados de material
 * Interface for material data
 */
interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  projectId: string;
  status: 'purchased' | 'delivered' | 'used' | 'returned';
  purchaseDate: string;
}

/**
 * Serviço para gerenciar dados do dashboard
 * Service to manage dashboard data
 */
class DashboardService {
  /**
   * Obtém estatísticas de projetos
   * Gets project statistics
   */
  async getProjectStats(): Promise<ProjectStats> {
    try {
      const response = await apiClient.get<ProjectStats>('/api/projects/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de projetos / Error getting project statistics:', error);
      // Retorna dados simulados em caso de erro
      // Returns simulated data in case of error
      return {
        active: 12,
        pending: 5,
        paused: 3,
        completed: 24
      };
    }
  }

  /**
   * Obtém estatísticas financeiras
   * Gets financial statistics
   */
  async getFinancialStats(): Promise<FinancialStats> {
    try {
      const response = await apiClient.get<FinancialStats>('/api/financial/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas financeiras / Error getting financial statistics:', error);
      // Retorna dados simulados em caso de erro
      // Returns simulated data in case of error
      return {
        totalBudget: 1250000,
        totalExpenses: 780000,
        materialCosts: 450000,
        laborCosts: 330000,
        projectedProfit: 470000
      };
    }
  }

  /**
   * Obtém lista de projetos
   * Gets project list
   */
  async getProjects(status?: string): Promise<Project[]> {
    try {
      const url = status ? `/api/projects?status=${status}` : '/api/projects';
      const response = await apiClient.get<Project[]>(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter lista de projetos / Error getting project list:', error);
      // Retorna array vazio em caso de erro
      // Returns empty array in case of error
      return [];
    }
  }

  /**
   * Obtém detalhes de um projeto específico
   * Gets details of a specific project
   */
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const response = await apiClient.get<Project>(`/api/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter projeto ${id} / Error getting project ${id}:`, error);
      return null;
    }
  }

  /**
   * Obtém materiais de um projeto
   * Gets materials for a project
   */
  async getProjectMaterials(projectId: string): Promise<Material[]> {
    try {
      const response = await apiClient.get<Material[]>(`/api/projects/${projectId}/materials`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter materiais do projeto ${projectId} / Error getting materials for project ${projectId}:`, error);
      return [];
    }
  }

  /**
   * Calcula materiais para um projeto
   * Calculates materials for a project
   */
  async calculateMaterials(projectId: string): Promise<any> {
    try {
      const response = await apiClient.post(`/api/projects/${projectId}/calculate`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao calcular materiais para o projeto ${projectId} / Error calculating materials for project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Registra devolução de material
   * Registers material return
   */
  async returnMaterial(materialId: string, quantity: number, reason: string): Promise<any> {
    try {
      const response = await apiClient.post(`/api/materials/${materialId}/return`, {
        quantity,
        reason
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao registrar devolução do material ${materialId} / Error registering return of material ${materialId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém previsão do tempo para projetos
   * Gets weather forecast for projects
   */
  async getWeatherForecasts(): Promise<any[]> {
    try {
      const response = await apiClient.get('/api/weather/forecasts');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter previsões do tempo / Error getting weather forecasts:', error);
      return [];
    }
  }
}

// Exporta uma instância única do DashboardService para ser usada em toda a aplicação
// Exports a single instance of DashboardService to be used throughout the application
export const dashboardService = new DashboardService();
