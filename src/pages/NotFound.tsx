import { Link } from 'react-router-dom';
import { Home, Camera } from 'lucide-react';
import { DocumentTitle } from '../components/DocumentTitle';
import { useI18n } from '../i18n/I18nContext';

export function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh px-4">
      <DocumentTitle title={t('error.notFound')} />
      <div className="text-center max-w-md animate-fade-in-up opacity-0">
        <div className="relative mb-8">
          <h1 className="text-[10rem] font-black text-gradient leading-none select-none">۴۰۴</h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center shadow-xl shadow-secondary/30 animate-float">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-primary mb-3">{t('error.notFound')}</h2>
        <p className="text-text mb-10 leading-relaxed">{t('error.notFoundMessage')}</p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 btn-primary group"
        >
          <Home className="w-5 h-5" />
          {t('error.goHome')}
        </Link>
      </div>
    </div>
  );
}
