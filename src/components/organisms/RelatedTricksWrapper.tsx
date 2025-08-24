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
    timeToImplement: trick.time_to_implement,
  difficulty: trick.difficulty,
  impact: trick.impact,
  departmentTags: (trick as any).department_tags || [],
  industryTags: (trick as any).industry_tags || [],
    steps: trick.steps || [],
    examples: trick.examples || [],
    slug: trick.slug,
    createdAt: new Date(trick.created_at),
    updatedAt: new Date(trick.updated_at),
    'Warum es funktioniert': trick.why_it_works
  }))
  
  return (
    <RelatedTricks 
      currentTrickId={currentTrickId}
      category={category}
      tricks={tricks}
    />
  )
}