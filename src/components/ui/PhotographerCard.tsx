import { Link } from 'react-router-dom';
import { MapPin, Star, Heart } from 'lucide-react';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { useState } from 'react';

interface PhotographerCardProps {
  id: string;
  name: string;
  avatar: string;
  city: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  priceRange?: { min: number; max: number };
  coverImage?: string;
}

export function PhotographerCard({
  id,
  name,
  avatar,
  city,
  rating,
  reviewCount,
  specialties,
  priceRange,
  coverImage,
}: PhotographerCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <Link to={`/photographer/${id}`} className="group block">
      <div className="bg-surface rounded-3xl overflow-hidden border border-border-light transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
        {coverImage && (
          <div className="relative h-52 overflow-hidden">
            <img
              src={coverImage}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <button
              onClick={(e) => {
                e.preventDefault();
                setLiked(!liked);
              }}
              className={`absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                liked
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-accent'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}
        <div className={`p-6 ${coverImage ? '-mt-12 relative z-10' : ''}`}>
          <div className="flex items-start gap-4">
            <div className={coverImage ? 'mt-0' : 'mt-0'}>
              <Avatar src={avatar} alt={name} fallback={name} size="lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-primary tracking-tight group-hover:text-secondary transition-colors duration-300">
                {name}
              </h3>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-text">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {city}
                </span>
                {rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {rating.toFixed(1)}
                    <span className="text-text-light">({reviewCount})</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="neutral" size="sm">
                {specialty}
              </Badge>
            ))}
          </div>

          {priceRange && (
            <div className="mt-4 pt-4 border-t border-border-light">
              <p className="text-sm font-medium text-primary">
                از {priceRange.min.toLocaleString()} تا {priceRange.max.toLocaleString()} <span className="text-text-light font-normal">تومان</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
