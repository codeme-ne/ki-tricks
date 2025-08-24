import { Calendar, Wrench } from 'lucide-react'
import { KITrick } from '@/lib/types/types'

interface TrickMetaProps {
  trick: KITrick
}

export const TrickMeta = ({ trick }: TrickMetaProps) => {
  const formattedDate = new Date(trick.updatedAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div className="flex items-center gap-2 text-sm">
        <Wrench className="h-4 w-4 text-primary-400" />
        <span className="text-neutral-400">Tools:</span>
        <span className="text-neutral-100 font-medium">
          {trick.tools.join(', ')}
        </span>
      </div>
      {/* Optional business tags */}
      {(trick.departmentTags && trick.departmentTags.length > 0) || (trick.industryTags && trick.industryTags.length > 0) ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="h-4 w-4 text-primary-400">🏷️</span>
          <span className="text-neutral-400">Tags:</span>
          <span className="text-neutral-100 font-medium">
            {[...(trick.departmentTags || []), ...(trick.industryTags || [])].join(', ')}
          </span>
        </div>
      ) : null}
      
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-primary-400" />
        <span className="text-neutral-400">Aktualisiert:</span>
        <span className="text-neutral-100 font-medium">{formattedDate}</span>
      </div>
    </div>
  )
}