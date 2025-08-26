#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

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

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper function to parse array fields from CSV
function parseArrayField(field: string | undefined): string[] {
  if (!field || field.trim() === '') return []
  return field.split(';').map(item => item.trim()).filter(Boolean)
}

// Helper function to extract "Warum es funktioniert" from description
function extractWhyItWorks(description: string): { description: string; whyItWorks: string } {
  const match = description.match(/\*\*Warum es funktioniert:\*\*\s*(.+)$/s)
  if (match) {
    return {
      description: description.replace(match[0], '').trim(),
      whyItWorks: match[1].trim()
    }
  }
  return {
    description,
    whyItWorks: ''
  }
}

interface CSVTrick {
  title: string
  description: string
  category: string
  difficulty: string
  timeToImplement: string
  impact: string
  tools: string
  departmentTags?: string
  industryTags?: string
  steps?: string
  examples?: string
  slug?: string
}

interface JSONTrick {
  title: string
  description: string
  category: string
  difficulty: string
  timeToImplement: string
  impact: string
  tools: string[]
  departmentTags?: string[]
  industryTags?: string[]
  steps?: string[]
  examples?: string[]
  slug?: string
  whyItWorks?: string
  'Warum es funktioniert'?: string
}

async function bulkImportTricks(filePath: string) {
  console.log('🚀 Starting bulk import from:', filePath)
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`)
      process.exit(1)
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const fileExtension = path.extname(filePath).toLowerCase()
    
    let tricks: any[] = []
    
    // Parse based on file type
    if (fileExtension === '.csv') {
      console.log('📄 Processing CSV file...')
      
      const records: CSVTrick[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ','
      })
      
      tricks = records.map((record, index) => {
        const { description, whyItWorks } = extractWhyItWorks(record.description)
        
        return {
          title: record.title,
          description,
          category: record.category,
          difficulty: record.difficulty,
          tools: parseArrayField(record.tools),
          time_to_implement: record.timeToImplement,
          impact: record.impact,
          department_tags: parseArrayField(record.departmentTags),
          industry_tags: parseArrayField(record.industryTags),
          steps: parseArrayField(record.steps),
          examples: parseArrayField(record.examples),
          slug: record.slug || generateSlug(record.title),
          why_it_works: whyItWorks || `Dieser Trick nutzt die Stärken von KI-Tools optimal aus, um ${record.title.toLowerCase()} zu ermöglichen.`,
          status: 'published',
          published_at: new Date().toISOString(),
          view_count: 0,
          like_count: 0
        }
      })
      
    } else if (fileExtension === '.json') {
      console.log('📄 Processing JSON file...')
      
      const jsonData = JSON.parse(fileContent)
      const records: JSONTrick[] = Array.isArray(jsonData) ? jsonData : [jsonData]
      
      tricks = records.map((record, index) => {
        const { description, whyItWorks } = extractWhyItWorks(record.description)
        
        return {
          title: record.title,
          description,
          category: record.category,
          difficulty: record.difficulty,
          tools: Array.isArray(record.tools) ? record.tools : parseArrayField(record.tools as any),
          time_to_implement: record.timeToImplement,
          impact: record.impact,
          department_tags: record.departmentTags || [],
          industry_tags: record.industryTags || [],
          steps: record.steps || [],
          examples: record.examples || [],
          slug: record.slug || generateSlug(record.title),
          why_it_works: record.whyItWorks || record['Warum es funktioniert'] || whyItWorks || 
            `Dieser Trick nutzt die Stärken von KI-Tools optimal aus, um ${record.title.toLowerCase()} zu ermöglichen.`,
          status: 'published',
          published_at: new Date().toISOString(),
          view_count: 0,
          like_count: 0
        }
      })
      
    } else {
      console.error(`❌ Unsupported file type: ${fileExtension}`)
      console.log('   Supported formats: .csv, .json')
      process.exit(1)
    }
    
    if (tricks.length === 0) {
      console.log('⚠️  No tricks found in file')
      return
    }
    
    console.log(`📦 Found ${tricks.length} tricks to import`)
    
    // Validate tricks before import
    console.log('\n🔍 Validating tricks...')
    const validTricks = []
    const invalidTricks = []
    
    const validCategories = ['productivity', 'content-creation', 'programming', 'design', 'data-analysis', 'learning', 'business', 'marketing']
    const validDifficulties = ['beginner', 'intermediate', 'advanced']
    const validImpacts = ['low', 'medium', 'high']
    
    for (const [index, trick] of tricks.entries()) {
      const errors = []
      
      if (!trick.title) errors.push('Missing title')
      if (!trick.description) errors.push('Missing description')
      if (!validCategories.includes(trick.category)) errors.push(`Invalid category: ${trick.category}`)
      if (!validDifficulties.includes(trick.difficulty)) errors.push(`Invalid difficulty: ${trick.difficulty}`)
      if (!validImpacts.includes(trick.impact)) errors.push(`Invalid impact: ${trick.impact}`)
      if (!trick.tools || trick.tools.length === 0) errors.push('Missing tools')
      if (!trick.time_to_implement) errors.push('Missing time_to_implement')
      if (!trick.slug) errors.push('Missing slug')
      
      if (errors.length > 0) {
        console.log(`   ❌ Row ${index + 1}: ${errors.join(', ')}`)
        invalidTricks.push({ trick, errors })
      } else {
        validTricks.push(trick)
      }
    }
    
    if (invalidTricks.length > 0) {
      console.log(`\n⚠️  ${invalidTricks.length} invalid tricks found`)
      console.log('   Fix the errors above and try again')
      
      // Optional: Save invalid tricks to a file for review
      const invalidFile = path.join(process.cwd(), 'data', 'invalid-tricks.json')
      fs.writeFileSync(invalidFile, JSON.stringify(invalidTricks, null, 2))
      console.log(`   Invalid tricks saved to: ${invalidFile}`)
    }
    
    if (validTricks.length === 0) {
      console.log('❌ No valid tricks to import')
      return
    }
    
    console.log(`\n✅ ${validTricks.length} valid tricks ready for import`)
    
    // Check for duplicate slugs in database
    console.log('\n🔍 Checking for duplicates...')
    const slugs = validTricks.map(t => t.slug)
    const { data: existingTricks, error: checkError } = await supabase
      .from('ki_tricks')
      .select('slug')
      .in('slug', slugs)
    
    if (checkError) {
      console.error('❌ Error checking for duplicates:', checkError.message)
      process.exit(1)
    }
    
    const existingSlugs = new Set((existingTricks || []).map(t => t.slug))
    const newTricks = validTricks.filter(t => !existingSlugs.has(t.slug))
    const duplicateTricks = validTricks.filter(t => existingSlugs.has(t.slug))
    
    if (duplicateTricks.length > 0) {
      console.log(`⚠️  ${duplicateTricks.length} tricks with duplicate slugs found:`)
      duplicateTricks.forEach(t => console.log(`   - ${t.slug}: ${t.title}`))
    }
    
    if (newTricks.length === 0) {
      console.log('⚠️  All tricks already exist in database')
      return
    }
    
    console.log(`\n📤 Importing ${newTricks.length} new tricks...`)
    
    // Insert tricks in batches of 10
    const batchSize = 10
    let successCount = 0
    let errorCount = 0
    const errors: any[] = []
    
    for (let i = 0; i < newTricks.length; i += batchSize) {
      const batch = newTricks.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('ki_tricks')
        .insert(batch)
        .select()
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message)
        errorCount += batch.length
        errors.push({ batch, error: error.message })
      } else {
        successCount += data.length
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} inserted (${data.length} tricks)`)
        
        // Show titles of imported tricks
        data.forEach(trick => {
          console.log(`   ✓ ${trick.title}`)
        })
      }
    }
    
    // Save error details if any
    if (errors.length > 0) {
      const errorFile = path.join(process.cwd(), 'data', 'import-errors.json')
      fs.writeFileSync(errorFile, JSON.stringify(errors, null, 2))
      console.log(`\n❌ Error details saved to: ${errorFile}`)
    }
    
    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 Import Summary:')
    console.log('='.repeat(50))
    console.log(`✅ Successfully imported: ${successCount} tricks`)
    if (duplicateTricks.length > 0) {
      console.log(`⚠️  Skipped (duplicates): ${duplicateTricks.length} tricks`)
    }
    if (invalidTricks.length > 0) {
      console.log(`❌ Invalid (not imported): ${invalidTricks.length} tricks`)
    }
    if (errorCount > 0) {
      console.log(`❌ Failed to import: ${errorCount} tricks`)
    }
    console.log('='.repeat(50))
    
    if (successCount > 0) {
      console.log('\n🎉 Import completed successfully!')
      console.log('\n📌 Next steps:')
      console.log('   1. Go to your Supabase dashboard')
      console.log('   2. Check the ki_tricks table to verify data')
      console.log('   3. Visit your app to see the new tricks!')
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

// Get file path from command line arguments
const args = process.argv.slice(2)
if (args.length === 0) {
  console.log('📖 Usage: npm run import-tricks <file-path>')
  console.log('\nExamples:')
  console.log('  npm run import-tricks data/ki-tricks-template.csv')
  console.log('  npm run import-tricks data/new-tricks.json')
  console.log('\nSupported formats: CSV, JSON')
  console.log('\nCSV Format:')
  console.log('  - Headers: title,description,category,difficulty,timeToImplement,impact,tools,departmentTags,industryTags,steps,examples,slug')
  console.log('  - Array fields (tools, tags, steps, examples) use semicolon (;) as separator')
  console.log('\nJSON Format:')
  console.log('  - Can be single object or array of objects')
  console.log('  - Array fields should be actual arrays')
  process.exit(0)
}

const filePath = path.resolve(process.cwd(), args[0])
bulkImportTricks(filePath)