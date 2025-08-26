'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

interface AnimatedStatProps {
  value: number
  label: string
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export const AnimatedStat: React.FC<AnimatedStatProps> = ({
  value,
  label,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) => {
  const ref = useRef(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => {
    return decimals > 0 
      ? latest.toFixed(decimals)
      : Math.round(latest).toString()
  })
  
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  // Start with actual value to prevent flash of zeros
  const [displayValue, setDisplayValue] = useState(
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()
  )

  useEffect(() => {
    if (isInView) {
      // Reset to 0 for animation
      setDisplayValue('0')
      
      const controls = animate(motionValue, value, {
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom ease for smooth counting
        onUpdate: (latest) => {
          setDisplayValue(
            decimals > 0 
              ? latest.toFixed(decimals)
              : Math.round(latest).toString()
          )
        }
      })

      return controls.stop
    }
  }, [isInView, value, duration, delay, motionValue, decimals])

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay }}
      >
        {/* Glow effect behind number */}
        <div className="relative inline-block">
          <div 
            className="absolute inset-0 blur-2xl opacity-30"
            style={{
              background: 'radial-gradient(circle, #2299dd 0%, transparent 70%)',
            }}
          />
          
          {/* Animated number */}
          <div className="relative text-3xl lg:text-4xl font-bold text-foreground">
            <span className="inline-block">
              {prefix}
              <motion.span
                key={displayValue}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {displayValue}
              </motion.span>
              {suffix}
            </span>
          </div>
        </div>
        
        {/* Label */}
        <motion.div 
          className="text-sm text-neutral-400 mt-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          {label}
        </motion.div>
      </motion.div>
    </div>
  )
}

interface AnimatedStatsGridProps {
  stats: Array<{
    value: number
    label: string
    prefix?: string
    suffix?: string
    decimals?: number
  }>
  className?: string
}

export const AnimatedStatsGrid: React.FC<AnimatedStatsGridProps> = ({
  stats,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}>
      {stats.map((stat, index) => (
        <AnimatedStat
          key={stat.label}
          value={stat.value}
          label={stat.label}
          prefix={stat.prefix}
          suffix={stat.suffix}
          decimals={stat.decimals}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}

export default AnimatedStatsGrid