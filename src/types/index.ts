export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'photographer' | 'client';
  avatar?: string;
  city?: string;
  bio?: string;
  priceRange?: { min: number; max: number };
  specialties?: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface Project {
  id: string;
  photographerId: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  likes: number;
  views: number;
  createdAt: string;
}

export interface BookingRequest {
  id: string;
  clientId: string;
  photographerId: string;
  eventDate: string;
  location: string;
  budget: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface Review {
  id: string;
  clientId: string;
  photographerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'message' | 'review' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
