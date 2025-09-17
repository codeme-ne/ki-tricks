'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Download, Sparkles, CheckCircle, ArrowRight } from 'lucide-react'
import { trackEmailSignup } from '@/lib/analytics'

interface NewsletterSignupProps {
  variant?: 'default' | 'sidebar' | 'modal' | 'footer'
  leadMagnet?: {
    title: string
    description: string
    downloadText: string
  }
  source?: string
  className?: string
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'default',
  leadMagnet = {
    title: 'Die 50 besten KI-Tricks (PDF)',
    description: 'Sofort anwendbare Workflows für mehr Produktivität',
    downloadText: 'Kostenlos herunterladen'
  },
  source = 'unknown',
  className = ''
}) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Call the Newsletter API
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
          leadMagnet: leadMagnet.title,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Fehler beim Anmelden')
      }

      // Track successful signup
      trackEmailSignup(source, leadMagnet.title)

      setIsSuccess(true)
      setEmail('')

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Fehler beim Anmelden. Bitte versuche es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const variants = {
    default: 'max-w-md mx-auto',
    sidebar: 'max-w-sm',
    modal: 'max-w-lg mx-auto',
    footer: 'max-w-xl mx-auto'
  }

  const sizes = {
    default: 'p-6',
    sidebar: 'p-4',
    modal: 'p-8',
    footer: 'p-6'
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${variants[variant]} ${sizes[variant]} ${className}`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Willkommen in der Community! 🎉
          </h3>

          <p className="text-gray-600 mb-4">
            Prüfe deine E-Mails für den Download-Link und die ersten KI-Tricks.
          </p>

          <div className="text-sm text-gray-500">
            Keine E-Mail erhalten? Prüfe auch den Spam-Ordner.
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${variants[variant]} ${className}`}
    >
      {/* Glassmorphism container */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-60" />

        {/* Main card */}
        <div className={`relative backdrop-blur-md bg-white/90 border border-white/50 rounded-2xl shadow-xl ${sizes[variant]}`}>
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-12 h-12 mx-auto mb-4 p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
            >
              <Download className="w-6 h-6" />
            </motion.div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {leadMagnet.title}
            </h3>

            <p className="text-gray-600 text-sm">
              {leadMagnet.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>50 sofort anwendbare KI-Workflows</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Kategorisiert nach Anwendungsgebiet</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>Wöchentliche neue Tricks per E-Mail</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine-email@beispiel.de"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                disabled={isLoading}
              />
              <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{leadMagnet.downloadText}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Trust indicators */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Kostenlos • Keine Werbung • Jederzeit abmeldbar
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="flex text-yellow-400">
                {"★".repeat(5)}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                4.8/5 von 100+ Nutzern
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NewsletterSignup