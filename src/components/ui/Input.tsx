import { type ReactNode } from 'react';

interface InputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Input({
  label,
  error,
  hint,
  icon,
  iconPosition = 'right',
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className = '',
  id,
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const inputElement = (
    <div className="relative">
      {icon && iconPosition === 'right' && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
      {type === 'textarea' ? (
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={4}
          className={`
            w-full px-5 py-4 rounded-2xl border bg-surface text-primary
            placeholder-gray-400 transition-all duration-300 resize-none
            focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5
            disabled:bg-surface-alt disabled:text-gray-500 disabled:cursor-not-allowed
            ${icon && iconPosition === 'right' ? 'pr-12' : ''}
            ${icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${error ? 'border-error focus:ring-error/5' : 'border-border'}
            ${className}
          `}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-5 py-4 rounded-2xl border bg-surface text-primary
            placeholder-gray-400 transition-all duration-300
            focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5
            disabled:bg-surface-alt disabled:text-gray-500 disabled:cursor-not-allowed
            ${icon && iconPosition === 'right' ? 'pr-12' : ''}
            ${icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${error ? 'border-error focus:ring-error/5' : 'border-border'}
            ${className}
          `}
        />
      )}
      {icon && iconPosition === 'left' && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-primary">
          {label}
          {required && <span className="text-error mr-1.5">*</span>}
        </label>
      )}
      {inputElement}
      {error && <p className="text-sm text-error flex items-center gap-1.5">{error}</p>}
      {hint && !error && <p className="text-sm text-text">{hint}</p>}
    </div>
  );
}
