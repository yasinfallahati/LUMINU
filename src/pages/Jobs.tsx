import { DocumentTitle } from '../components/DocumentTitle';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionTitle } from '../components/ui/SectionTitle';
import { CardSkeleton } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { useI18n } from '../i18n/I18nContext';
import { Search, MapPin, Clock, Briefcase, DollarSign, ChevronLeft } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../services/api';
import type { Job } from '../services/jobs';

const CATEGORIES = ['همه', 'عکاسی عروسی', 'عکاسی پرتره', 'عکاسی مد', 'عکاسی طبیعت', 'عکاسی محصول', 'عکاسی رویداد'];

export function Jobs() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    jobApi.getAll().then(({ jobs }) => {
      setJobs(jobs);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCategory = selectedCategory === 'همه' || job.category === selectedCategory;
      const matchesSearch =
        job.title.includes(searchQuery) ||
        job.description.includes(searchQuery) ||
        job.location.includes(searchQuery);
      return matchesCategory && matchesSearch && job.status === 'open';
    });
  }, [jobs, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen">
      <DocumentTitle title={t('jobs.title')} />

      <section className="relative h-[35vh] min-h-[250px] flex items-center justify-center overflow-hidden bg-primary">
        <div className="relative z-10 container-narrow text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('jobs.title')}</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">{t('jobs.subtitle')}</p>
        </div>
      </section>

      <section className="section-padding container-wide">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('jobs.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-secondary text-primary'
                    : 'bg-surface text-gray-600 hover:bg-gray-100 border border-border'
                }`}
              >
                {category === 'همه' ? t('common.all') : category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            variant="search"
            action={{ label: t('empty.startExploring'), onClick: () => setSearchQuery('') }}
          />
        ) : (
          <div className="space-y-4">
            <SectionTitle
              title={`${filteredJobs.length} ${t('jobs.title')}`}
              subtitle={t('jobs.subtitle')}
            />
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const { t } = useI18n();

  return (
    <Card hover padding="lg">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {job.isUrgent && (
              <Badge variant="error" size="sm">
                {t('jobs.urgent')}
              </Badge>
            )}
            <Badge variant="info" size="sm">
              {job.category}
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-primary mb-2">{job.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{job.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {job.budget.toLocaleString()} {t('common.toman')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.deadline}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.proposalCount} {t('jobs.proposals')}
            </span>
          </div>
        </div>
        <Link to={`/jobs/${job.id}`} className="flex-shrink-0">
          <Button>
            {t('jobs.viewDetails')}
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
