'use client'

import { useState } from 'react'
import { BaseCard } from '@/components/atoms'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string | React.ReactNode
  iconColor: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export const FAQAccordion = ({ items }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number>(0)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item, index) => (
        <BaseCard
          key={index}
          hover={false}
          className="border border-border/50 dark:border-border/30 hover:border-primary/20 dark:hover:border-primary/40 transition-all duration-300 cursor-pointer"
          onClick={() => toggleItem(index)}
        >
          <div className="flex items-start justify-between gap-3 sm:gap-4 py-1">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <div className={`mt-1 p-2 rounded-lg ${item.iconColor} shrink-0`}>
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-foreground text-base sm:text-lg transition-colors ${openIndex === index ? 'text-primary dark:text-primary' : ''}`}>
                  {item.question}
                </h3>
              </div>
            </div>
            <div className={`mt-2 p-2 rounded-lg transition-all duration-300 shrink-0 ${openIndex === index ? 'bg-primary/10 dark:bg-primary/20' : 'bg-muted/50 dark:bg-muted/30'}`}>
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${openIndex === index ? 'text-primary dark:text-primary rotate-180' : 'text-muted-foreground dark:text-muted-foreground'}`} />
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="mt-4 ml-9 sm:ml-14 pr-9 sm:pr-14 pb-1">
              <div className="text-sm sm:text-base text-muted-foreground dark:text-muted-foreground leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        </BaseCard>
      ))}
    </div>
  )
}