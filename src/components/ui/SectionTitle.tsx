interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
}

export function SectionTitle({ title, subtitle, action, align = 'left' }: SectionTitleProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${
        align === 'center' ? 'text-center items-center' : ''
      }`}
    >
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-text text-lg font-light">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
