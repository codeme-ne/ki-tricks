#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
console.log('\nMigrate to Supabase')
console.log('-------------------')
if (!fs.existsSync(schemaPath)) {
  console.error('Could not find supabase/schema.sql in this project.')
  process.exit(1)
}

console.log('This script prints guidance for applying the schema:')
console.log('\nOptions:')
console.log('1) Open Supabase SQL Editor and paste the contents of supabase/schema.sql')
console.log('2) Or use the Supabase CLI:')
console.log('   supabase db push   # with a linked local project')
console.log('\nPath to schema: ' + schemaPath)
console.log('\nTip: Ensure env vars NEXT_PUBLIC_SUPABASE_URL and keys are configured in .env.local')

