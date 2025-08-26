'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils/utils'

interface GlowingButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  glowColor?: string
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glowColor,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  className,
  ...props
}) => {
  // Define color schemes
  const colorSchemes = {
    primary: {
      base: 'bg-primary text-primary-foreground hover:bg-primary/90',
      glow: glowColor || 'rgb(34, 153, 221)',
      gradient: 'from-primary-400 to-primary-600',
    },
    secondary: {
      base: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      glow: glowColor || 'rgb(156, 163, 175)',
      gradient: 'from-neutral-700 to-neutral-900',
    },
    danger: {
      base: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      glow: glowColor || 'rgb(239, 68, 68)',
      gradient: 'from-red-400 to-red-600',
    },
    success: {
      base: 'bg-green-600 text-white hover:bg-green-700',
      glow: glowColor || 'rgb(34, 197, 94)',
      gradient: 'from-green-400 to-green-600',
    },
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const scheme = colorSchemes[variant]
  const isDisabled = disabled || loading

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={cn(
        'relative group overflow-hidden rounded-lg font-medium transition-all duration-300',
        scheme.base,
        sizeClasses[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Glow effect background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${scheme.glow}40 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Animated gradient background */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          `bg-gradient-to-r ${scheme.gradient}`
        )}
        style={{
          backgroundSize: '200% 100%',
          animation: 'shimmer-button 2s linear infinite',
        }}
      />

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
        <div
          className="absolute inset-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      </div>

      {/* Border glow */}
      <div
        className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(45deg, ${scheme.glow}, transparent, ${scheme.glow})`,
          filter: 'blur(2px)',
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
          </>
        )}
      </span>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{ scale: 0 }}
        whileTap={
          !isDisabled
            ? {
                scale: [0, 1.5],
                opacity: [0.4, 0],
                transition: { duration: 0.6 },
              }
            : {}
        }
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${scheme.glow}40 0%, transparent 70%)`,
          }}
        />
      </motion.div>

    </motion.button>
  )
}

export default GlowingButton