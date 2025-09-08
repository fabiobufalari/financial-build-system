// Logging Service for User Activity Tracking
// EN: Service for tracking user activities, menu selections, and system interactions
// PT: Serviço para rastrear atividades do usuário, seleções de menu e interações do sistema

import apiClient from './apiClient';
import { SERVICE_ENDPOINTS } from '../config/apiConfig';

export interface UserActivity {
  id?: string;
  userId: string;
  username: string;
  activityType: 'LOGIN' | 'LOGOUT' | 'MENU_CLICK' | 'PAGE_VIEW' | 'FORM_SUBMIT' | 'API_CALL' | 'ERROR';
  description: string;
  menuItem?: string;
  pageUrl?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface LoginActivity extends UserActivity {
  activityType: 'LOGIN';
  loginMethod: 'CREDENTIALS' | 'TOKEN_REFRESH' | 'DEMO';
  success: boolean;
  errorMessage?: string;
}

export interface MenuActivity extends UserActivity {
  activityType: 'MENU_CLICK';
  menuItem: string;
  menuPath: string;
  previousPage?: string;
}

export interface PageViewActivity extends UserActivity {
  activityType: 'PAGE_VIEW';
  pageUrl: string;
  pageTitle: string;
  timeSpent?: number;
  referrer?: string;
}

class LoggingService {
  private baseUrl = `${SERVICE_ENDPOINTS.analytics}/logging`;
  private sessionId: string;
  private currentUser: any = null;
  private pageStartTime: number = Date.now();
  private activityQueue: UserActivity[] = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeLogging();
    this.setupNetworkListeners();
  }
  
  /** Método público compatível com LoginPage */
  public async logEvent(event: string, data?: Record<string, any>): Promise<void> {
    try {
      const payload: UserActivity = {
        userId: this.currentUser?.id || 'anonymous',
        username: this.currentUser?.username || 'anonymous',
        activityType: 'API_CALL', // genérico
        description: event,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: await this.getUserIP(),
        metadata: data || {}
      };
      console.log(`[LoggingService] ${event}`, payload);
      // Opcional: enviar para API
      // await apiClient.post(`${this.baseUrl}/event`, payload);
    } catch (err) {
      console.error('LoggingService.logEvent error:', err);
    }
  }

