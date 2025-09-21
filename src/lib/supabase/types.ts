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
      guides: {
        Row: {
          id: string
          slug: string
          title: string
          summary: string
          steps: string[]
          examples: string[]
          role: Database['public']['Enums']['company_role_enum'] | null
          industries: string[]
          tools: string[]
          hero_image_url: string | null
          sources: Json
          risk_level: Database['public']['Enums']['risk_level_enum'] | null
          evidence_level: Database['public']['Enums']['evidence_level_enum'] | null
          status: 'draft' | 'pending' | 'published' | 'archived'
          quality_score: number | null
          implement_count: number
          view_count: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          summary: string
          steps?: string[]
          examples?: string[]
          role?: Database['public']['Enums']['company_role_enum'] | null
          industries?: string[]
          tools?: string[]
          hero_image_url?: string | null
          sources?: Json
          risk_level?: Database['public']['Enums']['risk_level_enum'] | null
          evidence_level?: Database['public']['Enums']['evidence_level_enum'] | null
          status?: 'draft' | 'pending' | 'published' | 'archived'
          quality_score?: number | null
          implement_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          summary?: string
          steps?: string[]
          examples?: string[]
          role?: Database['public']['Enums']['company_role_enum'] | null
          industries?: string[]
          tools?: string[]
          hero_image_url?: string | null
          sources?: Json
          risk_level?: Database['public']['Enums']['risk_level_enum'] | null
          evidence_level?: Database['public']['Enums']['evidence_level_enum'] | null
          status?: 'draft' | 'pending' | 'published' | 'archived'
          quality_score?: number | null
          implement_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
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
          created_at: string
          updated_at: string
          published_at: string | null
          view_count: number
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
          created_at?: string
          updated_at?: string
          published_at?: string | null
          view_count?: number
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
          created_at?: string
          updated_at?: string
          published_at?: string | null
          view_count?: number
        }
      }
      news_items: {
        Row: {
          id: string
          source_id: string
          source_type: string
          source_category: string
          evidence_level: Database['public']['Enums']['evidence_level_enum'] | null
          title: string
          url: string
          published_at: string | null
          content_hash: string
          summary: string | null
          tags: string[]
          raw: Json
          processed: boolean
          is_duplicate: boolean
          duplicate_of: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source_id: string
          source_type: string
          source_category: string
          evidence_level?: Database['public']['Enums']['evidence_level_enum'] | null
          title: string
          url: string
          published_at?: string | null
          content_hash: string
          summary?: string | null
          tags?: string[]
          raw: Json
          processed?: boolean
          is_duplicate?: boolean
          duplicate_of?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_id?: string
          source_type?: string
          source_category?: string
          evidence_level?: Database['public']['Enums']['evidence_level_enum'] | null
          title?: string
          url?: string
          published_at?: string | null
          content_hash?: string
          summary?: string | null
          tags?: string[]
          raw?: Json
          processed?: boolean
          is_duplicate?: boolean
          duplicate_of?: string | null
          created_at?: string
          updated_at?: string
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
          event_type: 'view' | 'share' | 'implement'
          user_id: string | null
          session_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          trick_id: string
          event_type: 'view' | 'share' | 'implement'
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
      company_role_enum:
        | 'general'
        | 'sales'
        | 'marketing'
        | 'hr'
        | 'finance'
        | 'it'
        | 'procurement'
        | 'operations'
        | 'customer-service'
        | 'legal'
        | 'product'
        | 'consulting'
      evidence_level_enum: 'A' | 'B' | 'C'
      risk_level_enum: 'low' | 'medium' | 'high'
    }
  }
}
