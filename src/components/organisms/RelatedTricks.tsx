import { KITrick } from '@/lib/types/types'
import { TrickCard } from '@/components/molecules'

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
    <section className="mt-12 md:mt-16">
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-4">Ähnliche Tricks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
        {relatedTricks.map((trick) => (
          <TrickCard key={trick.id} trick={trick} />
        ))}
      </div>
    </section>
  )
}