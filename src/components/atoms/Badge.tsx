import { BadgeProps } from '@/lib/types/types'
import { cn } from '@/lib/utils/utils'

export function Badge({
  variant = 'neutral',
  children,
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border';

  const variantClasses = {
    neutral: 'bg-neutral-700/50 border-neutral-600/80 text-neutral-300',
    primary: 'bg-primary-600/20 border-primary-500/30 text-primary-300',
    success: 'bg-green-600/20 border-green-500/30 text-green-300',
    warning: 'bg-amber-600/20 border-amber-500/30 text-amber-300',
    danger: 'bg-red-600/20 border-red-500/30 text-red-300',
    info: 'bg-blue-600/20 border-blue-500/30 text-blue-300',
    // Harmonische NEU-Badge: Blau-Gradient mit subtilen Effekten
  new: 'relative bg-gradient-to-r from-primary/80 via-primary to-primary/90 border-primary/30 text-primary-foreground font-bold px-3 py-1.5 text-sm hover:rotate-0 transition-all duration-300 new-badge-glow new-badge-minimal',
    // Alternative: Dezentere NEU-Badge ohne starke Effekte
  'new-subtle': 'bg-primary border-primary/20 text-primary-foreground font-semibold px-3 py-1.5 text-sm backdrop-blur-sm shadow-md shadow-primary/20',
  };
  
  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  )
}