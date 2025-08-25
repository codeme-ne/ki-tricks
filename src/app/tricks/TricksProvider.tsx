import { getPublishedTricks, getAllCategories } from '@/lib/actions/tricks.actions'
import TricksClient from './TricksClient'

export default async function TricksProvider() {
  const tricks = await getPublishedTricks()
  const categories = await getAllCategories()
  
  return (
    <TricksClient 
      serverTricks={tricks}
      serverCategories={categories} 
    />
  )
}