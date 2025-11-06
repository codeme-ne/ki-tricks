import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createPublicClient } from '@/lib/supabase/public'
import type { PromptCategory, LearningPrompt, UserPromptFavorite, UserPromptCollection } from '@/lib/types/types'

export class PromptsService {
  // ======================
  // PUBLIC READ OPERATIONS
  // ======================

  // Get all published prompts
  static async getPublishedPrompts() {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data as LearningPrompt[]
  }

  // Get prompt by slug
  static async getPromptBySlug(slug: string) {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) throw error
    return data as LearningPrompt
  }

  // Get prompts by category
  static async getPromptsByCategory(category: PromptCategory) {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data as LearningPrompt[]
  }

  // Search prompts
  static async searchPrompts(query: string) {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,prompt_text.ilike.%${query}%,description.ilike.%${query}%`)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data as LearningPrompt[]
  }

  // Get filtered prompts
  static async getFilteredPrompts(filters: {
    categories?: PromptCategory[]
    difficulty?: ('beginner' | 'intermediate' | 'advanced')[]
    ai_tools?: string[]
    search?: string
  }) {
    const supabase = createPublicClient()

    let query = supabase
      .from('learning_prompts')
      .select('*')
      .eq('status', 'published')

    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories)
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      query = query.in('difficulty_level', filters.difficulty)
    }

    if (filters.ai_tools && filters.ai_tools.length > 0) {
      // Filter by AI tools (overlap with array)
      query = query.overlaps('ai_tools', filters.ai_tools)
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,prompt_text.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query.order('published_at', { ascending: false })

    if (error) throw error
    return data as LearningPrompt[]
  }

  // Get related prompts (same category, different slug)
  static async getRelatedPrompts(category: PromptCategory, currentSlug: string, limit: number = 4) {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .neq('slug', currentSlug)
      .order('favorite_count', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as LearningPrompt[]
  }

  // Get popular prompts (by favorite count)
  static async getPopularPrompts(limit: number = 10) {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .select('*')
      .eq('status', 'published')
      .order('favorite_count', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as LearningPrompt[]
  }

  // ======================
  // VIEW & USAGE TRACKING
  // ======================

  // Increment view count
  static async incrementViewCount(slug: string) {
    const supabase = createAdminClient()

    const { data: prompt, error: fetchError } = await supabase
      .from('learning_prompts')
      .select('id, view_count')
      .eq('slug', slug)
      .single()

    if (fetchError) {
      console.error('Error fetching prompt for view count:', fetchError)
      return
    }

    if (!prompt) return

    // Update view count
    const { error: updateError } = await supabase
      .from('learning_prompts')
      .update({ view_count: (prompt.view_count || 0) + 1 })
      .eq('id', prompt.id)

    if (updateError) {
      console.error('Error updating view count:', updateError)
    }

    // Track in analytics
    const { error: analyticsError } = await supabase
      .from('prompt_analytics')
      .insert({
        prompt_id: prompt.id,
        event_type: 'view',
        session_id: `server-${Date.now()}`,
        metadata: { timestamp: new Date().toISOString() }
      })

    if (analyticsError) {
      console.error('Error tracking analytics:', analyticsError)
    }
  }

  // Increment use count (when user clicks "use this prompt")
  static async incrementUseCount(promptId: string, userId?: string, sessionId?: string) {
    const supabase = createAdminClient()

    // Increment use_count
    const { error: updateError } = await supabase.rpc('increment_prompt_use_count', {
      prompt_slug: promptId
    })

    if (updateError) {
      console.error('Error incrementing use count:', updateError)
    }

    // Track in analytics
    const { error: analyticsError } = await supabase
      .from('prompt_analytics')
      .insert({
        prompt_id: promptId,
        event_type: 'use',
        user_id: userId,
        session_id: sessionId,
        metadata: { timestamp: new Date().toISOString() }
      })

    if (analyticsError) {
      console.error('Error tracking use analytics:', analyticsError)
    }
  }

  // Track analytics event
  static async trackEvent(
    promptId: string,
    eventType: 'view' | 'favorite' | 'unfavorite' | 'copy' | 'use' | 'share',
    userId?: string,
    sessionId?: string,
    metadata?: Record<string, unknown>
  ) {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('prompt_analytics')
      .insert({
        prompt_id: promptId,
        event_type: eventType,
        user_id: userId,
        session_id: sessionId,
        metadata
      })

    if (error) {
      console.error('Error tracking prompt analytics:', error)
    }
  }

  // ======================
  // USER FAVORITES
  // ======================

  // Get user's favorited prompts
  static async getUserFavorites(userId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_prompt_favorites')
      .select(`
        *,
        prompt:learning_prompts(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as UserPromptFavorite[]
  }

  // Check if user has favorited a prompt
  static async isPromptFavorited(userId: string, promptId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_prompt_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .maybeSingle()

    if (error) throw error
    return !!data
  }

  // Get user's favorited prompt IDs
  static async getUserFavoriteIds(userId: string): Promise<string[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_prompt_favorites')
      .select('prompt_id')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching favorite IDs:', error)
      return []
    }
    return data?.map(f => f.prompt_id) || []
  }

  // Add prompt to favorites
  static async addToFavorites(userId: string, promptId: string, personalNotes?: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_prompt_favorites')
      .insert({
        user_id: userId,
        prompt_id: promptId,
        personal_notes: personalNotes
      })
      .select()
      .single()

    if (error) throw error

    // Track in analytics
    await this.trackEvent(promptId, 'favorite', userId)

    return data
  }

  // Remove prompt from favorites
  static async removeFromFavorites(userId: string, promptId: string) {
    const supabase = await createClient()

    const { error } = await supabase
      .from('user_prompt_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('prompt_id', promptId)

    if (error) throw error

    // Track in analytics
    await this.trackEvent(promptId, 'unfavorite', userId)
  }

  // Toggle favorite status
  static async toggleFavorite(userId: string, promptId: string) {
    const isFavorited = await this.isPromptFavorited(userId, promptId)

    if (isFavorited) {
      await this.removeFromFavorites(userId, promptId)
      return false
    } else {
      await this.addToFavorites(userId, promptId)
      return true
    }
  }

  // Update favorite notes
  static async updateFavoriteNotes(userId: string, promptId: string, notes: string, tags?: string[]) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_prompt_favorites')
      .update({
        personal_notes: notes,
        tags: tags
      })
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // ======================
  // USER COLLECTIONS
  // ======================

  // Get user's collections
  static async getUserCollections(userId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_prompt_collections')
      .select(`
        *,
        prompts:collection_prompts(count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as UserPromptCollection[]
  }

  // Get public collections
  static async getPublicCollections(limit: number = 20) {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('user_prompt_collections')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as UserPromptCollection[]
  }

  // Get collection by slug
  static async getCollectionBySlug(userId: string, slug: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_prompt_collections')
      .select(`
        *,
        prompts:collection_prompts(
          *,
          prompt:learning_prompts(*)
        )
      `)
      .eq('user_id', userId)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  }

  // Create collection
  static async createCollection(
    userId: string,
    name: string,
    description?: string,
    isPublic: boolean = false
  ) {
    const supabase = await createClient()

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const { data, error } = await supabase
      .from('user_prompt_collections')
      .insert({
        user_id: userId,
        name,
        description,
        is_public: isPublic,
        slug
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Add prompt to collection
  static async addPromptToCollection(collectionId: string, promptId: string, orderIndex?: number) {
    const supabase = await createClient()

    // Get current max order_index if not provided
    if (orderIndex === undefined) {
      const { data: existing } = await supabase
        .from('collection_prompts')
        .select('order_index')
        .eq('collection_id', collectionId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

      orderIndex = existing ? existing.order_index + 1 : 0
    }

    const { data, error } = await supabase
      .from('collection_prompts')
      .insert({
        collection_id: collectionId,
        prompt_id: promptId,
        order_index: orderIndex
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Remove prompt from collection
  static async removePromptFromCollection(collectionId: string, promptId: string) {
    const supabase = await createClient()

    const { error } = await supabase
      .from('collection_prompts')
      .delete()
      .eq('collection_id', collectionId)
      .eq('prompt_id', promptId)

    if (error) throw error
  }

  // Delete collection
  static async deleteCollection(collectionId: string, userId: string) {
    const supabase = await createClient()

    // Verify ownership
    const { data: collection } = await supabase
      .from('user_prompt_collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single()

    if (!collection) {
      throw new Error('Collection not found or unauthorized')
    }

    const { error } = await supabase
      .from('user_prompt_collections')
      .delete()
      .eq('id', collectionId)
      .eq('user_id', userId)

    if (error) throw error
  }

  // ======================
  // ADMIN OPERATIONS
  // ======================

  // Get all prompts (including unpublished)
  static async getAllPrompts() {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as LearningPrompt[]
  }

  // Create new prompt
  static async createPrompt(prompt: Partial<LearningPrompt>) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .insert(prompt)
      .select()
      .single()

    if (error) throw error
    return data as LearningPrompt
  }

  // Update prompt
  static async updatePrompt(id: string, updates: Partial<LearningPrompt>) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as LearningPrompt
  }

  // Delete prompt
  static async deletePrompt(id: string) {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('learning_prompts')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Publish prompt
  static async publishPrompt(id: string) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as LearningPrompt
  }

  // Reject prompt
  static async rejectPrompt(id: string) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('learning_prompts')
      .update({
        status: 'rejected'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as LearningPrompt
  }

  // ======================
  // SUBMISSIONS
  // ======================

  // Submit new prompt for review
  static async submitPrompt(
    promptData: Partial<LearningPrompt>,
    submitterEmail?: string,
    submitterName?: string,
    submitterUserId?: string
  ) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('prompt_submissions')
      .insert({
        prompt_data: promptData,
        submitter_email: submitterEmail,
        submitter_name: submitterName,
        submitter_user_id: submitterUserId,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get all submissions
  static async getAllSubmissions() {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('prompt_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Get pending submissions
  static async getPendingSubmissions() {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('prompt_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Approve submission and create prompt
  static async approveSubmission(submissionId: string, reviewNotes?: string) {
    const supabase = createAdminClient()

    // Get the submission
    const { data: submission, error: fetchError } = await supabase
      .from('prompt_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (fetchError || !submission) throw fetchError || new Error('Submission not found')

    // Create the prompt from submission data
    const { data: prompt, error: createError } = await supabase
      .from('learning_prompts')
      .insert({
        ...submission.prompt_data,
        status: 'published',
        published_at: new Date().toISOString(),
        created_by: submission.submitter_user_id,
        submitter_email: submission.submitter_email,
        submitter_name: submission.submitter_name
      })
      .select()
      .single()

    if (createError) throw createError

    // Update submission status
    const { error: updateError } = await supabase
      .from('prompt_submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes
      })
      .eq('id', submissionId)

    if (updateError) throw updateError

    return prompt
  }

  // Reject submission
  static async rejectSubmission(submissionId: string, reviewNotes?: string) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('prompt_submissions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
