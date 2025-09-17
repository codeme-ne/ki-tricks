'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Gift } from 'lucide-react'
import { NewsletterSignup } from './NewsletterSignup'

interface FloatingNewsletterWidgetProps {
  delayMs?: number
  showAfterScrollPercent?: number
  source?: string
}

export const FloatingNewsletterWidget: React.FC<FloatingNewsletterWidgetProps> = ({
  delayMs = 30000, // Show after 30 seconds
  showAfterScrollPercent = 50, // Show after scrolling 50%
  source = 'floating_widget'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false)

  useEffect(() => {
    // Check if user has already seen this widget
    const dismissed = localStorage.getItem('newsletter_widget_dismissed')
    const lastShown = localStorage.getItem('newsletter_widget_last_shown')
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000

    if (dismissed === 'true' && lastShown && parseInt(lastShown) > oneDayAgo) {
      return
    }

    // Set up scroll tracking
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      if (scrolled >= showAfterScrollPercent) {
        setHasScrolledEnough(true)
      }
    }

    // Set up timer
    const timer = setTimeout(() => {
      if (hasScrolledEnough) {
        setIsVisible(true)
        localStorage.setItem('newsletter_widget_last_shown', Date.now().toString())
      }
    }, delayMs)

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [delayMs, showAfterScrollPercent, hasScrolledEnough])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('newsletter_widget_dismissed', 'true')
    localStorage.setItem('newsletter_widget_last_shown', Date.now().toString())
  }

  if (isDismissed || !isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[500px] max-h-[calc(100vh-2rem)] z-50 flex flex-col"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full">
              {/* Close button - sticky */}
              <button
                onClick={handleDismiss}
                className="sticky top-0 right-0 ml-auto m-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Header with decoration */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 pb-8">
                <div className="absolute top-0 right-0 w-32 h-32 -translate-y-8 translate-x-8">
                  <div className="w-full h-full rounded-full bg-white/10" />
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-6 translate-y-6">
                  <div className="w-full h-full rounded-full bg-white/10" />
                </div>

                <div className="relative">
                  <motion.div
                    animate={{
                      y: [-2, 2, -2],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 mx-auto mb-4 p-4 rounded-2xl bg-white/20 backdrop-blur-sm"
                  >
                    <Gift className="w-8 h-8" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-center mb-2">
                    Moment! 🎁
                  </h2>
                  <p className="text-blue-100 text-center">
                    Bevor du gehst, schnapp dir die <strong>50 besten KI-Tricks</strong> kostenlos!
                  </p>
                </div>
              </div>

              {/* Content - scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 -mt-4">
                  <NewsletterSignup
                    variant="modal"
                    source={source}
                    leadMagnet={{
                      title: 'Die 50 besten KI-Tricks',
                      description: 'Bewährte Workflows für mehr Produktivität',
                      downloadText: 'Jetzt kostenlos sichern'
                    }}
                    className="!max-w-none !p-0"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FloatingNewsletterWidget