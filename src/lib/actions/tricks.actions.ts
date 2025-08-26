import { TricksService } from '@/lib/services/tricks.service'

// Direct data fetching without unstable_cache (causing issues in Next.js 15)
export const getTotalTricksCount = async () => {
  try {
    const tricks = await TricksService.getPublishedTricks()
    return tricks.length
  } catch (error) {
    console.error('Error fetching tricks count:', error)
    return 0
  }
}

export const getTotalCategoriesCount = async () => {
  try {
    const tricks = await TricksService.getPublishedTricks()
    const categories = new Set(tricks.map(t => t.category))
    return categories.size
  } catch (error) {
    console.error('Error fetching categories count:', error)
    return 0
  }
}

export const getAllTools = async () => {
  try {
    const tricks = await TricksService.getPublishedTricks()
    const tools = new Set<string>()
    tricks.forEach(trick => {
      trick.tools.forEach((tool: string) => tools.add(tool))
    })
    return Array.from(tools)
  } catch (error) {
    console.error('Error fetching tools:', error)
    return []
  }
}

export const getAverageImplementationTime = async () => {
  try {
    // Time to implement has been removed from the data model
    // Return 0 as a placeholder
    return 0
  } catch (error) {
    console.error('Error calculating average time:', error)
    return 0
  }
}

export const getTrickCountByCategory = async () => {
  try {
    const tricks = await TricksService.getPublishedTricks()
    const counts: Record<string, number> = {}
    tricks.forEach(trick => {
      counts[trick.category] = (counts[trick.category] || 0) + 1
    })
    return counts
  } catch (error) {
    console.error('Error fetching tricks by category:', error)
    return {}
  }
}

export const getAllCategories = async () => {
  try {
    const tricks = await TricksService.getPublishedTricks()
    const categories = new Set(tricks.map(t => t.category))
    return Array.from(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const getPublishedTricks = async () => {
  try {
    return await TricksService.getPublishedTricks()
  } catch (error) {
    console.error('Error fetching published tricks:', error)
    return []
  }
}

export const getTrickBySlug = async (slug: string) => {
  try {
    return await TricksService.getTrickBySlug(slug)
  } catch (error) {
    console.error('Error fetching trick by slug:', error)
    return null
  }
}