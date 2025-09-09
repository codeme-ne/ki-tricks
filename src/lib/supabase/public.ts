import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Cookie-less client for public, read-only queries during SSG/ISR
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars for public client')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Avoid any session usage so no Next.js cookies() are needed
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

