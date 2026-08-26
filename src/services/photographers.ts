import { apiClient } from './api';
import type { User } from '../types';

export interface PhotographerFilters {
  city?: string;
  specialty?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'relevant' | 'rating' | 'reviews' | 'price_low' | 'price_high';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const photographersApi = {
  async getAll(filters?: PhotographerFilters): Promise<PaginatedResponse<User>> {
    const params: Record<string, string> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params[key] = String(value);
        }
      });
    }
    return apiClient.get<PaginatedResponse<User>>('/photographers', params);
  },

  async getById(id: string): Promise<User> {
    return apiClient.get<User>(`/photographers/${id}`);
  },

  async getTopRated(limit: number = 10): Promise<User[]> {
    return apiClient.get<User[]>('/photographers/top-rated', { limit: String(limit) });
  },

  async getNearby(lat: number, lng: number, radius: number = 50): Promise<User[]> {
    return apiClient.get<User[]>('/photographers/nearby', {
      lat: String(lat),
      lng: String(lng),
      radius: String(radius),
    });
  },

  async follow(photographerId: string): Promise<void> {
    await apiClient.post(`/photographers/${photographerId}/follow`);
  },

  async unfollow(photographerId: string): Promise<void> {
    await apiClient.delete(`/photographers/${photographerId}/follow`);
  },

  async getFollowers(photographerId: string): Promise<User[]> {
    return apiClient.get<User[]>(`/photographers/${photographerId}/followers`);
  },

  async getFollowing(photographerId: string): Promise<User[]> {
    return apiClient.get<User[]>(`/photographers/${photographerId}/following`);
  },
};
