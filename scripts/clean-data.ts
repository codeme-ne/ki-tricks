#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const patterns = [
  'generated-ki-tips.json',
  'generated-ki-tips.supabase.json',
  '*.supabase.json'
]

function matches(file: string, pattern: string) {
  if (pattern.includes('*')) {
    const regex = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$')
    return regex.test(file)
  }
  return file === pattern
}

let removed = 0
if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir)
  for (const f of files) {
    if (patterns.some(p => matches(f, p))) {
      const full = path.join(dataDir, f)
      try {
        fs.unlinkSync(full)
        removed++
        console.log(`Removed: ${path.join('data', f)}`)
      } catch (e) {
        console.warn(`Failed to remove ${f}:`, e)
      }
    }
  }
}

if (removed === 0) {
  console.log('No generated data files found to clean.')
}

