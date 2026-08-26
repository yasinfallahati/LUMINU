import { useState, useMemo } from 'react';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { DocumentTitle } from '../components/DocumentTitle';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PhotographerCard } from '../components/ui/PhotographerCard';
import { ProjectCard } from '../components/ui/ProjectCard';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../contexts/DataContext';
import { useI18n } from '../i18n/I18nContext';

type SearchTab = 'all' | 'photographers' | 'projects';

export function Search() {
  const { t } = useI18n();
  const { photographers, projects } = useData();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const cities = ['', 'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز'];
  const categories = ['', 'عکاسی عروسی', 'عکاسی پرتره', 'عکاسی مد', 'عکاسی طبیعت', 'عکاسی محصول'];

  const filteredPhotographers = useMemo(() => {
    if (!query && !selectedCity) return [];
    return photographers.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.includes(query) ||
        p.bio?.includes(query) ||
        p.specialties?.some((s) => s.includes(query));
      const matchesCity = !selectedCity || p.city === selectedCity;
      return matchesQuery && matchesCity;
    });
  }, [photographers, query, selectedCity]);

  const filteredProjects = useMemo(() => {
    if (!query && !selectedCategory) return [];
    return projects.filter((p) => {
      const matchesQuery =
        !query ||
        p.title.includes(query) ||
        p.description.includes(query);
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [projects, query, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedCategory('');
  };

  const hasActiveFilters = selectedCity || selectedCategory;

  return (
    <div className="min-h-screen">
      <DocumentTitle title={t('search.title')} />

      <section className="bg-primary py-12">
        <div className="container-wide">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">{t('search.title')}</h1>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 text-primary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="section-padding container-wide">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(['all', 'photographers', 'projects'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-surface text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'all' ? t('common.all') : tab === 'photographers' ? t('nav.discover') : t('dashboard.projects')}
              </button>
            ))}
          </div>
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="w-4 h-4" />
            {t('search.filters')}
          </Button>
        </div>

        {showFilters && (
          <Card padding="lg" className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary">{t('search.filters')}</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4" />
                  پاک کردن
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('search.location')}</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <option value="">{t('common.all')}</option>
                  {cities.filter(Boolean).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('search.categories')}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <option value="">{t('common.all')}</option>
                  {categories.filter(Boolean).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        )}

        <>
          {(activeTab === 'all' || activeTab === 'photographers') && filteredPhotographers.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-primary mb-4">{t('nav.discover')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotographers.map((photographer) => (
                  <PhotographerCard
                    key={photographer.id}
                    id={photographer.id}
                    name={photographer.name}
                    avatar={photographer.avatar || ''}
                    city={photographer.city || ''}
                    rating={photographer.rating || 0}
                    reviewCount={photographer.reviewCount || 0}
                    specialties={photographer.specialties || []}
                    priceRange={photographer.priceRange}
                  />
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'projects') && filteredProjects.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">{t('dashboard.projects')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const photographer = photographers.find((p) => p.id === project.photographerId);
                  return (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      coverImage={project.images[0] || ''}
                      category={project.category}
                      likes={project.likes}
                      views={project.views}
                      photographerName={photographer?.name || ''}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {filteredPhotographers.length === 0 && filteredProjects.length === 0 && (query || hasActiveFilters) && (
            <EmptyState
              variant="search"
              title={t('search.noResults')}
              description={t('empty.tryDifferentFilter')}
            />
          )}

          {!query && !hasActiveFilters && (
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t('search.placeholder')}</p>
            </div>
          )}
        </>
      </section>
    </div>
  );
}
