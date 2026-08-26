import { apiClient } from './api';
import type { Chat, Message } from '../types';

export interface SendMessageData {
  receiverId: string;
  text: string;
}

export const messagesApi = {
  async getChats(): Promise<Chat[]> {
    return apiClient.get<Chat[]>('/chats');
  },

  async getChatById(id: string): Promise<Chat> {
    return apiClient.get<Chat>(`/chats/${id}`);
  },

  async getOrCreateChat(participantId: string): Promise<Chat> {
    return apiClient.post<Chat>('/chats', { participantId });
  },

  async sendMessage(chatId: string, data: SendMessageData): Promise<Message> {
    return apiClient.post<Message>(`/chats/${chatId}/messages`, data);
  },

  async markAsRead(chatId: string): Promise<void> {
    await apiClient.post(`/chats/${chatId}/read`);
  },

  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    await apiClient.delete(`/chats/${chatId}/messages/${messageId}`);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>('/chats/unread');
  },
};
