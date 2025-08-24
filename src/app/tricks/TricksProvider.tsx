import { getPublishedTricks, getAllCategories } from '@/lib/actions/tricks.actions'
import TricksClient from './TricksClient'

export default async function TricksProvider() {
  const tricks = await getPublishedTricks()
  const categories = await getAllCategories()
  // Derive unique departments and industries from tricks
  const departments = Array.from(new Set(
    (tricks || []).flatMap((t: any) => (t.department_tags || []))
  ))
  const industries = Array.from(new Set(
    (tricks || []).flatMap((t: any) => (t.industry_tags || []))
  ))
  
  return (
    <TricksClient 
      serverTricks={tricks}
      serverCategories={categories}
      departments={departments}
      industries={industries}
    />
  )
}