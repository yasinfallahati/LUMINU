import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Project, BookingRequest, Chat, Review, Notification, User, Message } from '../types';
import { photographerApi, projectApi, bookingApi, messageApi, reviewApi, notificationApi } from '../services/api';

interface DataContextType {
  projects: Project[];
  bookings: BookingRequest[];
  chats: Chat[];
  reviews: Review[];
  notifications: Notification[];
  photographers: User[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'likes' | 'views' | 'createdAt'>) => Promise<void>;
  addBooking: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: BookingRequest['status']) => Promise<void>;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  getPhotographerProjects: (photographerId: string) => Project[];
  getPhotographerBookings: (photographerId: string) => BookingRequest[];
  getClientBookings: (clientId: string) => BookingRequest[];
  getUserReviews: (photographerId: string) => Review[];
  getUnreadNotifications: (userId: string) => Notification[];
  getChatByParticipants: (participantIds: string[]) => Chat | undefined;
  createChat: (participantId: string) => Promise<Chat>;
  fetchPhotographers: (params?: { city?: string; specialty?: string; search?: string }) => Promise<void>;
  fetchProjects: (params?: { category?: string; photographerId?: string }) => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchChats: () => Promise<void>;
  fetchReviews: (photographerId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [photographers, setPhotographers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      photographerApi.getAll().then(({ photographers }) => setPhotographers(photographers)),
      projectApi.getAll().then(({ projects }) => setProjects(projects)),
      notificationApi.getAll().then(({ notifications }) => setNotifications(notifications)),
      bookingApi.getAll().then(({ bookings }) => setBookings(bookings)).catch(() => {}),
      messageApi.getChats().then(({ chats }) => setChats(chats)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const fetchPhotographers = useCallback(async (params?: { city?: string; specialty?: string; search?: string }) => {
    const { photographers } = await photographerApi.getAll(params);
    setPhotographers(photographers);
  }, []);

  const fetchProjects = useCallback(async (params?: { category?: string; photographerId?: string }) => {
    const { projects } = await projectApi.getAll(params);
    setProjects(projects);
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const { bookings } = await bookingApi.getAll();
      setBookings(bookings);
    } catch {}
  }, []);

  const fetchChats = useCallback(async () => {
    try {
      const { chats } = await messageApi.getChats();
      setChats(chats);
    } catch {}
  }, []);

  const fetchReviews = useCallback(async (photographerId: string) => {
    const { reviews } = await reviewApi.getByPhotographer(photographerId);
    setReviews(reviews);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const { notifications } = await notificationApi.getAll();
      setNotifications(notifications);
    } catch {}
  }, []);

  const addProject = async (projectData: Omit<Project, 'id' | 'likes' | 'views' | 'createdAt'>) => {
    const { project } = await projectApi.create(projectData);
    setProjects(prev => [project, ...prev]);
  };

  const addBooking = async (bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const { booking } = await bookingApi.create(bookingData);
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = async (bookingId: string, status: BookingRequest['status']) => {
    await bookingApi.updateStatus(bookingId, status);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const addMessage = async (chatId: string, messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const { message } = await messageApi.sendMessage(chatId, messageData.text);
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: message,
          updatedAt: message.timestamp,
        };
      }
      return chat;
    }));
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const { review } = await reviewApi.create(reviewData);
    setReviews(prev => [review, ...prev]);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await notificationApi.markAsRead(notificationId);
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = async () => {
    await notificationApi.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getPhotographerProjects = (photographerId: string) => {
    return projects.filter(p => p.photographerId === photographerId);
  };

  const getPhotographerBookings = (photographerId: string) => {
    return bookings.filter(b => b.photographerId === photographerId);
  };

  const getClientBookings = (clientId: string) => {
    return bookings.filter(b => b.clientId === clientId);
  };

  const getUserReviews = (photographerId: string) => {
    return reviews.filter(r => r.photographerId === photographerId);
  };

  const getUnreadNotifications = (userId: string) => {
    return notifications.filter(n => n.userId === userId && !n.read);
  };

  const getChatByParticipants = (participantIds: string[]) => {
    return chats.find(chat =>
      chat.participants.length === participantIds.length &&
      chat.participants.every(p => participantIds.includes(p))
    );
  };

  const createChat = async (participantId: string): Promise<Chat> => {
    const { chat } = await messageApi.createChat(participantId);
    setChats(prev => {
      const exists = prev.find(c => c.id === chat.id);
      if (exists) return prev;
      return [...prev, chat];
    });
    return chat;
  };

  return (
    <DataContext.Provider value={{
      projects,
      bookings,
      chats,
      reviews,
      notifications,
      photographers,
      loading,
      addProject,
      addBooking,
      updateBookingStatus,
      addMessage,
      addReview,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      getPhotographerProjects,
      getPhotographerBookings,
      getClientBookings,
      getUserReviews,
      getUnreadNotifications,
      getChatByParticipants,
      createChat,
      fetchPhotographers,
      fetchProjects,
      fetchBookings,
      fetchChats,
      fetchReviews,
      fetchNotifications,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