  /**
   * Initialize logging service
   * EN: Sets up logging service and starts tracking
   * PT: Configura o serviço de logging e inicia o rastreamento
   */
  private initializeLogging(): void {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.logPageView(window.location.pathname, document.title, Date.now() - this.pageStartTime);
      } else {
        this.pageStartTime = Date.now();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.logPageView(window.location.pathname, document.title, Date.now() - this.pageStartTime);
      this.flushActivityQueue();
    });

    // Flush queue periodically
    setInterval(() => {
      this.flushActivityQueue();
    }, 30000); // Every 30 seconds
  }

  /**
   * Setup network status listeners
   * EN: Monitors network connectivity for offline/online logging
   * PT: Monitora conectividade de rede para logging offline/online
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushActivityQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Generate unique session ID
   * EN: Creates a unique session identifier
   * PT: Cria um identificador único de sessão
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user IP address
   * EN: Attempts to get user's IP address
   * PT: Tenta obter o endereço IP do usuário
   */
  public async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Failed to get IP address:', error);
      return 'unknown';
    }
  }

  /**
   * Create base activity object
   * EN: Creates base activity object with common fields
   * PT: Cria objeto base de atividade com campos comuns
   */
  private async createBaseActivity(activityType: UserActivity['activityType'], description: string): Promise<UserActivity> {
    const ipAddress = await this.getUserIP();
    
    return {
      userId: this.currentUser?.id || 'anonymous',
      username: this.currentUser?.username || 'anonymous',
      activityType,
      description,
      ipAddress,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.pathname,
      metadata: {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };
  }

  /**
   * Log user login activity
   * EN: Records user login attempts and results
   * PT: Registra tentativas de login e resultados do usuário
   */
  async logLogin(username: string, success: boolean, method: 'CREDENTIALS' | 'TOKEN_REFRESH' | 'DEMO' = 'CREDENTIALS', errorMessage?: string): Promise<void> {
    try {
      const activity = await this.createBaseActivity('LOGIN', `User ${success ? 'successfully logged in' : 'failed to log in'}`);
      
      const loginActivity: LoginActivity = {
        ...activity,
        activityType: 'LOGIN',
        loginMethod: method,
        success,
        errorMessage,
        metadata: {
          ...activity.metadata,
          loginAttempt: {
            username,
            method,
            timestamp: activity.timestamp
          }
        }
      };

      await this.queueActivity(loginActivity);
      
      // Update current user if login was successful
      if (success) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          this.currentUser = JSON.parse(userStr);
        }
      }
    } catch (error) {
      console.error('Failed to log login activity:', error);
    }
  }

  /**
   * Log user logout activity
   * EN: Records user logout events
   * PT: Registra eventos de logout do usuário
   */
  async logLogout(): Promise<void> {
    try {
      const activity = await this.createBaseActivity('LOGOUT', 'User logged out');
      await this.queueActivity(activity);
      
      // Clear current user
      this.currentUser = null;
    } catch (error) {
      console.error('Failed to log logout activity:', error);
    }
  }

  /**
   * Log menu click activity
   * EN: Records menu item selections and navigation
   * PT: Registra seleções de itens de menu e navegação
   */
  async logMenuClick(menuItem: string, menuPath: string, previousPage?: string): Promise<void> {
    try {
      const activity = await this.createBaseActivity('MENU_CLICK', `User clicked menu item: ${menuItem}`);
      
      const menuActivity: MenuActivity = {
        ...activity,
        activityType: 'MENU_CLICK',
        menuItem,
        menuPath,
        previousPage,
        metadata: {
          ...activity.metadata,
          navigation: {
            from: previousPage || document.referrer,
            to: menuPath,
            menuHierarchy: menuPath.split('/').filter(Boolean)
          }
        }
      };

      await this.queueActivity(menuActivity);
    } catch (error) {
      console.error('Failed to log menu click activity:', error);
    }
  }

  /**
   * Log page view activity
   * EN: Records page visits and time spent
   * PT: Registra visitas de página e tempo gasto
   */
  async logPageView(pageUrl: string, pageTitle: string, timeSpent?: number): Promise<void> {
    try {
      const activity = await this.createBaseActivity('PAGE_VIEW', `User viewed page: ${pageTitle}`);
      
      const pageActivity: PageViewActivity = {
        ...activity,
        activityType: 'PAGE_VIEW',
        pageUrl,
        pageTitle,
        timeSpent,
        referrer: document.referrer,
        metadata: {
          ...activity.metadata,
          pageInfo: {
            title: pageTitle,
            url: pageUrl,
            timeSpent,
            scrollDepth: this.getScrollDepth(),
            loadTime: performance.now()
          }
        }
      };

      await this.queueActivity(pageActivity);
    } catch (error) {
      console.error('Failed to log page view activity:', error);
    }
  }

  /**
   * Log form submission activity
   * EN: Records form submissions and interactions
   * PT: Registra submissões de formulário e interações
   */
  async logFormSubmit(formName: string, formData: Record<string, any>, success: boolean, errorMessage?: string): Promise<void> {
    try {
      const activity = await this.createBaseActivity('FORM_SUBMIT', `User submitted form: ${formName}`);
      
      // Remove sensitive data from logging
      const sanitizedData = this.sanitizeFormData(formData);
      
      activity.metadata = {
        ...activity.metadata,
        form: {
          name: formName,
          fields: Object.keys(sanitizedData),
          success,
          errorMessage,
          submissionTime: activity.timestamp
        }
      };

      await this.queueActivity(activity);
    } catch (error) {
      console.error('Failed to log form submit activity:', error);
    }
  }

  /**
   * Log API call activity
   * EN: Records API calls and responses
   * PT: Registra chamadas de API e respostas
   */
  async logApiCall(endpoint: string, method: string, success: boolean, responseTime: number, errorMessage?: string): Promise<void> {
    try {
      const activity = await this.createBaseActivity('API_CALL', `API call to ${endpoint}`);
      
      activity.metadata = {
        ...activity.metadata,
        apiCall: {
          endpoint,
          method,
          success,
          responseTime,
          errorMessage,
          timestamp: activity.timestamp
        }
      };

      await this.queueActivity(activity);
    } catch (error) {
      console.error('Failed to log API call activity:', error);
    }
  }

  /**
   * Log error activity
   * EN: Records application errors and exceptions
   * PT: Registra erros e exceções da aplicação
   */
  async logError(errorMessage: string, errorStack?: string, errorContext?: Record<string, any>): Promise<void> {
    try {
      const activity = await this.createBaseActivity('ERROR', `Application error: ${errorMessage}`);
      
      activity.metadata = {
        ...activity.metadata,
        error: {
          message: errorMessage,
          stack: errorStack,
          context: errorContext,
          timestamp: activity.timestamp,
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      };

      await this.queueActivity(activity);
    } catch (error) {
      console.error('Failed to log error activity:', error);
    }
  }

  /**
   * Queue activity for batch processing
   * EN: Adds activity to queue for batch sending
   * PT: Adiciona atividade à fila para envio em lote
   */
  private async queueActivity(activity: UserActivity): Promise<void> {
    this.activityQueue.push(activity);
    
    // If online and queue is getting large, flush immediately
    if (this.isOnline && this.activityQueue.length >= 10) {
      await this.flushActivityQueue();
    }
  }

  /**
   * Flush activity queue to server
   * EN: Sends queued activities to the server
   * PT: Envia atividades em fila para o servidor
   */
  private async flushActivityQueue(): Promise<void> {
    if (this.activityQueue.length === 0 || !this.isOnline) {
      return;
    }

    const activitiesToSend = [...this.activityQueue];
    this.activityQueue = [];

    try {
      await apiClient.post(`${this.baseUrl}/batch`, {
        activities: activitiesToSend,
        sessionId: this.sessionId
      });
      
      console.log(`✅ Successfully logged ${activitiesToSend.length} activities`);
    } catch (error) {
      console.warn('❌ Failed to send activity logs:', error);
      
      // Re-queue activities if send failed
      this.activityQueue.unshift(...activitiesToSend);
      
      // Store in localStorage as backup
      this.storeActivitiesLocally(activitiesToSend);
    }
  }

  /**
   * Store activities locally as backup
   * EN: Stores activities in localStorage when server is unavailable
   * PT: Armazena atividades no localStorage quando servidor não está disponível
   */
  private storeActivitiesLocally(activities: UserActivity[]): void {
    try {
      const existingActivities = JSON.parse(localStorage.getItem('pendingActivities') || '[]');
      const allActivities = [...existingActivities, ...activities];
      
      // Keep only last 100 activities to prevent localStorage overflow
      const recentActivities = allActivities.slice(-100);
      localStorage.setItem('pendingActivities', JSON.stringify(recentActivities));
    } catch (error) {
      console.warn('Failed to store activities locally:', error);
    }
  }

  /**
   * Get scroll depth percentage
   * EN: Calculates how far user has scrolled on the page
   * PT: Calcula o quão longe o usuário rolou na página
   */
  private getScrollDepth(): number {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
  }

  /**
   * Sanitize form data for logging
   * EN: Removes sensitive information from form data before logging
   * PT: Remove informações sensíveis dos dados do formulário antes do logging
   */
  private sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['password', 'confirmPassword', 'creditCard', 'ssn', 'token'];
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = typeof value === 'string' && value.length > 100 ? 
          value.substring(0, 100) + '...' : value;
      }
    }
    
    return sanitized;
  }

  /**
   * Get activity statistics
   * EN: Returns statistics about user activities
   * PT: Retorna estatísticas sobre atividades do usuário
   */
  getActivityStats(): Record<string, any> {
    const pendingActivities = JSON.parse(localStorage.getItem('pendingActivities') || '[]');
    
    return {
      sessionId: this.sessionId,
      currentUser: this.currentUser?.username || 'anonymous',
      queuedActivities: this.activityQueue.length,
      pendingActivities: pendingActivities.length,
      isOnline: this.isOnline,
      sessionStartTime: this.sessionId.split('_')[1]
    };
  }