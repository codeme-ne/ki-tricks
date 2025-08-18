#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { mockTricks } from '../src/lib/data/mock-data'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function migrateTricks() {
  console.log('🚀 Starting migration to Supabase...\n')
  
  try {
    // Check if tricks already exist
    const { data: existingTricks, error: checkError } = await supabase
      .from('ki_tricks')
      .select('id')
      .limit(1)
    
    if (checkError && !checkError.message.includes('no rows')) {
      throw checkError
    }
    
    if (existingTricks && existingTricks.length > 0) {
      console.log('⚠️  Tricks already exist in database. Skipping migration.')
      console.log('   To re-run migration, delete existing tricks first.\n')
      return
    }
    
    // Prepare tricks for insertion
    const tricksToInsert = mockTricks.map(trick => ({
      title: trick.title,
      description: trick.description,
      category: trick.category,
      difficulty: trick.difficulty,
      tools: trick.tools,
      time_to_implement: trick.timeToImplement,
      impact: trick.impact,
      steps: trick.steps || [],
      examples: trick.examples || [],
      slug: trick.slug,
      why_it_works: trick['Warum es funktioniert'],
      status: 'published',
      published_at: new Date().toISOString(),
      view_count: 0,
      like_count: 0
    }))
    
    console.log(`📦 Migrating ${tricksToInsert.length} tricks...`)
    
    // Insert tricks in batches of 10
    const batchSize = 10
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < tricksToInsert.length; i += batchSize) {
      const batch = tricksToInsert.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('ki_tricks')
        .insert(batch)
        .select()
      
      if (error) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message)
        errorCount += batch.length
      } else {
        successCount += data.length
        console.log(`✅ Batch ${i / batchSize + 1} inserted (${data.length} tricks)`)
      }
    }
    
    console.log('\n📊 Migration Summary:')
    console.log(`   ✅ Successfully migrated: ${successCount} tricks`)
    if (errorCount > 0) {
      console.log(`   ❌ Failed: ${errorCount} tricks`)
    }
    
    // Load and migrate pending/approved tricks from JSON files
    console.log('\n📂 Checking for additional JSON data...')
    
    const dataDir = path.join(process.cwd(), 'data')
    const pendingFile = path.join(dataDir, 'pending-tricks.json')
    const approvedFile = path.join(dataDir, 'approved-tricks.json')
    
    // Migrate pending tricks as submissions
    if (fs.existsSync(pendingFile)) {
      const pendingData = JSON.parse(fs.readFileSync(pendingFile, 'utf-8'))
      if (pendingData.length > 0) {
        console.log(`\n📝 Found ${pendingData.length} pending submissions`)
        
        for (const trick of pendingData) {
          const { data, error } = await supabase
            .from('trick_submissions')
            .insert({
              trick_data: trick,
              status: trick.status || 'pending',
              quality_score: trick.qualityScore || null,
              created_at: trick.createdAt || new Date().toISOString()
            })
            .select()
          
          if (error) {
            console.error(`❌ Error inserting submission:`, error.message)
          } else {
            console.log(`✅ Migrated submission: ${trick.title}`)
          }
        }
      }
    }
    
    // Migrate approved tricks
    if (fs.existsSync(approvedFile)) {
      const approvedData = JSON.parse(fs.readFileSync(approvedFile, 'utf-8'))
      if (approvedData.length > 0) {
        console.log(`\n✨ Found ${approvedData.length} approved tricks to migrate`)
        
        for (const trick of approvedData) {
          const { data, error } = await supabase
            .from('ki_tricks')
            .insert({
              title: trick.title,
              description: trick.description,
              category: trick.category,
              difficulty: trick.difficulty,
              tools: trick.tools,
              time_to_implement: trick.timeToImplement,
              impact: trick.impact,
              steps: trick.steps || [],
              examples: trick.examples || [],
              slug: trick.slug,
              why_it_works: trick['Warum es funktioniert'] || trick.why_it_works,
              status: 'published',
              published_at: trick.publishedAt || new Date().toISOString(),
              quality_score: trick.qualityScore || null,
              quality_category: trick.qualityCategory || null
            })
            .select()
          
          if (error) {
            console.error(`❌ Error inserting approved trick:`, error.message)
          } else {
            console.log(`✅ Migrated approved trick: ${trick.title}`)
          }
        }
      }
    }
    
    console.log('\n🎉 Migration completed successfully!')
    console.log('\n📌 Next steps:')
    console.log('   1. Go to your Supabase dashboard')
    console.log('   2. Check the ki_tricks table to verify data')
    console.log('   3. You can now add/edit tricks directly in Supabase!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateTricks()