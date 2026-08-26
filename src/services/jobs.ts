import { apiClient } from './api';

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  requirements?: string;
  category: string;
  budget: number;
  location: string;
  isRemote: boolean;
  isUrgent: boolean;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  proposalCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  isRemote?: boolean;
  isUrgent?: boolean;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements?: string;
  category: string;
  budget: number;
  location: string;
  isRemote: boolean;
  deadline: string;
}

export interface Proposal {
  id: string;
  jobId: string;
  photographerId: string;
  photographerName: string;
  coverLetter: string;
  proposedBudget: number;
  proposedTimeline: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface CreateProposalData {
  coverLetter: string;
  proposedBudget: number;
  proposedTimeline: number;
}

export const jobsApi = {
  async getAll(filters?: JobFilters): Promise<Job[]> {
    const params: Record<string, string> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params[key] = String(value);
        }
      });
    }
    return apiClient.get<Job[]>('/jobs', params);
  },

  async getById(id: string): Promise<Job> {
    return apiClient.get<Job>(`/jobs/${id}`);
  },

  async create(data: CreateJobData): Promise<Job> {
    return apiClient.post<Job>('/jobs', data);
  },

  async update(id: string, data: Partial<CreateJobData>): Promise<Job> {
    return apiClient.put<Job>(`/jobs/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },

  async getProposals(jobId: string): Promise<Proposal[]> {
    return apiClient.get<Proposal[]>(`/jobs/${jobId}/proposals`);
  },

  async submitProposal(jobId: string, data: CreateProposalData): Promise<Proposal> {
    return apiClient.post<Proposal>(`/jobs/${jobId}/proposals`, data);
  },

  async acceptProposal(jobId: string, proposalId: string): Promise<void> {
    await apiClient.post(`/jobs/${jobId}/proposals/${proposalId}/accept`);
  },

  async rejectProposal(jobId: string, proposalId: string): Promise<void> {
    await apiClient.post(`/jobs/${jobId}/proposals/${proposalId}/reject`);
  },

  async getMyProposals(): Promise<Proposal[]> {
    return apiClient.get<Proposal[]>('/proposals');
  },
};
