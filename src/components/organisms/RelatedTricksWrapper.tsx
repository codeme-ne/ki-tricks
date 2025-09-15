import { TricksService } from '@/lib/services/tricks.service'
import { RelatedTricks } from './RelatedTricks'
import { KITrick, Category } from '@/lib/types/types'

interface RelatedTricksWrapperProps {
  currentTrickId: string
  category: Category
}

export default async function RelatedTricksWrapper({ 
  currentTrickId, 
  category 
}: RelatedTricksWrapperProps) {
  // Fetch tricks from the same category
  const categoryTricks = await TricksService.getTricksByCategory(category)
  
  // Convert to KITrick format
  const tricks: KITrick[] = categoryTricks.map(trick => ({
    id: trick.id,
    title: trick.title,
    description: trick.description,
    category: trick.category as Category,
    tools: trick.tools,
    steps: trick.steps || [],
    examples: trick.examples || [],
    slug: trick.slug,
    created_at: trick.created_at,
    updated_at: trick.updated_at,
    why_it_works: trick.why_it_works,
    status: trick.status || 'published',
    quality_score: trick.quality_score || null,
    view_count: trick.view_count || 0,
    published_at: trick.published_at || null
  }))
  
  return (
    <RelatedTricks 
      currentTrickId={currentTrickId}
      category={category}
      tricks={tricks}
    />
  )
}