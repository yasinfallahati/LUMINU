import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, DollarSign, Calendar } from 'lucide-react';
import { DocumentTitle } from '../components/DocumentTitle';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionTitle } from '../components/ui/SectionTitle';
import { EmptyState } from '../components/EmptyState';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { jobApi } from '../services/api';
import { formatDate } from '../utils/format';
import type { Proposal } from '../services/jobs';

export function Proposals() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const { jobs } = await jobApi.getAll();
      const allProposals: Proposal[] = [];
      for (const job of jobs) {
        try {
          const { proposals: jobProposals } = await jobApi.getProposals(job.id);
          allProposals.push(...jobProposals.filter((p: Proposal) =>
            user?.role === 'photographer' ? p.photographerId === user?.id : true
          ));
        } catch {}
      }
      setProposals(allProposals);
    } catch {}
    setLoading(false);
  };

  const filteredProposals = filter === 'all'
    ? proposals
    : proposals.filter((p) => p.status === filter);

  const getStatusBadge = (status: Proposal['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" size="sm">{t('proposals.pending')}</Badge>;
      case 'accepted':
        return <Badge variant="success" size="sm">{t('proposals.accepted')}</Badge>;
      case 'rejected':
        return <Badge variant="error" size="sm">{t('proposals.rejected')}</Badge>;
    }
  };

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <DocumentTitle title={t('proposals.title')} />

      <div className="bg-white border-b border-border-light">
        <div className="container-wide py-8">
          <SectionTitle title={t('proposals.title')} subtitle={`${proposals.length} ${t('jobs.proposals')}`} />
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? t('common.all') : status === 'pending' ? t('proposals.pending') : status === 'accepted' ? t('proposals.accepted') : t('proposals.rejected')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} padding="lg" hover={false}>
                <div className="animate-pulse flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredProposals.length === 0 ? (
          <EmptyState
            variant="inbox"
            title={t('proposals.empty')}
            description={t('jobs.noJobs')}
          />
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => (
              <Card key={proposal.id} padding="lg" hover={false}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(proposal.status)}
                    <div>
                      <h3 className="font-bold text-primary mb-1">پروژه عکاسی</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{proposal.coverLetter}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {t('proposals.budget')}: {proposal.proposedBudget.toLocaleString()} {t('common.toman')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {t('proposals.timeline')}: {proposal.proposedTimeline} روز
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {t('proposals.submittedAt')}: {formatDate(proposal.createdAt)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(proposal.status)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
