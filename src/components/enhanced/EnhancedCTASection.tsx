'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react'
import Image from 'next/image'

interface EnhancedCTASectionProps {
  title: string
  description: string
  primaryButtonText: string
  primaryButtonHref: string
  secondaryButtonText: string
  secondaryButtonHref: string
  iconSrc?: string
  iconAlt?: string
}

export const EnhancedCTASection: React.FC<EnhancedCTASectionProps> = ({
  title,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  iconSrc,
  iconAlt = "CTA Icon"
}) => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

      {/* Animated background pattern */}
      <div className="absolute inset-0">
        {/* Floating shapes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm" />
          </motion.div>
        ))}

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container relative">
        <div className="max-w-6xl mx-auto">
          {/* Glassmorphism container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />

            {/* Main glassmorphism card */}
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-8 items-center">

                {/* Content */}
                <div className="md:col-span-2 space-y-6">
                  {/* Title with gradient text */}
                  <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight"
                  >
                    {title}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-gray-300 text-lg leading-relaxed"
                  >
                    {description}
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    {/* Primary button */}
                    <Link href={primaryButtonHref}>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                      >
                        {/* Button glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

                        <span className="relative">{primaryButtonText}</span>
                        <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>

                    {/* Secondary button */}
                    <Link href={secondaryButtonHref}>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                      >
                        <span>{secondaryButtonText}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Feature highlights */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap gap-6 pt-4"
                  >
                    <div className="flex items-center gap-2 text-gray-300">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">Sofort umsetzbar</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Target className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Praxiserprobt</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Community-getrieben</span>
                    </div>
                  </motion.div>
                </div>

                {/* Animated icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="relative mx-auto"
                >
                  {/* Glow behind icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-2xl"
                  />

                  {/* Icon container with float animation */}
                  <motion.div
                    animate={{
                      y: [-10, 10, -10],
                      rotate: [-5, 5, -5],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative w-32 h-32 md:w-40 md:h-40 p-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl"
                  >
                    {iconSrc ? (
                      <Image
                        src={iconSrc}
                        alt={iconAlt}
                        fill
                        className="object-contain opacity-90 brightness-0 invert"
                      />
                    ) : (
                      <Target className="w-full h-full text-white opacity-90" />
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default EnhancedCTASection