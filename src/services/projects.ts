import { apiClient } from './api';
import type { Project } from '../types';

export interface ProjectFilters {
  photographerId?: string;
  category?: string;
  sortBy?: 'recent' | 'popular' | 'views';
  page?: number;
  limit?: number;
}

export interface CreateProjectData {
  title: string;
  description: string;
  images: string[];
  category: string;
}

export const projectsApi = {
  async getAll(filters?: ProjectFilters): Promise<Project[]> {
    const params: Record<string, string> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params[key] = String(value);
        }
      });
    }
    return apiClient.get<Project[]>('/projects', params);
  },

  async getById(id: string): Promise<Project> {
    return apiClient.get<Project>(`/projects/${id}`);
  },

  async getByPhotographer(photographerId: string): Promise<Project[]> {
    return apiClient.get<Project[]>(`/photographers/${photographerId}/projects`);
  },

  async create(data: CreateProjectData): Promise<Project> {
    return apiClient.post<Project>('/projects', data);
  },

  async update(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    return apiClient.put<Project>(`/projects/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  async like(id: string): Promise<{ likes: number }> {
    return apiClient.post<{ likes: number }>(`/projects/${id}/like`);
  },

  async unlike(id: string): Promise<{ likes: number }> {
    return apiClient.delete<{ likes: number }>(`/projects/${id}/like`);
  },

  async save(id: string): Promise<void> {
    await apiClient.post(`/projects/${id}/save`);
  },

  async unsave(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}/save`);
  },

  async getSaved(): Promise<Project[]> {
    return apiClient.get<Project[]>('/projects/saved');
  },

  async getRelated(id: string, limit: number = 4): Promise<Project[]> {
    return apiClient.get<Project[]>(`/projects/${id}/related`, { limit: String(limit) });
  },
};
