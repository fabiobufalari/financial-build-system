import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DEFAULT_API_CONFIG } from '../config/apiConfig';

// EN: Enhanced API client with better error handling and real API connectivity
// PT: Cliente API aprimorado com melhor tratamento de erros e conectividade com API real

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private retryCount = 0;
  private maxRetries = DEFAULT_API_CONFIG.retries;

  constructor() {
    this.client = axios.create({
      timeout: DEFAULT_API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('accessToken');
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };
        
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data
        });

        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const duration = response.config.metadata?.startTime ? 
          new Date().getTime() - response.config.metadata.startTime.getTime() : 0;
        console.log(`✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`, {
          data: response.data,
          status: response.status
        });
        
        this.retryCount = 0; // Reset retry count on success
        return response;
      },
      async (error: AxiosError) => {
        const duration = error.config?.metadata?.startTime ? 
          new Date().getTime() - error.config.metadata.startTime.getTime() : 0;
        
        console.error(`❌ API Error: ${error.response?.status || 'NETWORK'} ${error.config?.url} (${duration}ms)`, {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          code: error.code
        });

        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
          const refreshed = await this.handleTokenRefresh();
          if (refreshed && error.config) {
            // Retry the original request with new token
            const token = localStorage.getItem('accessToken');
            if (token) {
              error.config.headers.Authorization = `Bearer ${token}`;
              return this.client.request(error.config);
            }
          }
        }

        // Handle retry logic for network errors
        if (this.shouldRetry(error) && this.retryCount < this.maxRetries) {
          this.retryCount++;
          const delay = Math.pow(2, this.retryCount) * 1000; // Exponential backoff
          
          console.log(`🔄 Retrying request (${this.retryCount}/${this.maxRetries}) after ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.client.request(error.config!);
        }

        this.retryCount = 0; // Reset retry count
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private shouldRetry(error: AxiosError): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      !error.response || // Network error
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  }

  private async handleTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        this.clearAuthData();
        return false;
      }

      // Try to refresh token
      const response = await axios.post('/auth/refresh', { refreshToken });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
    }
    
    return false;
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to login if not already there
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  private formatError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: (error.response.data as any)?.message || error.message,
        status: error.response.status,
        code: (error.response.data as any)?.code,
        details: error.response.data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - unable to connect to server',
        code: error.code || 'NETWORK_ERROR',
        details: {
          url: error.config?.url,
          method: error.config?.method,
          timeout: error.config?.timeout
        }
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  // Public methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Health check method
  async healthCheck(url: string): Promise<boolean> {
    try {
      const response = await this.client.get(`${url}/health`, { 
        timeout: 5000,
        headers: { Authorization: '' } // Don't send auth for health check
      });
      return response.status === 200;
    } catch (error) {
      console.warn(`Health check failed for ${url}:`, error);
      return false;
    }
  }

  // Get connection status
  getConnectionStatus(): 'online' | 'offline' | 'unknown' {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine ? 'online' : 'offline';
    }
    return 'unknown';
  }

  // Test API connectivity
  async testConnectivity(baseUrl: string): Promise<{
    isConnected: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      await this.client.get(`${baseUrl}/health`, { 
        timeout: 10000,
        headers: { Authorization: '' }
      });
      
      return {
        isConnected: true,
        responseTime: Date.now() - startTime
      };
    } catch (error: any) {
      return {
        isConnected: false,
        responseTime: Date.now() - startTime,
        error: error.message || 'Connection failed'
      };
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
export default apiClient;

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

