import axios, { AxiosInstance, AxiosError } from 'axios';

// Configure your C# ASP.NET backend URL here
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Transactions
  async getTransactions(limit?: number) {
    const response = await this.client.get<ApiResponse<any[]>>(
      '/transactions',
      { params: { limit } }
    );
    return response.data.data || [];
  }

  async getTransactionById(id: string) {
    const response = await this.client.get<ApiResponse<any>>(
      `/transactions/${id}`
    );
    return response.data.data;
  }

  async createTransaction(payload: {
    beneficiaryId: string;
    sendAmount: number;
    sendCurrency: string;
    receiveCurrency: string;
    purpose: string;
  }) {
    const response = await this.client.post<ApiResponse<any>>(
      '/transactions',
      payload
    );
    return response.data.data;
  }

  // FX Quotes
  async getQuote(fromCurrency: string, toCurrency: string, amount: number) {
    const response = await this.client.get<ApiResponse<any>>(
      '/quotes',
      { params: { fromCurrency, toCurrency, amount } }
    );
    return response.data.data;
  }

  // Beneficiaries
  async getBeneficiaries() {
    const response = await this.client.get<ApiResponse<any[]>>(
      '/beneficiaries'
    );
    return response.data.data || [];
  }

  async addBeneficiary(payload: any) {
    const response = await this.client.post<ApiResponse<any>>(
      '/beneficiaries',
      payload
    );
    return response.data.data;
  }

  async deleteBeneficiary(id: string) {
    const response = await this.client.delete<ApiResponse<any>>(
      `/beneficiaries/${id}`
    );
    return response.data.success;
  }

  // KYC
  async submitKYC(payload: any) {
    const response = await this.client.post<ApiResponse<any>>(
      '/kyc/submit',
      payload
    );
    return response.data.data;
  }

  async getKYCStatus() {
    const response = await this.client.get<ApiResponse<any>>(
      '/kyc/status'
    );
    return response.data.data;
  }

  // Refunds
  async requestRefund(transactionId: string, payload: {
    reason: string;
    notes?: string;
  }) {
    const response = await this.client.post<ApiResponse<any>>(
      `/transactions/${transactionId}/refund`,
      payload
    );
    return response.data.data;
  }

  async getRefundStatus(transactionId: string) {
    const response = await this.client.get<ApiResponse<any>>(
      `/transactions/${transactionId}/refund-status`
    );
    return response.data.data;
  }

  // Notifications
  async getNotifications() {
    const response = await this.client.get<ApiResponse<any[]>>(
      '/notifications'
    );
    return response.data.data || [];
  }

  async markNotificationAsRead(id: string) {
    const response = await this.client.put<ApiResponse<any>>(
      `/notifications/${id}/read`
    );
    return response.data.success;
  }

  // Compliance (Admin)
  async getComplianceCases(filter?: string) {
    const response = await this.client.get<ApiResponse<any[]>>(
      '/compliance/cases',
      { params: { filter } }
    );
    return response.data.data || [];
  }

  async updateComplianceCase(caseId: string, payload: any) {
    const response = await this.client.put<ApiResponse<any>>(
      `/compliance/cases/${caseId}`,
      payload
    );
    return response.data.data;
  }

  // Operations
  async getOperationsMetrics() {
    const response = await this.client.get<ApiResponse<any>>(
      '/operations/metrics'
    );
    return response.data.data;
  }

  async getSettlementBatches() {
    const response = await this.client.get<ApiResponse<any[]>>(
      '/operations/settlements'
    );
    return response.data.data || [];
  }

  // Treasury
  async getFXRates() {
    const response = await this.client.get<ApiResponse<any>>(
      '/treasury/rates'
    );
    return response.data.data;
  }

  async updateMargin(corridor: string, margin: number) {
    const response = await this.client.put<ApiResponse<any>>(
      '/treasury/margins',
      { corridor, margin }
    );
    return response.data.success;
  }

  // Admin
  async getAdminStats() {
    const response = await this.client.get<ApiResponse<any>>(
      '/admin/stats'
    );
    return response.data.data;
  }

  async getUsers() {
    const response = await this.client.get<ApiResponse<any[]>>(
      '/admin/users'
    );
    return response.data.data || [];
  }

  async updateUser(id: string, payload: any) {
    const response = await this.client.put<ApiResponse<any>>(
      `/admin/users/${id}`,
      payload
    );
    return response.data.data;
  }

  // Reports
  async getReports() {
    const response = await this.client.get<ApiResponse<any[]>>(
      '/reports'
    );
    return response.data.data || [];
  }

  async downloadReport(id: string) {
    const response = await this.client.get(
      `/reports/${id}/download`,
      { responseType: 'blob' }
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();
