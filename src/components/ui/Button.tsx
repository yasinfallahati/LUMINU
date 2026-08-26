import { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: ReactNode;
}

const variantStyles = {
  primary: 'text-white shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 hover:-translate-y-0.5',
  secondary: 'bg-surface text-primary border border-border hover:border-secondary hover:text-secondary hover:shadow-lg hover:-translate-y-0.5',
  ghost: 'bg-transparent text-gray-500 hover:text-primary hover:bg-gray-100/50',
  danger: 'bg-error text-white hover:bg-red-600 shadow-lg shadow-error/20 hover:-translate-y-0.5',
};

const sizeStyles = {
  sm: 'px-5 py-2.5 text-sm rounded-xl',
  md: 'px-7 py-3.5 text-base rounded-xl',
  lg: 'px-9 py-4.5 text-lg rounded-2xl',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2.5 font-semibold
        transition-all duration-300 ease-out
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        active:scale-[0.97]
        ${variant === 'primary' ? 'gradient-primary' : ''}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon}
      {children}
    </button>
  );
}
