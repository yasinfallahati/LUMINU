import { useState } from 'react';
import { Star, Plus, ThumbsUp, MessageSquare } from 'lucide-react';
import { DocumentTitle } from '../components/DocumentTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { formatDate } from '../utils/format';

export function Reviews() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { reviews, addReview, photographers } = useData();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedPhotographer, setSelectedPhotographer] = useState('');

  const userReviews = reviews.filter((r) => r.clientId === user?.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhotographer || rating === 0) return;

    addReview({
      clientId: user?.id || '',
      photographerId: selectedPhotographer,
      rating,
      comment,
    });

    setShowWriteReview(false);
    setRating(0);
    setComment('');
    setSelectedPhotographer('');
  };

  const renderStars = (value: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (interactive ? (hoveredRating || rating) : value)
                  ? 'text-secondary fill-secondary'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <DocumentTitle title={t('reviews.title')} />

      <div className="bg-white border-b border-border-light">
        <div className="container-wide py-8">
          <div className="flex items-center justify-between">
            <SectionTitle title={t('reviews.title')} subtitle={`${userReviews.length} ${t('reviews.title')}`} />
            <Button onClick={() => setShowWriteReview(true)} icon={<Plus className="w-4 h-4" />}>
              {t('reviews.writeReview')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        {userReviews.length === 0 ? (
          <EmptyState
            variant="star"
            title={t('reviews.empty')}
            description={t('reviews.writeReview')}
            action={{ label: t('reviews.writeReview'), onClick: () => setShowWriteReview(true) }}
          />
        ) : (
          <div className="space-y-4">
            {userReviews.map((review) => {
              const photographer = photographers.find((p) => p.id === review.photographerId);
              return (
                <Card key={review.id} padding="lg" hover={false}>
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={photographer?.avatar}
                      alt={photographer?.name}
                      fallback={photographer?.name || ''}
                      size="lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-primary">{photographer?.name}</h3>
                          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-secondary transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          مفید
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-secondary transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          پاسخ
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        title={t('reviews.writeReview')}
        size="md"
      >
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('nav.discover')}
            </label>
            <select
              value={selectedPhotographer}
              onChange={(e) => setSelectedPhotographer(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              <option value="">انتخاب عکاس</option>
              {photographers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reviews.rating')}
            </label>
            {renderStars(rating, true)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reviews.comment')}
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="نظر خود را بنویسید..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              {t('reviews.submit')}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowWriteReview(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
