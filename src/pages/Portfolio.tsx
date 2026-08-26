import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, ChevronLeft } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ProjectCard } from '../components/ui/ProjectCard';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { DocumentTitle } from '../components/DocumentTitle';

export function Portfolio() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { photographers, getPhotographerProjects, getUserReviews } = useData();
  const [isLoading, setIsLoading] = useState(true);

  const photographer = photographers.find((p) => p.id === id);
  const projects = getPhotographerProjects(id || '');
  const reviews = getUserReviews(id || '');

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="min-h-screen">
        <DocumentTitle title={t('error.notFound')} />
        <EmptyState
          variant="search"
          title={t('profile.notFound')}
          description={t('error.notFoundMessage')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DocumentTitle title={`${t('portfolio.title')} - ${photographer.name}`} />

      <section className="relative h-[40vh] min-h-[300px]">
        <img
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 photo-overlay" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-wide pb-8">
            <Link
              to={`/photographer/${id}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('common.back')}
            </Link>
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <Avatar
                src={photographer.avatar}
                alt={photographer.name}
                fallback={photographer.name}
                size="xl"
                className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/20"
              />
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{photographer.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {photographer.city}
                  </span>
                  {avgRating > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-secondary fill-secondary" />
                      {avgRating.toFixed(1)}
                      <span className="text-white/60">({reviews.length} {t('profile.reviews')})</span>
                    </span>
                  )}
                </div>
              </div>
              <Link to={`/photographer/${id}`}>
                <Button variant="secondary">
                  {t('profile.contact')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding container-wide">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">{t('portfolio.title')}</h2>
            <p className="text-gray-500">{projects.length} {t('dashboard.projects')}</p>
          </div>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            variant="folder"
            title={t('portfolio.noProjects')}
            description={t('profile.noProjects')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                      coverImage={project.images[0] || ''}
                category={project.category}
                likes={project.likes}
                views={project.views}
                photographerName={photographer.name}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
