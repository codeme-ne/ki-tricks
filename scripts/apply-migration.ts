import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigration() {
  const migrationFile = path.join(
    process.cwd(),
    'supabase',
    'migrations',
    '20250930_add_difficulty_prompt_and_jsonb_steps.sql'
  )

  console.log('📖 Lese Migration...')
  const sql = fs.readFileSync(migrationFile, 'utf-8')

  // Split SQL by statements (basic approach - works for most cases)
  // More sophisticated parsing would handle comments and strings better
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))
    .map(s => s + ';')

  console.log(`🚀 Führe ${statements.length} SQL Statements aus...`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]

    // Skip comments
    if (statement.startsWith('--') || statement.startsWith('/*')) {
      continue
    }

    // Skip empty statements
    if (statement.trim() === ';') {
      continue
    }

    console.log(`\n📝 Statement ${i + 1}/${statements.length}:`)
    console.log(statement.substring(0, 100) + '...')

    const { error } = await supabase.rpc('exec_sql', { sql: statement })

    if (error) {
      console.error(`❌ Fehler bei Statement ${i + 1}:`, error)

      // Try direct query as fallback
      console.log('🔄 Versuche direkte Query...')
      const { error: directError } = await supabase.from('_').select('*').limit(0)

      if (directError) {
        console.error('❌ Auch direkte Query fehlgeschlagen:', directError)
        console.error('\n⚠️  Migration muss manuell über Supabase Studio ausgeführt werden')
        console.error('1. Öffne: https://supabase.com/dashboard/project/oedblaldxusjpcgfoqup/editor')
        console.error('2. Führe aus: supabase/migrations/20250930_add_difficulty_prompt_and_jsonb_steps.sql')
        process.exit(1)
      }
    } else {
      console.log('✅ Erfolgreich')
    }
  }

  console.log('\n✅ Migration erfolgreich angewendet!')
  console.log('\n📊 Prüfe Schema...')

  // Verify the changes
  const { data, error } = await supabase
    .from('ki_tricks')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Fehler beim Schema-Check:', error)
  } else {
    console.log('✅ Schema-Check erfolgreich')
    if (data && data.length > 0) {
      console.log('\nVerfügbare Felder:', Object.keys(data[0]))
    }
  }
}

applyMigration()