import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard | KI Tricks Platform',
  description: 'Verwalte deine Trick-Karten Reservierungen und sieh deine Performance-Statistiken.',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // If no profile exists, create one
  if (!profile) {
    await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        created_at: new Date().toISOString(),
      })
  }

  // Fetch user's campaigns
  const { data: campaigns } = await supabase
    .from('ad_campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch user's reservations
  const { data: reservations } = await supabase
    .from('trick_card_reservations')
    .select(`
      *,
      ki_tricks (
        id,
        title,
        slug,
        category
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardClient
      user={user}
      profile={profile}
      campaigns={campaigns || []}
      reservations={reservations || []}
    />
  )
}