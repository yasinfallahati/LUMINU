import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from './Loading';
import { useI18n } from '../i18n/I18nContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'photographer' | 'client';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">{t('error.unauthorized')}</h2>
          <p className="text-gray-500">{t('error.unauthorizedMessage')}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
