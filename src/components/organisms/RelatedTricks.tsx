import { KITrick } from '@/lib/types/types'
import { TrickCard } from '@/components/molecules'
import { Lightbulb } from 'lucide-react'

interface RelatedTricksProps {
  currentTrickId: string
  category: string
  tricks: KITrick[]
}

export const RelatedTricks = ({ currentTrickId, category, tricks }: RelatedTricksProps) => {
  const relatedTricks = tricks
    .filter(trick => trick.id !== currentTrickId && trick.category === category)
    .slice(0, 3)

  if (relatedTricks.length === 0) {
    return null
  }

  return (
    <section className="relative mt-12">
      {/* Glass Container with Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-neutral-800/20 backdrop-blur-sm rounded-2xl" />
        
        {/* Content */}
        <div className="relative p-8">
          {/* Section Header with Icon */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <Lightbulb className="h-5 w-5 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-100">
              Ähnliche Tricks
            </h2>
          </div>
          
          {/* Trick Cards Grid - Optimiert für Related Tricks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
            {relatedTricks.map((trick, index) => (
              <div
                key={trick.id}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                className="animate-fadeInUp"
              >
                <TrickCard trick={trick} compact={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}