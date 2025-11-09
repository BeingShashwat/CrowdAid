const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('accessToken') 
      : null;

    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Store tokens if provided
      if (data.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE);

// Auth endpoints
export const authApi = {
  register: (data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    userType: 'USER' | 'VOLUNTEER';
    phone?: string;
    agreeToTerms: boolean;
    emergencyContact: boolean;
  }) => apiClient.post('/auth/register', data),

  login: (data: { email: string; password: string; rememberMe?: boolean }) =>
    apiClient.post('/auth/login', data),

  logout: () => apiClient.post('/auth/logout'),

  verifyEmail: (token: string) =>
    apiClient.get(`/auth/verify-email?token=${token}`),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
};

// User endpoints
export const userApi = {
  getProfile: () => apiClient.get('/users/me'),
  updateProfile: (data: any) => apiClient.put('/users/me', data),
  deleteAccount: (password: string) =>
    apiClient.delete('/users/me', { password }),
};

// Emergency endpoints
export const emergencyApi = {
  create: (data: any) => apiClient.post('/emergencies', data),
  getAll: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/emergencies${params ? `?${params}` : ''}`);
  },
  getById: (id: string) => apiClient.get(`/emergencies/${id}`),
  update: (id: string, data: any) => apiClient.put(`/emergencies/${id}`, data),
  respond: (id: string, message?: string) =>
    apiClient.post(`/emergencies/${id}/respond`, { message }),
  resolve: (id: string) => apiClient.put(`/emergencies/${id}/resolve`),
};

