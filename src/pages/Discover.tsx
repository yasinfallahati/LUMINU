import { useState, useEffect, lazy, Suspense } from 'react';
import { Search, SlidersHorizontal, Sparkles, MapPin, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { PhotographerCard } from '../components/ui/PhotographerCard';
import { Button } from '../components/ui/Button';
import { IRAN_CITIES } from '../utils/cities';

const PhotographerMap = lazy(() => import('../components/map/PhotographerMap').then(m => ({ default: m.PhotographerMap })));

const CITIES = IRAN_CITIES;

export function Discover() {
  const { photographers, getUserReviews, fetchPhotographers } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('همه');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handleSearch = () => {
    const params: { city?: string; search?: string } = {};
    if (selectedCity !== 'همه') params.city = selectedCity;
    if (searchQuery) params.search = searchQuery;
    fetchPhotographers(params);
  };

  useEffect(() => {
    handleSearch();
  }, [selectedCity]);

  const getAverageRating = (photographerId: string) => {
    const reviews = getUserReviews(photographerId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 container-narrow text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">کشف کنید</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-primary mb-4 tracking-tight">کشف عکاسان</h1>
          <p className="text-lg text-text max-w-xl mx-auto leading-relaxed">
            بهترین عکاسان را پیدا کنید و نمونه کارهایشان را ببینید
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="section-padding container-wide">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام یا تخصص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pr-12 pl-5 py-4 bg-surface border border-border rounded-2xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all duration-300 text-sm"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <SlidersHorizontal className="w-4 h-4" />
              فیلترها
              {selectedCity !== 'همه' && (
                <span className="w-2 h-2 rounded-full bg-secondary" />
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 p-6 bg-surface rounded-3xl border border-border-light animate-fade-in shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-sm font-semibold text-primary">انتخاب شهر</span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedCity === city
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'bg-surface-alt text-gray-600 hover:bg-gray-100 border border-border-light'
                    }`}
                  >
                    {city === 'همه' ? 'همه شهرها' : city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-primary">
              {photographers.length} عکاس یافت شد
            </h2>
            <p className="text-sm text-text mt-1">نتایج جستجو</p>
          </div>
          <div className="flex items-center gap-2 bg-surface border border-border-light rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              لیست
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              نقشه
            </button>
          </div>
        </div>

        {photographers.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-border-light">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-text text-lg font-medium mb-2">عکاسی با این مشخصات یافت نشد</p>
            <p className="text-text-light text-sm">فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-surface rounded-3xl border border-border-light overflow-hidden">
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center animate-pulse">
                  <MapIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            }>
              <PhotographerMap
                photographers={photographers.map(p => ({
                  ...p,
                  lat: p.city === 'تهران' ? 35.6892 + (Math.random() - 0.5) * 0.1 : undefined,
                  lng: p.city === 'تهران' ? 51.3890 + (Math.random() - 0.5) * 0.1 : undefined,
                }))}
                height="600px"
              />
            </Suspense>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photographers.map((photographer, index) => (
              <div key={photographer.id} className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}>
                <PhotographerCard
                  id={photographer.id}
                  name={photographer.name}
                  avatar={photographer.avatar || ''}
                  city={photographer.city || ''}
                  rating={getAverageRating(photographer.id)}
                  reviewCount={photographer.reviewCount || 0}
                  specialties={photographer.specialties || []}
                  priceRange={photographer.priceRange}
                  coverImage={
                    index === 0
                      ? 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
                      : index === 1
                      ? 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80'
                      : index === 2
                      ? 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80'
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
