'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { Sparkles, Grid3X3, Cpu } from 'lucide-react'

interface AnimatedStatProps {
  value: number
  label: string
  icon: React.ReactNode
  delay?: number
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({
  value,
  label,
  icon,
  delay = 0
}) => {
  const ref = useRef(null)
  const motionValue = useMotionValue(0)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration: 2,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest))
        }
      })

      return controls.stop
    }
  }, [isInView, value, delay, motionValue])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      className="group"
    >
      {/* Glassmorphism Card */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500" />

        {/* Main card */}
        <div className="relative backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 min-h-[220px] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          {/* Icon */}
          <motion.div
            className="w-12 h-12 mx-auto mb-4 p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.div>

          {/* Animated number */}
          <div className="text-center">
            <div className="relative">
              <div
                className="absolute inset-0 blur-2xl opacity-30"
                style={{
                  background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
                }}
              />
              <motion.div
                className="relative text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                key={displayValue}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {displayValue}
              </motion.div>
            </div>

            {/* Label */}
            <motion.div
              className="text-sm text-gray-600 mt-2 font-medium"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: delay + 0.3 }}
            >
              {label}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface AnimatedStatsSectionProps {
  stats: Array<{
    value: number
    label: string
  }>
}

export const AnimatedStatsSection: React.FC<AnimatedStatsSectionProps> = ({ stats }) => {
  const icons = [
    <Sparkles key="sparkles" className="w-6 h-6" />,
    <Grid3X3 key="grid" className="w-6 h-6" />,
    <Cpu key="cpu" className="w-6 h-6" />
  ]

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 auto-rows-fr">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={icons[index] || <Sparkles className="w-6 h-6" />}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AnimatedStatsSection