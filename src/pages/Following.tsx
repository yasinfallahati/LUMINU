import { useState } from 'react';
import { UserMinus } from 'lucide-react';
import { DocumentTitle } from '../components/DocumentTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/EmptyState';
import { SectionTitle } from '../components/ui/SectionTitle';
import { useData } from '../contexts/DataContext';
import { useI18n } from '../i18n/I18nContext';
import { MapPin, Star } from 'lucide-react';

export function Following() {
  const { t } = useI18n();
  const { photographers } = useData();
  const [followingIds, setFollowingIds] = useState<string[]>(['p1', 'p2']);

  const followingPhotographers = photographers.filter((p) => followingIds.includes(p.id));

  const toggleFollow = (id: string) => {
    setFollowingIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <DocumentTitle title={t('following.title')} />

      <div className="bg-white border-b border-border-light">
        <div className="container-wide py-8">
          <SectionTitle title={t('following.title')} subtitle={`${followingPhotographers.length} ${t('following.following')}`} />
        </div>
      </div>

      <div className="container-wide py-8">
        {followingPhotographers.length === 0 ? (
          <EmptyState
            variant="heart"
            title={t('following.empty')}
            description={t('following.follow')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followingPhotographers.map((photographer) => (
              <Card key={photographer.id} padding="lg" hover={false}>
                <div className="flex items-start gap-4">
                  <Avatar
                    src={photographer.avatar}
                    alt={photographer.name}
                    fallback={photographer.name}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary truncate">{photographer.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {photographer.city}
                      </span>
                      {photographer.rating && photographer.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-secondary fill-secondary" />
                          {photographer.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {photographer.specialties?.slice(0, 2).map((specialty) => (
                        <Badge key={specialty} variant="neutral" size="sm">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleFollow(photographer.id)}
                    icon={<UserMinus className="w-4 h-4" />}
                  >
                    {t('following.unfollow')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
