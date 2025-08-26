import { Calendar, Wrench } from 'lucide-react'
import { KITrick } from '@/lib/types/types'

interface TrickMetaProps {
  trick: KITrick
}

// impact/time removed

export const TrickMeta = ({ trick }: TrickMetaProps) => {
  const formattedDate = new Date(trick.updatedAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
  {/* time and impact removed */}
      
      <div className="flex items-center gap-2 text-sm">
        <Wrench className="h-4 w-4 text-primary-400" />
        <span className="text-neutral-400">Tools:</span>
        <span className="text-neutral-100 font-medium">
          {trick.tools.join(', ')}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-primary-400" />
        <span className="text-neutral-400">Aktualisiert:</span>
        <span className="text-neutral-100 font-medium">{formattedDate}</span>
      </div>
    </div>
  )
}