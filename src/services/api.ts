const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('lumio_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new ApiError(response.status, error.error || 'Request failed');
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ token: string; user: any }>('/auth/login', { email, password }),

  register: (data: any) =>
    apiClient.post<{ token: string; user: any }>('/auth/register', data),

  getMe: () =>
    apiClient.get<{ user: any }>('/auth/me'),

  updateMe: (data: any) =>
    apiClient.put<{ user: any }>('/auth/me', data),
};

export const photographerApi = {
  getAll: (params?: { city?: string; specialty?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.set('city', params.city);
    if (params?.specialty) searchParams.set('specialty', params.specialty);
    if (params?.search) searchParams.set('search', params.search);
    const qs = searchParams.toString();
    return apiClient.get<{ photographers: any[] }>(`/photographers${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) =>
    apiClient.get<{ photographer: any }>(`/photographers/${id}`),
};

export const projectApi = {
  getAll: (params?: { category?: string; photographerId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.photographerId) searchParams.set('photographerId', params.photographerId);
    const qs = searchParams.toString();
    return apiClient.get<{ projects: any[] }>(`/projects${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) =>
    apiClient.get<{ project: any }>(`/projects/${id}`),

  create: (data: any) =>
    apiClient.post<{ project: any }>('/projects', data),

  delete: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/projects/${id}`),
};

export const bookingApi = {
  getAll: () =>
    apiClient.get<{ bookings: any[] }>('/bookings'),

  getStats: () =>
    apiClient.get<{ stats: any }>('/bookings/stats'),

  create: (data: any) =>
    apiClient.post<{ booking: any }>('/bookings', data),

  updateStatus: (id: string, status: string) =>
    apiClient.put<{ success: boolean }>(`/bookings/${id}/status`, { status }),
};

export const messageApi = {
  getChats: () =>
    apiClient.get<{ chats: any[] }>('/messages/chats'),

  createChat: (participantId: string) =>
    apiClient.post<{ chat: any }>('/messages/chats', { participantId }),

  sendMessage: (chatId: string, text: string) =>
    apiClient.post<{ message: any }>(`/messages/chats/${chatId}/messages`, { text }),
};

export const reviewApi = {
  getByPhotographer: (photographerId: string) =>
    apiClient.get<{ reviews: any[] }>(`/reviews/photographer/${photographerId}`),

  create: (data: any) =>
    apiClient.post<{ review: any }>('/reviews', data),
};

export const notificationApi = {
  getAll: () =>
    apiClient.get<{ notifications: any[] }>('/notifications'),

  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    apiClient.put<{ success: boolean }>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put<{ success: boolean }>('/notifications/read-all'),
};

export const jobApi = {
  getAll: (params?: { category?: string; search?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    const qs = searchParams.toString();
    return apiClient.get<{ jobs: any[] }>(`/jobs${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) =>
    apiClient.get<{ job: any }>(`/jobs/${id}`),

  create: (data: any) =>
    apiClient.post<{ job: any }>('/jobs', data),

  getProposals: (jobId: string) =>
    apiClient.get<{ proposals: any[] }>(`/jobs/${jobId}/proposals`),

  submitProposal: (jobId: string, data: any) =>
    apiClient.post<{ proposal: any }>(`/jobs/${jobId}/proposals`, data),

  updateProposalStatus: (jobId: string, proposalId: string, status: string) =>
    apiClient.put<{ success: boolean }>(`/jobs/${jobId}/proposals/${proposalId}/status`, { status }),
};
