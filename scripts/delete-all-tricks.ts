import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteAllTricks() {
  console.log('🗑️  Lösche alle KI-Tricks...')

  const { error } = await supabase
    .from('ki_tricks')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

  if (error) {
    console.error('❌ Fehler beim Löschen:', error)
    process.exit(1)
  }

  console.log('✅ Alle KI-Tricks erfolgreich gelöscht')
}

deleteAllTricks()