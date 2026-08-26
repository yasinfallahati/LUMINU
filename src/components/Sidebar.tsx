import { Link, useLocation } from 'react-router-dom';
import {
  Camera,
  Search,
  User,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Home,
  Briefcase,
  Heart,
  Users,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Avatar } from './ui/Avatar';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const { user, logout } = useAuth();
  const { getUnreadNotifications } = useData();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const unreadCount = getUnreadNotifications(user?.id || '').length;

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const clientLinks = [
    { path: '/', label: 'خانه', icon: Home },
    { path: '/discover', label: 'کشف عکاسان', icon: Search },
    { path: '/jobs', label: 'آگهی‌های شغلی', icon: Briefcase },
    { path: '/messages', label: 'پیام‌ها', icon: MessageSquare, badge: unreadCount },
    { path: '/notifications', label: 'اعلان‌ها', icon: Bell, badge: unreadCount },
    { path: '/saved-projects', label: 'ذخیره شده', icon: Heart },
    { path: '/following', label: 'دنبال شده', icon: Users },
    { path: '/settings', label: 'تنظیمات', icon: Settings },
  ];

  const photographerLinks = [
    { path: '/', label: 'خانه', icon: Home },
    { path: '/discover', label: 'کشف عکاسان', icon: Search },
    { path: '/jobs', label: 'آگهی‌های شغلی', icon: Briefcase },
    { path: '/messages', label: 'پیام‌ها', icon: MessageSquare, badge: unreadCount },
    { path: '/notifications', label: 'اعلان‌ها', icon: Bell, badge: unreadCount },
    { path: '/photographer/dashboard', label: 'داشبورد', icon: User },
    { path: '/settings', label: 'تنظیمات', icon: Settings },
  ];

  const navLinks = user.role === 'photographer' ? photographerLinks : clientLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5">
        <Link to="/" className="flex items-center gap-3 mb-8 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
            <Camera className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-black text-primary tracking-tight whitespace-nowrap">
              لومینو
            </span>
          )}
        </Link>

        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center gap-3 px-3.5 py-3 rounded-xl
                  transition-all duration-300 relative group
                  ${isActive
                    ? 'bg-secondary/10 text-secondary-dark font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-secondary' : ''}`} />
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap">{link.label}</span>
                )}
                {link.badge && link.badge > 0 && !isCollapsed && (
                  <span className="mr-auto bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {link.badge}
                  </span>
                )}
                {link.badge && link.badge > 0 && isCollapsed && (
                  <span className="absolute -top-1 -left-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-5 border-t border-border-light">
        <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            fallback={user.name}
            size="md"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-primary text-sm truncate">{user.name}</p>
              <p className="text-xs text-text truncate">
                {user.role === 'photographer' ? 'عکاس' : 'مشتری'}
              </p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-medium text-error hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            خروج
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-border-light"
      >
        {isMobileOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar - right side for RTL */}
      <aside
        className={`
          hidden lg:flex fixed right-0 top-0 h-screen bg-surface border-l border-border-light
          flex-col transition-all duration-500 ease-out z-40
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${className}
        `}
      >
        {sidebarContent}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-3 top-20 w-6 h-6 bg-surface border border-border-light rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          )}
        </button>
      </aside>

      {/* Mobile sidebar - right side */}
      <aside
        className={`
          lg:hidden fixed right-0 top-0 h-screen bg-surface border-l border-border-light
          w-72 transform transition-transform duration-300 ease-out z-40 shadow-xl
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
