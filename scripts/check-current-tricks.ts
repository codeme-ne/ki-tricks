import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTricks() {
  console.log('🔍 Prüfe aktuelle Tricks in der Datenbank...\n')

  const { data, error, count } = await supabase
    .from('ki_tricks')
    .select('*', { count: 'exact' })

  if (error) {
    console.error('❌ Fehler:', error)
    process.exit(1)
  }

  console.log(`📊 AKTUELLER STAND:`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Anzahl Tricks: ${count}`)

  if (data && data.length > 0) {
    console.log(`\n📝 ERSTE 5 TRICKS:`)
    data.slice(0, 5).forEach((trick: any, i: number) => {
      console.log(`\n${i + 1}. ${trick.title}`)
      console.log(`   ID: ${trick.id}`)
      console.log(`   Kategorie: ${trick.category}`)
      console.log(`   Slug: ${trick.slug}`)
    })

    // Check new fields
    const firstTrick = data[0]
    console.log(`\n🆕 NEUE FELDER (am ersten Trick):`)
    console.log(`   difficulty: ${firstTrick.difficulty || 'NULL'}`)
    console.log(`   prompt_template: ${firstTrick.prompt_template ? 'EXISTS' : 'NULL'}`)
    console.log(`   steps_structured: ${firstTrick.steps_structured ? 'EXISTS (JSONB)' : 'NULL'}`)
    console.log(`   _steps_deprecated: ${firstTrick._steps_deprecated ? 'EXISTS' : 'NULL'}`)
  } else {
    console.log('\n✅ Datenbank ist leer - bereit für neue Tricks!')
  }
}

checkTricks()