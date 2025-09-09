export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ki_tricks: {
        Row: {
          id: string
          title: string
          description: string
          category: 'productivity' | 'content-creation' | 'programming' | 'design' | 'data-analysis' | 'learning' | 'business' | 'marketing'
          tools: string[]
          steps: string[] | null
          examples: string[] | null
          slug: string
          why_it_works: string
          status: 'draft' | 'pending' | 'published' | 'rejected'
          quality_score: number | null
          quality_category: string | null
          created_at: string
          updated_at: string
          published_at: string | null
          view_count: number
          like_count: number
          created_by: string | null
          reviewed_by: string | null

          // Research-backed extensions
          role: 'general' | 'sales' | 'marketing' | 'hr' | 'finance' | 'it' | 'procurement' | 'operations' | 'customer-service' | 'legal' | 'product' | 'consulting' | null
          industries: string[]
          tool_vendor: string | null
          integrations: string[]
          estimated_time_minutes: number | null
          estimated_savings_minutes: number | null
          risk_level: 'low' | 'medium' | 'high' | null
          evidence_level: 'A' | 'B' | 'C' | null
          prerequisites: string | null
          privacy_notes: string | null
          sources: Json | null
          prompt_examples: string[] | null
          kpi_suggestions: string[] | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'productivity' | 'content-creation' | 'programming' | 'design' | 'data-analysis' | 'learning' | 'business' | 'marketing'
          tools: string[]
          steps?: string[] | null
          examples?: string[] | null
          slug: string
          why_it_works: string
          status?: 'draft' | 'pending' | 'published' | 'rejected'
          quality_score?: number | null
          quality_category?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
          view_count?: number
          like_count?: number
          created_by?: string | null
          reviewed_by?: string | null

          // Research-backed extensions
          role?: 'general' | 'sales' | 'marketing' | 'hr' | 'finance' | 'it' | 'procurement' | 'operations' | 'customer-service' | 'legal' | 'product' | 'consulting' | null
          industries?: string[]
          tool_vendor?: string | null
          integrations?: string[]
          estimated_time_minutes?: number | null
          estimated_savings_minutes?: number | null
          risk_level?: 'low' | 'medium' | 'high' | null
          evidence_level?: 'A' | 'B' | 'C' | null
          prerequisites?: string | null
          privacy_notes?: string | null
          sources?: Json | null
          prompt_examples?: string[] | null
          kpi_suggestions?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'productivity' | 'content-creation' | 'programming' | 'design' | 'data-analysis' | 'learning' | 'business' | 'marketing'
          tools?: string[]
          steps?: string[] | null
          examples?: string[] | null
          slug?: string
          why_it_works?: string
          status?: 'draft' | 'pending' | 'published' | 'rejected'
          quality_score?: number | null
          quality_category?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
          view_count?: number
          like_count?: number
          created_by?: string | null
          reviewed_by?: string | null

          // Research-backed extensions
          role?: 'general' | 'sales' | 'marketing' | 'hr' | 'finance' | 'it' | 'procurement' | 'operations' | 'customer-service' | 'legal' | 'product' | 'consulting' | null
          industries?: string[]
          tool_vendor?: string | null
          integrations?: string[]
          estimated_time_minutes?: number | null
          estimated_savings_minutes?: number | null
          risk_level?: 'low' | 'medium' | 'high' | null
          evidence_level?: 'A' | 'B' | 'C' | null
          prerequisites?: string | null
          privacy_notes?: string | null
          sources?: Json | null
          prompt_examples?: string[] | null
          kpi_suggestions?: string[] | null
        }
      }
      trick_submissions: {
        Row: {
          id: string
          trick_data: Json
          submitter_email: string | null
          submitter_name: string | null
          status: 'pending' | 'approved' | 'rejected'
          review_notes: string | null
          quality_score: number | null
          created_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          trick_data: Json
          submitter_email?: string | null
          submitter_name?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          review_notes?: string | null
          quality_score?: number | null
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          trick_data?: Json
          submitter_email?: string | null
          submitter_name?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          review_notes?: string | null
          quality_score?: number | null
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      trick_analytics: {
        Row: {
          id: string
          trick_id: string
          event_type: 'view' | 'like' | 'share' | 'implement'
          user_id: string | null
          session_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          trick_id: string
          event_type: 'view' | 'like' | 'share' | 'implement'
          user_id?: string | null
          session_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          trick_id?: string
          event_type?: 'view' | 'like' | 'share' | 'implement'
          user_id?: string | null
          session_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
