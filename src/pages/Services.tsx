import { DocumentTitle } from '../components/DocumentTitle';
import { Button } from '../components/ui/Button';
import { useI18n } from '../i18n/I18nContext';
import { Camera, Shirt, Mountain, Package, Calendar, Users, Palette, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 'wedding',
    icon: Camera,
    titleKey: 'services.wedding',
    description: 'عکاسی حرفه‌ای از مراسم عروسی، عقد و جشن‌ها',
    startingFrom: 10000000,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 'portrait',
    icon: User,
    titleKey: 'services.portrait',
    description: 'عکاسی پرتره حرفه‌ای برای افراد و گروه‌ها',
    startingFrom: 2000000,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'fashion',
    icon: Shirt,
    titleKey: 'services.fashion',
    description: 'عکاسی مد و فشن برای برندها و افراد',
    startingFrom: 5000000,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'nature',
    icon: Mountain,
    titleKey: 'services.nature',
    description: 'عکاسی طبیعت و مناظر طبیعی',
    startingFrom: 3000000,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'product',
    icon: Package,
    titleKey: 'services.product',
    description: 'عکاسی محصول برای فروشگاه‌های آنلاین',
    startingFrom: 1000000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'event',
    icon: Calendar,
    titleKey: 'services.event',
    description: 'عکاسی رویدادها و مراسم‌های مختلف',
    startingFrom: 4000000,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'family',
    icon: Users,
    titleKey: 'services.family',
    description: 'عکاسی خانواده و کودک',
    startingFrom: 2500000,
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'artistic',
    icon: Palette,
    titleKey: 'services.artistic',
    description: 'عکاسی هنری و خلاقانه',
    startingFrom: 3000000,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
    color: 'from-fuchsia-500 to-purple-500',
  },
];

export function Services() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      <DocumentTitle title={t('services.title')} />

      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 container-narrow text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">خدمات ما</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-primary mb-4">{t('services.title')}</h1>
          <p className="text-lg text-text max-w-xl mx-auto">{t('services.subtitle')}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to="/discover"
              className={`group block bg-surface rounded-3xl overflow-hidden border border-border-light hover:shadow-xl hover:-translate-y-1 transition-all duration-500 opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={t(service.titleKey)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                  {t(service.titleKey)}
                </h3>
                <p className="text-sm text-text mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-light">{t('services.startingFrom')}</p>
                    <p className="font-bold text-secondary">
                      {service.startingFrom.toLocaleString()} <span className="text-xs font-normal text-text-light">{t('common.toman')}</span>
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-[2rem] p-12 sm:p-16 text-center" style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 bg-secondary rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-blue-500 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                {t('about.contact')}
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
                {t('about.subtitle')}
              </p>
              <Link to="/register">
                <Button size="lg">
                  {t('home.hero.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
