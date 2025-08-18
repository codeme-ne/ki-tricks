import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import { calculateQualityScore } from '@/lib/utils/quality-scoring'

type SubmissionRow = Database['public']['Tables']['trick_submissions']['Row']
type SubmissionInsert = Database['public']['Tables']['trick_submissions']['Insert']

export class SubmissionsService {
  // Submit a new trick
  static async submitTrick(trickData: any, submitterInfo?: {
    email?: string
    name?: string
  }) {
    const supabase = await createClient()
    
    // Calculate quality score
    const qualityScore = calculateQualityScore(trickData)
    
    const submission: SubmissionInsert = {
      trick_data: trickData,
      submitter_email: submitterInfo?.email || null,
      submitter_name: submitterInfo?.name || null,
      quality_score: qualityScore,
      status: 'pending'
    }
    
    const { data, error } = await supabase
      .from('trick_submissions')
      .insert(submission)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Admin functions
  
  // Get all submissions
  static async getAllSubmissions() {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('trick_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Get pending submissions
  static async getPendingSubmissions() {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('trick_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Approve submission and create trick
  static async approveSubmission(submissionId: string, reviewNotes?: string) {
    const supabase = createAdminClient()
    
    // Get submission data
    const { data: submission, error: fetchError } = await supabase
      .from('trick_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (fetchError) throw fetchError
    if (!submission) throw new Error('Submission not found')

    // Create the trick from submission data
    const trickData = submission.trick_data as any
    const { data: trick, error: createError } = await supabase
      .from('ki_tricks')
      .insert({
        title: trickData.title,
        description: trickData.description,
        category: trickData.category,
        difficulty: trickData.difficulty,
        tools: trickData.tools,
        time_to_implement: trickData.timeToImplement,
        impact: trickData.impact,
        steps: trickData.steps || [],
        examples: trickData.examples || [],
        slug: trickData.slug,
        why_it_works: trickData['Warum es funktioniert'] || trickData.why_it_works,
        status: 'published',
        quality_score: submission.quality_score,
        published_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) throw createError

    // Update submission status
    const { error: updateError } = await supabase
      .from('trick_submissions')
      .update({
        status: 'approved',
        review_notes: reviewNotes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId)

    if (updateError) throw updateError
    
    return trick
  }

  // Reject submission
  static async rejectSubmission(submissionId: string, reviewNotes: string) {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('trick_submissions')
      .update({
        status: 'rejected',
        review_notes: reviewNotes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete submission
  static async deleteSubmission(submissionId: string) {
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('trick_submissions')
      .delete()
      .eq('id', submissionId)

    if (error) throw error
  }

  // Bulk approve submissions
  static async bulkApproveSubmissions(submissionIds: string[]) {
    const supabase = createAdminClient()
    
    const results = []
    
    for (const id of submissionIds) {
      try {
        const trick = await this.approveSubmission(id)
        results.push({ id, success: true, trick })
      } catch (error) {
        results.push({ id, success: false, error })
      }
    }
    
    return results
  }

  // Bulk reject submissions
  static async bulkRejectSubmissions(submissionIds: string[], reviewNotes: string) {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('trick_submissions')
      .update({
        status: 'rejected',
        review_notes: reviewNotes,
        reviewed_at: new Date().toISOString()
      })
      .in('id', submissionIds)
      .select()

    if (error) throw error
    return data
  }
}