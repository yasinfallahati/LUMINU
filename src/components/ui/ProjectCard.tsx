import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Badge } from './Badge';

interface ProjectCardProps {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  likes: number;
  views: number;
  photographerName: string;
}

export function ProjectCard({
  id,
  title,
  coverImage,
  category,
  likes,
  views,
  photographerName,
}: ProjectCardProps) {
  return (
    <Link to={`/project/${id}`} className="group block">
      <div className="bg-surface rounded-3xl overflow-hidden border border-border-light transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 right-4">
            <Badge variant="neutral" size="sm" className="bg-white/90 backdrop-blur-md border-white/20">
              {category}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-white text-sm font-medium">{photographerName}</p>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-base font-bold text-primary group-hover:text-secondary transition-colors duration-300 line-clamp-1 tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-5 mt-4 text-sm text-text">
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              {likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {views.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
