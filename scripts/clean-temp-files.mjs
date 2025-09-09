#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const cwd = process.cwd()
const suspects = [
  '--in-place',
  'tsconfig.tsbuildinfo'
]

let cleaned = 0
for (const name of suspects) {
  const full = path.join(cwd, name)
  if (fs.existsSync(full)) {
    try {
      fs.unlinkSync(full)
      cleaned++
      console.log(`Removed temp file: ${name}`)
    } catch (e) {
      console.warn(`Could not remove ${name}:`, e.message)
    }
  }
}

if (cleaned === 0) {
  console.log('No temp files to clean.')
}

