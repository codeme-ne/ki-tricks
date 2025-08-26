import { Check } from 'lucide-react';
import { CheckboxProps } from '@/lib/types/types';
import { cn } from '@/lib/utils/utils';

export function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = ''
}: CheckboxProps) {
  const id = `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only" // Visually hide the input but keep it accessible
      />
      <label
        htmlFor={id}
        className={cn(
          'flex items-center gap-3 group cursor-pointer',
          { 'opacity-50 cursor-not-allowed': disabled }
        )}
      >
        <div 
          className={cn(
            'w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200',
            'border-input group-hover:border-primary',
            { 'bg-primary border-primary': checked }
          )}
          aria-hidden="true" // Hide the decorative box from screen readers
        >
          {checked && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
        </div>
        <span className={cn(
          'text-base text-foreground/80 group-hover:text-foreground transition-colors duration-200 select-none',
          { 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }
        )}>
          {label}
        </span>
      </label>
    </div>
  );
}