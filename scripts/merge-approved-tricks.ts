#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'

interface KITrick {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  tools: string[]
  timeToImplement: string
  impact: string
  steps?: string[]
  examples?: string[]
  slug: string
  createdAt: Date
  updatedAt: Date
  'Warum es funktioniert': string
}

async function mergeApprovedTricks() {
  try {
    console.log('🔄 Starte Merge-Prozess für genehmigte Tricks...')
    
    // Read approved tricks
    const approvedTricksPath = path.join(process.cwd(), 'data', 'approved-tricks.json')
    const approvedTricksContent = await fs.readFile(approvedTricksPath, 'utf-8')
    const approvedTricks: KITrick[] = JSON.parse(approvedTricksContent)
    
    if (approvedTricks.length === 0) {
      console.log('ℹ️  Keine genehmigten Tricks zum Mergen gefunden.')
      return
    }
    
    console.log(`📦 ${approvedTricks.length} genehmigte Tricks gefunden.`)
    
    // Read current mock-data.ts
    const mockDataPath = path.join(process.cwd(), 'src', 'lib', 'data', 'mock-data.ts')
    const mockDataContent = await fs.readFile(mockDataPath, 'utf-8')
    
    // Extract existing tricks from mock-data.ts
    const existingTricksMatch = mockDataContent.match(/export const mockTricks: KITrick\[\] = \[([\s\S]*?)\]/)
    if (!existingTricksMatch) {
      console.error('❌ Konnte bestehende Tricks nicht aus mock-data.ts extrahieren.')
      return
    }
    
    // Generate TypeScript code for new tricks
    const newTricksCode = approvedTricks.map(trick => {
      // Clean up the trick data
      const cleanTrick = {
        ...trick,
        id: `'${trick.id.replace('approved-', '')}'`,
        title: `'${trick.title.replace(/'/g, "\\'")}'`,
        description: `'${trick.description.replace(/'/g, "\\'")}'`,
        category: `'${trick.category}'`,
        difficulty: `'${trick.difficulty}'`,
        tools: trick.tools.map(tool => `'${tool}'`),
        timeToImplement: `'${trick.timeToImplement.replace(/'/g, "\\'")}'`,
        impact: `'${trick.impact}'`,
        steps: trick.steps?.map(step => `'${step.replace(/'/g, "\\'")}'`) || [],
        examples: trick.examples?.map(ex => `'${ex.replace(/'/g, "\\'")}'`) || [],
        slug: `'${trick.slug}'`,
        createdAt: `new Date('${trick.createdAt}')`,
        updatedAt: `new Date('${trick.updatedAt}')`,
        'Warum es funktioniert': `'${trick['Warum es funktioniert'].replace(/'/g, "\\'")}'`
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
    console.log('✅ Mock-data.ts erfolgreich aktualisiert!')
    
    // Clear approved tricks after successful merge
    await fs.writeFile(approvedTricksPath, '[]')
    console.log('🧹 Approved-tricks.json wurde geleert.')
    
    console.log('🎉 Merge-Prozess erfolgreich abgeschlossen!')
    
  } catch (error) {
    console.error('❌ Fehler beim Merge-Prozess:', error)
    process.exit(1)
  }
}

// Run the merge
mergeApprovedTricks()