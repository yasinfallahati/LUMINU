import { apiClient } from './api';
import type { BookingRequest } from '../types';

export interface CreateBookingData {
  photographerId: string;
  eventDate: string;
  location: string;
  budget: number;
  message: string;
}

export interface UpdateBookingStatusData {
  status: BookingRequest['status'];
}

export const bookingsApi = {
  async getAll(): Promise<BookingRequest[]> {
    return apiClient.get<BookingRequest[]>('/bookings');
  },

  async getById(id: string): Promise<BookingRequest> {
    return apiClient.get<BookingRequest>(`/bookings/${id}`);
  },

  async create(data: CreateBookingData): Promise<BookingRequest> {
    return apiClient.post<BookingRequest>('/bookings', data);
  },

  async updateStatus(id: string, data: UpdateBookingStatusData): Promise<BookingRequest> {
    return apiClient.patch<BookingRequest>(`/bookings/${id}/status`, data);
  },

  async cancel(id: string): Promise<void> {
    await apiClient.post(`/bookings/${id}/cancel`);
  },

  async getPhotographerBookings(photographerId: string): Promise<BookingRequest[]> {
    return apiClient.get<BookingRequest[]>(`/photographers/${photographerId}/bookings`);
  },

  async getClientBookings(clientId: string): Promise<BookingRequest[]> {
    return apiClient.get<BookingRequest[]>(`/clients/${clientId}/bookings`);
  },
};
