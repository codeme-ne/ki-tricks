import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Load env vars manually
const envContent = fs.readFileSync('.env.local', 'utf-8')
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAnalytics() {
  console.log('Testing Analytics...\n')
  
  // 1. Test fetching tricks
  const { data: tricks, error: tricksError } = await supabase
    .from('ki_tricks')
    .select('id, title, slug, view_count')
    .limit(3)
  
  if (tricksError) {
    console.error('Error fetching tricks:', tricksError)
  } else {
    console.log('Sample tricks:')
    tricks.forEach(t => console.log(`- ${t.title}: ${t.view_count || 0} views`))
  }
  
  // 2. Test inserting analytics
  if (tricks && tricks.length > 0) {
    const testTrick = tricks[0]
    console.log(`\nTesting analytics insert for: ${testTrick.title}`)
    
    const { error: insertError } = await supabase
      .from('trick_analytics')
      .insert({
        trick_id: testTrick.id,
        event_type: 'view',
        session_id: 'test-' + Date.now(),
        metadata: { test: true }
      })
    
    if (insertError) {
      console.error('Error inserting analytics:', insertError)
    } else {
      console.log('✅ Analytics event inserted successfully!')
    }
  }
  
  // 3. Check analytics count
  const { data: analytics, error: analyticsError } = await supabase
    .from('trick_analytics')
    .select('id')
  
  if (analyticsError) {
    console.error('Error fetching analytics:', analyticsError)
  } else {
    console.log(`\nTotal analytics events: ${analytics.length}`)
  }
}

testAnalytics()