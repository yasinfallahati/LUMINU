import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, MapPin, Calendar, ChevronRight, Share2, Bookmark } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { ImageGallery } from '../components/ImageGallery';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { DocumentTitle } from '../components/DocumentTitle';
import { ProjectCard } from '../components/ui/ProjectCard';
import { formatDate } from '../utils/format';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { projects, photographers } = useData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const project = projects.find((p) => p.id === id);
  const photographer = photographers.find((p) => p.id === project?.photographerId);

  const relatedProjects = projects
    .filter((p) => p.id !== id && p.category === project?.category)
    .slice(0, 3);

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

  if (!project) {
    return (
      <div className="min-h-screen">
        <DocumentTitle title={t('error.notFound')} />
        <EmptyState
          variant="search"
          title={t('projectDetail.notFound')}
          description={t('error.notFoundMessage')}
          action={{ label: t('error.goHome'), onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      <DocumentTitle title={project.title} />

      <div className="bg-primary text-white py-6">
        <div className="container-wide">
          <Link
            to={photographer ? `/photographer/${photographer.id}` : '/discover'}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            {t('common.back')}
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <Badge variant="info" size="sm" className="mb-2">{project.category}</Badge>
              <h1 className="text-2xl md:text-3xl font-bold">{project.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(project.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {project.views.toLocaleString()} {t('portfolio.views')}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {project.likes.toLocaleString()} {t('portfolio.likes')}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsSaved(!isSaved)}
                icon={isSaved ? <Bookmark className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
              >
                {isSaved ? t('savedProjects.remove') : t('savedProjects.save')}
              </Button>
              <Button variant="secondary" icon={<Share2 className="w-4 h-4" />}>
                {t('common.view')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="none" className="overflow-hidden">
              <ImageGallery images={project.images} alt={project.title} className="grid-cols-1" />
            </Card>

            <Card padding="lg">
              <h2 className="text-xl font-bold text-primary mb-4">{t('projectDetail.description')}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{project.description}</p>
            </Card>
          </div>

          <div className="space-y-6">
            {photographer && (
              <Card padding="lg">
                <h2 className="text-lg font-bold text-primary mb-4">{t('projectDetail.photographer')}</h2>
                <Link
                  to={`/photographer/${photographer.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-alt transition-colors"
                >
                  <Avatar src={photographer.avatar} alt={photographer.name} fallback={photographer.name} size="lg" />
                  <div>
                    <p className="font-bold text-primary">{photographer.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {photographer.city}
                    </p>
                  </div>
                </Link>
                <Link to={`/photographer/${photographer.id}`} className="block mt-4">
                  <Button variant="secondary" className="w-full">
                    {t('profile.portfolio')}
                  </Button>
                </Link>
              </Card>
            )}

            <Card padding="lg">
              <h2 className="text-lg font-bold text-primary mb-4">{t('projectDetail.category')}</h2>
              <Badge variant="info">{project.category}</Badge>
            </Card>
          </div>
        </div>

        {relatedProjects.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-primary mb-6">{t('projectDetail.relatedProjects')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject) => {
                const relatedPhotographer = photographers.find((p) => p.id === relatedProject.photographerId);
                return (
                  <ProjectCard
                    key={relatedProject.id}
                    id={relatedProject.id}
                    title={relatedProject.title}
                      coverImage={relatedProject.images[0] || ''}
                    category={relatedProject.category}
                    likes={relatedProject.likes}
                    views={relatedProject.views}
                    photographerName={relatedPhotographer?.name || ''}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
