#!/usr/bin/env node

import { promises as fs } from 'fs'
import * as path from 'path'
import { KITrick } from '../src/lib/types/types'

interface PendingKITrick extends Omit<KITrick, 'createdAt' | 'updatedAt'> {
  createdAt: Date | string
  updatedAt: Date | string
  status?: 'pending' | 'approved' | 'rejected'
}

// Helper function to generate slugs
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const map: { [key: string]: string } = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }
      return map[match] || match
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function mergeApprovedTricks() {
  try {
    
    // Read approved tricks
    const approvedTricksPath = path.join(process.cwd(), 'data', 'approved-tricks.json')
    const approvedTricksContent = await fs.readFile(approvedTricksPath, 'utf-8')
    const approvedTricks: PendingKITrick[] = JSON.parse(approvedTricksContent)
    
    if (approvedTricks.length === 0) {
      return
    }
    
    
    // Read current mock-data.ts
    const mockDataPath = path.join(process.cwd(), 'src', 'lib', 'data', 'mock-data.ts')
    const mockDataContent = await fs.readFile(mockDataPath, 'utf-8')
    
    // Extract existing tricks from mock-data.ts to check for duplicate slugs
    const existingTricksMatch = mockDataContent.match(/export const mockTricks: KITrick\[\] = \[([\s\S]*?)\]/)
    if (!existingTricksMatch) {
      console.error('❌ Konnte bestehende Tricks nicht aus mock-data.ts extrahieren.')
      return
    }
    
    // Extract existing slugs to avoid duplicates
    const existingSlugs = new Set<string>()
    const slugRegex = /slug:\s*(?:generateSlug\([^)]+\)|'([^']+)')/g
    let match
    while ((match = slugRegex.exec(mockDataContent)) !== null) {
      if (match[1]) {
        existingSlugs.add(match[1])
      }
    }
    
    // Generate TypeScript code for new tricks
    const newTricksCode = approvedTricks.map((trick, index) => {
      // Ensure we have all required fields with proper defaults
      let baseSlug = trick.slug || generateSlug(trick.title || `trick-${Date.now()}`)
      let finalSlug = baseSlug
      let counter = 1
      
      // Check for duplicate slugs and append number if necessary
      while (existingSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`
        counter++
      }
      existingSlugs.add(finalSlug)
      
      // Convert dates to proper format
      const createdAt = trick.createdAt instanceof Date 
        ? trick.createdAt.toISOString()
        : typeof trick.createdAt === 'string' 
          ? trick.createdAt
          : new Date().toISOString()
      
      const updatedAt = trick.updatedAt instanceof Date 
        ? trick.updatedAt.toISOString()
        : typeof trick.updatedAt === 'string' 
          ? trick.updatedAt
          : new Date().toISOString()
      
      const sanitizedTrick = {
        id: trick.id?.replace(/^approved-/, '') || `generated-${Date.now()}-${index}`,
        title: trick.title || 'Unbenannter Trick',
        description: trick.description || 'Keine Beschreibung verfügbar',
        category: trick.category || 'productivity',
        difficulty: trick.difficulty || 'beginner',
        tools: Array.isArray(trick.tools) ? trick.tools : ['Claude'],
        timeToImplement: trick.timeToImplement || '10 Minuten',
        impact: trick.impact || 'medium',
        steps: Array.isArray(trick.steps) ? trick.steps : [],
        examples: Array.isArray(trick.examples) ? trick.examples : [],
        slug: finalSlug,
        createdAt,
        updatedAt,
        'Warum es funktioniert': trick['Warum es funktioniert'] || 
          'Dieser Trick nutzt bewährte KI-Prinzipien und wurde von der Community erprobt.'
      }

      // Clean up the trick data for TypeScript code generation
      const escapeString = (str: string): string => str.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')
      
      const cleanTrick = {
        id: `'${escapeString(sanitizedTrick.id)}'`,
        title: `'${escapeString(sanitizedTrick.title)}'`,
        description: `'${escapeString(sanitizedTrick.description)}'`,
        category: `'${sanitizedTrick.category}'`,
        difficulty: `'${sanitizedTrick.difficulty}'`,
        tools: sanitizedTrick.tools.map(tool => `'${escapeString(String(tool))}'`),
        timeToImplement: `'${escapeString(sanitizedTrick.timeToImplement)}'`,
        impact: `'${sanitizedTrick.impact}'`,
        steps: sanitizedTrick.steps.map(step => `'${escapeString(String(step))}'`),
        examples: sanitizedTrick.examples.map(ex => `'${escapeString(String(ex))}'`),
        slug: `generateSlug('${escapeString(sanitizedTrick.title)}')`,
        createdAt: `new Date('${sanitizedTrick.createdAt}')`,
        updatedAt: `new Date('${sanitizedTrick.updatedAt}')`,
        'Warum es funktioniert': `'${escapeString(sanitizedTrick['Warum es funktioniert'])}'`
      }
      
      return `  {
    id: ${cleanTrick.id},
    title: ${cleanTrick.title},
    description: ${cleanTrick.description},
    category: ${cleanTrick.category} as Category,
    difficulty: ${cleanTrick.difficulty} as Difficulty,
    tools: [${cleanTrick.tools.join(', ')}],
    timeToImplement: ${cleanTrick.timeToImplement},
    impact: ${cleanTrick.impact} as Impact,${cleanTrick.steps.length > 0 ? `
    steps: [
      ${cleanTrick.steps.join(',\n      ')}
    ],` : ''}${cleanTrick.examples.length > 0 ? `
    examples: [
      ${cleanTrick.examples.join(',\n      ')}
    ],` : ''}
    slug: ${cleanTrick.slug},
    createdAt: ${cleanTrick.createdAt},
    updatedAt: ${cleanTrick.updatedAt},
    'Warum es funktioniert': ${cleanTrick['Warum es funktioniert']}
  }`
    }).join(',\n')
    
    // Insert new tricks at the beginning of the array
    const updatedMockData = mockDataContent.replace(
      /export const mockTricks: KITrick\[\] = \[/,
      `export const mockTricks: KITrick[] = [
${newTricksCode},`
    )
    
    // Write updated mock-data.ts
    await fs.writeFile(mockDataPath, updatedMockData)
    
    // Clear approved tricks after successful merge
    await fs.writeFile(approvedTricksPath, '[]')
    
    
  } catch (error) {
    console.error('❌ Fehler beim Merge-Prozess:', error)
    process.exit(1)
  }
}

// Run the merge
mergeApprovedTricks()