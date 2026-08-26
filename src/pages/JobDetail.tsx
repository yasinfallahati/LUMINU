import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Briefcase, ChevronRight, Send, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { DocumentTitle } from '../components/DocumentTitle';
import { jobApi } from '../services/api';
import type { Job } from '../services/jobs';

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [proposalText, setProposalText] = useState('');
  const [proposalBudget, setProposalBudget] = useState('');
  const [proposalTimeline, setProposalTimeline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    jobApi.getById(id).then(({ job }) => {
      setJob(job);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [id]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) {
      navigate('/login');
      return;
    }
    setIsSubmitting(true);
    try {
      await jobApi.submitProposal(id, {
        coverLetter: proposalText,
        proposedBudget: Number(proposalBudget),
        proposedTimeline: Number(proposalTimeline),
      });
      setSubmitted(true);
    } catch {}
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen">
        <DocumentTitle title={t('error.notFound')} />
        <EmptyState
          variant="search"
          title={t('error.notFound')}
          description={t('error.notFoundMessage')}
          action={{ label: t('error.goHome'), onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      <DocumentTitle title={job.title} />

      <div className="bg-primary text-white py-8">
        <div className="container-wide">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            {t('common.back')}
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {job.isUrgent && <Badge variant="error" size="sm">{t('jobs.urgent')}</Badge>}
                <Badge variant="info" size="sm">{job.category}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {t('jobs.deadline')}: {job.deadline}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {job.proposalCount} {t('jobs.proposals')}
                </span>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-sm text-white/60 mb-1">{t('jobDetail.budget')}</p>
              <p className="text-2xl font-bold text-secondary">
                {job.budget.toLocaleString()} {t('common.toman')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <h2 className="text-xl font-bold text-primary mb-4">{t('jobDetail.description')}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </Card>

            {job.requirements && (
              <Card padding="lg">
                <h2 className="text-xl font-bold text-primary mb-4">{t('jobDetail.requirements')}</h2>
                <p className="text-gray-600 leading-relaxed">{job.requirements}</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card padding="lg">
              <h2 className="text-lg font-bold text-primary mb-4">{t('jobDetail.submitProposal')}</h2>
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="font-medium text-primary">{t('jobs.proposalSubmitted')}</p>
                </div>
              ) : user ? (
                <form onSubmit={handleSubmitProposal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('jobDetail.proposalPlaceholder')}
                    </label>
                    <textarea
                      rows={4}
                      value={proposalText}
                      onChange={(e) => setProposalText(e.target.value)}
                      placeholder={t('jobDetail.proposalPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                      required
                    />
                  </div>
                  <Input
                    label={t('jobDetail.proposalBudget')}
                    type="number"
                    value={proposalBudget}
                    onChange={setProposalBudget}
                    placeholder="0"
                    required
                  />
                  <Input
                    label={t('jobDetail.proposalTimeline')}
                    type="number"
                    value={proposalTimeline}
                    onChange={setProposalTimeline}
                    placeholder="تعداد روز"
                    required
                  />
                  <Button type="submit" loading={isSubmitting} className="w-full">
                    <Send className="w-4 h-4" />
                    {t('jobs.submitProposal')}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">{t('jobDetail.loginRequired')}</p>
                  <Link to="/login">
                    <Button className="w-full">{t('nav.login')}</Button>
                  </Link>
                </div>
              )}
            </Card>

            <Card padding="lg">
              <h2 className="text-lg font-bold text-primary mb-4">{t('jobDetail.clientInfo')}</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">{job.clientName[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-primary">{job.clientName}</p>
                  <p className="text-sm text-gray-500">{t('jobs.postedAt')}: {job.createdAt}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
