import { useEffect } from 'react';
import { Bell, Calendar, MessageSquare, Star, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/ui/Card';
import { SectionTitle } from '../components/ui/SectionTitle';

export function Notifications() {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead, fetchNotifications } = useData();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const userNotifications = notifications
    .filter(n => n.userId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  useEffect(() => {
    userNotifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case 'review':
        return <Star className="w-5 h-5 text-secondary" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="bg-white border-b border-border-light">
        <div className="container-wide py-10">
          <SectionTitle title="اعلان‌ها" subtitle={`${userNotifications.length} اعلان`} />
        </div>
      </div>

      <div className="container-wide py-10">
        {userNotifications.length === 0 ? (
          <Card padding="lg" className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-text text-lg">اعلانی ندارید</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {userNotifications.map((notification) => (
              <Card
                key={notification.id}
                padding="md"
                className={`${!notification.read ? 'border-r-4 border-r-secondary' : ''}`}
                hover={false}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary">
                      {notification.title}
                    </h3>
                    <p className="text-text mt-1.5">{notification.message}</p>
                    <p className="text-text-light text-sm mt-2">
                      {new Date(notification.createdAt).toLocaleString('fa-IR')}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
