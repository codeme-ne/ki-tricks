import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import { Category } from '@/lib/types/types'

type KITrickInsert = Database['public']['Tables']['ki_tricks']['Insert']
type KITrickUpdate = Database['public']['Tables']['ki_tricks']['Update']

export class TricksService {
  // Get all published tricks
  static async getPublishedTricks() {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ki_tricks')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Get trick by slug
  static async getTrickBySlug(slug: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ki_tricks')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) throw error
    return data
  }

  // Get tricks by category
  static async getTricksByCategory(category: Category) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ki_tricks')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Search tricks
  static async searchTricks(query: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ki_tricks')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Get filtered tricks
  static async getFilteredTricks(filters: {
    categories?: Category[]
    search?: string
  }) {
    const supabase = await createClient()
    
    let query = supabase
      .from('ki_tricks')
      .select('*')
      .eq('status', 'published')

    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories)
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query.order('published_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Increment view count
  static async incrementViewCount(slug: string) {
    const supabase = await createClient()
    
    // First get the trick to get its ID
    const { data: trick, error: fetchError } = await supabase
      .from('ki_tricks')
      .select('id, view_count')
      .eq('slug', slug)
      .single()
    
    if (fetchError) {
      console.error('Error fetching trick for view count:', fetchError)
      return
    }
    
    if (!trick) return
    
    // Update view count
    const { error: updateError } = await supabase
      .from('ki_tricks')
      .update({ view_count: (trick.view_count || 0) + 1 })
      .eq('id', trick.id)
    
    if (updateError) {
      console.error('Error updating view count:', updateError)
    }
    
    // Also track in analytics
    const { error: analyticsError } = await supabase
      .from('trick_analytics')
      .insert({
        trick_id: trick.id,
        event_type: 'view',
        session_id: `server-${Date.now()}`,
        metadata: { timestamp: new Date().toISOString() }
      })
    
    if (analyticsError) {
      console.error('Error tracking analytics:', analyticsError)
    }
  }

  // Track analytics event
  static async trackEvent(
    trickId: string,
    eventType: 'view' | 'like' | 'share' | 'implement',
    sessionId?: string,
    metadata?: any
  ) {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('trick_analytics')
      .insert({
        trick_id: trickId,
        event_type: eventType,
        session_id: sessionId,
        metadata
      })

    if (error) throw error
  }

  // Admin functions (using service role key)
  
  // Get all tricks (including unpublished)
  static async getAllTricks() {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('ki_tricks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Create new trick
  static async createTrick(trick: Omit<KITrickInsert, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('ki_tricks')
      .insert(trick)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update trick
  static async updateTrick(id: string, updates: KITrickUpdate) {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('ki_tricks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete trick
  static async deleteTrick(id: string) {
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('ki_tricks')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Publish trick
  static async publishTrick(id: string) {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('ki_tricks')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Reject trick
  static async rejectTrick(id: string, reason?: string) {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('ki_tricks')
      .update({
        status: 'rejected'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}