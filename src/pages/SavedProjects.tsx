import { DocumentTitle } from '../components/DocumentTitle';
import { ProjectCard } from '../components/ui/ProjectCard';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../contexts/DataContext';
import { useI18n } from '../i18n/I18nContext';
import { Bookmark } from 'lucide-react';

export function SavedProjects() {
  const { t } = useI18n();
  const { projects, photographers } = useData();

  const savedProjects = projects.slice(0, 2);

  return (
    <div className="min-h-screen bg-surface-alt">
      <DocumentTitle title={t('savedProjects.title')} />

      <div className="bg-white border-b border-border-light">
        <div className="container-wide py-8">
          <h1 className="text-3xl font-bold text-primary">{t('savedProjects.title')}</h1>
          <p className="text-gray-500 mt-1">{savedProjects.length} {t('dashboard.projects')}</p>
        </div>
      </div>

      <div className="container-wide py-8">
        {savedProjects.length === 0 ? (
          <EmptyState
            variant="heart"
            title={t('savedProjects.empty')}
            description={t('savedProjects.save')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.map((project) => {
              const photographer = photographers.find((p) => p.id === project.photographerId);
              return (
                <div key={project.id} className="relative group">
                  <ProjectCard
                    id={project.id}
                    title={project.title}
                    coverImage={project.images[0] || ''}
                    category={project.category}
                    likes={project.likes}
                    views={project.views}
                    photographerName={photographer?.name || ''}
                  />
                  <button
                    className="absolute top-4 left-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title={t('savedProjects.remove')}
                  >
                    <Bookmark className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
