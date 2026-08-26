import { Link, useLocation } from 'react-router-dom';
import { Camera, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { getUnreadNotifications } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) return null;

  const unreadCount = getUnreadNotifications(user.id).length;

  const navLinks = [
    { path: '/', label: 'خانه' },
    { path: '/discover', label: 'کشف' },
    ...(user.role === 'photographer' ? [{ path: '/photographer/dashboard', label: 'داشبورد' }] : []),
    { path: '/messages', label: 'پیام‌ها' },
    { path: '/notifications', label: 'اعلان‌ها' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-border-light shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Camera className="w-5 h-5 text-secondary" />
              </div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-primary' : 'text-white'
                }`}
              >
                لومینو
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? scrolled
                          ? 'text-primary bg-surface-alt'
                          : 'text-white bg-white/10'
                        : scrolled
                          ? 'text-gray-600 hover:text-primary hover:bg-surface-alt'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                    {link.path === '/notifications' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-primary text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  scrolled
                    ? 'text-gray-600 hover:text-error hover:bg-red-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2.5 rounded-full transition-colors duration-300 ${
                  scrolled ? 'hover:bg-surface-alt' : 'hover:bg-white/10'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className={`w-5 h-5 ${scrolled ? 'text-primary' : 'text-white'}`} />
                ) : (
                  <Menu className={`w-5 h-5 ${scrolled ? 'text-primary' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-10">
                <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-lg font-bold text-primary">لومینو</span>
                </Link>
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-surface-alt text-primary'
                          : 'text-gray-600 hover:bg-surface-alt'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-border-light">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-error hover:bg-red-50 rounded-2xl transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  خروج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
