import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, MessageSquare, Calendar, ChevronLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ProjectCard } from '../components/ui/ProjectCard';
import { SectionTitle } from '../components/ui/SectionTitle';
import { BookingModal } from '../components/BookingModal';

export function PhotographerProfile() {
  const { id } = useParams<{ id: string }>();
  const { photographers, getPhotographerProjects, getUserReviews, createChat, fetchReviews } = useData();
  const { user } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const photographer = photographers.find(p => p.id === id);
  const projects = getPhotographerProjects(id || '');
  const reviews = getUserReviews(id || '');

  useEffect(() => {
    if (id) fetchReviews(id);
  }, [id]);

  if (!photographer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">عکاسی یافت نشد</h2>
          <Link to="/discover" className="text-secondary hover:text-secondary-dark">
            بازگشت به صفحه جستجو
          </Link>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleStartChat = async () => {
    if (!user || !id) return;
    await createChat(id);
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] min-h-[500px]">
        <img
          src={photographer.id === 'p1'
            ? 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'
            : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
          }
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 photo-overlay" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-wide pb-10">
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              بازگشت
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
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                  {photographer.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/70">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {photographer.city}
                  </span>
                  {reviews.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-secondary fill-secondary" />
                      {avgRating}
                      <span className="text-white/50">({reviews.length} نظر)</span>
                    </span>
                  )}
                </div>
              </div>
              {user && user.role === 'client' && (
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={handleStartChat}>
                    <MessageSquare className="w-4 h-4" />
                    پیام
                  </Button>
                  <Button onClick={() => setShowBookingModal(true)}>
                    <Calendar className="w-4 h-4" />
                    رزرو
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        photographerId={id || ''}
        photographerName={photographer.name}
      />

      <section className="section-padding container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-3xl p-8 border border-border-light">
              <h3 className="text-xl font-bold text-primary mb-4 tracking-tight">درباره من</h3>
              <p className="text-text leading-relaxed whitespace-pre-line">
                {photographer.bio || 'بیوگرافی ثبت نشده است.'}
              </p>
            </div>

            <div>
              <SectionTitle title="نمونه کارها" subtitle={`${projects.length} پروژه`} />
              {projects.length === 0 ? (
                <div className="bg-surface rounded-3xl p-12 text-center border border-border-light">
                  <p className="text-text">هنوز نمونه کاری آپلود نشده است.</p>
                </div>
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
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface rounded-3xl p-7 border border-border-light">
              <h3 className="text-lg font-bold text-primary mb-5 tracking-tight">اطلاعات</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-text mb-2">تخصص‌ها</p>
                  <div className="flex flex-wrap gap-2">
                    {photographer.specialties?.map((specialty) => (
                      <Badge key={specialty} variant="neutral">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                {photographer.priceRange && (
                  <div>
                    <p className="text-sm text-text mb-1.5">رنج قیمت</p>
                    <p className="font-medium text-primary">
                      {photographer.priceRange.min.toLocaleString()} - {photographer.priceRange.max.toLocaleString()} تومان
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-surface rounded-3xl p-7 border border-border-light">
              <h3 className="text-lg font-bold text-primary mb-5 tracking-tight">نظرات</h3>
              {reviews.length === 0 ? (
                <p className="text-text text-sm">هنوز نظری ثبت نشده است.</p>
              ) : (
                <div className="space-y-5">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="pb-5 border-b border-border-light last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-secondary fill-secondary' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-text leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
