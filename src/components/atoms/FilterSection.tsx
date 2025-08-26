'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  count?: number
}

export const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  children, 
  count 
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
  <div className="border-b border-border pb-6 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-4 text-left"
      >
  <h3 className="font-medium text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          {count !== undefined && count > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1.5 rounded-full font-medium border border-primary/20">
              {count}
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-neutral-500" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
