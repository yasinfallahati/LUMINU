import { type ReactNode } from 'react';
import { Search, Inbox, Heart, Calendar, Star, FolderOpen } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

type EmptyStateVariant = 'search' | 'inbox' | 'heart' | 'calendar' | 'star' | 'folder' | 'default';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
  className?: string;
}

const variantConfig: Record<EmptyStateVariant, { icon: ReactNode; defaultTitle: string; defaultDescription: string }> = {
  search: {
    icon: <Search className="w-8 h-8" />,
    defaultTitle: 'common.noResults',
    defaultDescription: 'empty.tryDifferentFilter',
  },
  inbox: {
    icon: <Inbox className="w-8 h-8" />,
    defaultTitle: 'common.empty',
    defaultDescription: 'empty.noData',
  },
  heart: {
    icon: <Heart className="w-8 h-8" />,
    defaultTitle: 'common.empty',
    defaultDescription: 'empty.noData',
  },
  calendar: {
    icon: <Calendar className="w-8 h-8" />,
    defaultTitle: 'common.empty',
    defaultDescription: 'empty.noData',
  },
  star: {
    icon: <Star className="w-8 h-8" />,
    defaultTitle: 'common.empty',
    defaultDescription: 'empty.noData',
  },
  folder: {
    icon: <FolderOpen className="w-8 h-8" />,
    defaultTitle: 'common.empty',
    defaultDescription: 'empty.noData',
  },
  default: {
    icon: <Inbox className="w-8 h-8" />,
    defaultTitle: 'common.empty',
    defaultDescription: 'empty.noData',
  },
};

export function EmptyState({
  variant = 'default',
  title,
  description,
  action,
  icon,
  className = '',
}: EmptyStateProps) {
  const { t } = useI18n();
  const config = variantConfig[variant];

  return (
    <div className={cn('text-center py-16 px-4', className)}>
      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400">
        {icon || config.icon}
      </div>
      <h3 className="text-lg font-bold text-primary mb-2">
        {title || t(config.defaultTitle)}
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description || t(config.defaultDescription)}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="secondary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
