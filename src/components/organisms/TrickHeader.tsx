import { KITrick } from '@/lib/types/types'
import { Badge } from '@/components/atoms'
import { BreadcrumbNav, TrickMeta } from '@/components/molecules'
import { categoryLabels, difficultyLabels, difficultyVariants } from '@/lib/constants/constants'

interface TrickHeaderProps {
  trick: KITrick
}

function parseMarkdown(text: string): React.ReactNode {
  // Split text by ** for bold sections
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove ** markers and render as bold
      const boldText = part.slice(2, -2)
      return <strong key={index} className="font-bold text-neutral-100">{boldText}</strong>
    }
    return <span key={index}>{part}</span>
  })
}

export const TrickHeader = ({ trick }: TrickHeaderProps) => {
  return (
    <div className="space-y-6">
      <BreadcrumbNav 
        category={trick.category}
        categoryLabel={categoryLabels[trick.category]}
        trickTitle={trick.title}
      />
      
      <div className="relative">
        {/* Subtle Background Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/5 to-purple-500/5 blur-3xl rounded-3xl" />
        
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Badges with subtle glow */}
            <div className="inline-flex shadow-lg shadow-primary-500/20">
              <Badge variant="primary">
                {categoryLabels[trick.category]}
              </Badge>
            </div>
            <div className="inline-flex shadow-lg shadow-neutral-500/20">
              <Badge variant={difficultyVariants[trick.difficulty]}>
                {difficultyLabels[trick.difficulty]}
              </Badge>
            </div>
          </div>
          
          {/* Title with gradient option */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-100 mb-4 tracking-tight">
            {trick.title}
          </h1>
          
          {/* Description with markdown support */}
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-6">
            {parseMarkdown(trick.description)}
          </p>
          
          {/* Meta information with glassmorphism */}
          <div className="relative">
            <div className="absolute inset-0 bg-neutral-800/30 backdrop-blur-sm rounded-xl" />
            <div className="relative">
              <TrickMeta trick={trick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}