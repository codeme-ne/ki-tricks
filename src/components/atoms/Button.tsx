'use client'

import { ButtonProps } from '@/lib/types/types'
import { cn } from '@/lib/utils/utils'
import Link from 'next/link'

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 focus:ring-neutral-500',
    outline: 'bg-transparent text-neutral-700 border border-neutral-300 hover:bg-neutral-50 focus:ring-neutral-500',
    text: 'text-primary-600 hover:text-primary-700 hover:bg-primary-50',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm sm:px-4',
    lg: 'px-4 py-3 text-sm sm:px-6 sm:text-base',
  }
  
  // Mobile-optimierte Klassen für bessere Touch-Targets und deutsche Texte
  const mobileOptimizedClasses = 'min-h-[44px] min-w-[44px] hyphens-auto'
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    mobileOptimizedClasses,
    disabledClasses,
    className
  )
  
  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    )
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </button>
  )
}