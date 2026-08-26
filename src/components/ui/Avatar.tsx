interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

const sizeStyles = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-24 h-24 text-2xl',
};

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-300',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
};

const statusSizes = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
  xl: 'w-5 h-5',
};

export function Avatar({ src, alt = '', fallback, size = 'md', status, className = '' }: AvatarProps) {
  const initials = fallback
    ? fallback
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
    : alt
      ? alt.slice(0, 2)
      : '?';

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`
            ${sizeStyles[size]}
            rounded-full object-cover border-2 border-white shadow-sm
          `}
        />
      ) : (
        <div
          className={`
            ${sizeStyles[size]}
            rounded-full bg-gradient-to-br from-gray-100 to-gray-200
            text-gray-600 font-semibold flex items-center justify-center
            border-2 border-white shadow-sm
          `}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full border-2 border-white
            ${statusColors[status]}
            ${statusSizes[size]}
          `}
        />
      )}
    </div>
  );
}
