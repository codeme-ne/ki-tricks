#!/usr/bin/env tsx

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { glob } from 'glob';

/**
 * Automatisches Build-Fix-Script für KI-Tricks Platform
 * 
 * Behebt häufige TypeScript-Build-Fehler:
 * - Fehlende createdAt/updatedAt Felder in gescrapeten Tricks
 * - Falsche Import-Pfade in scraped-content/*.ts Dateien
 * - Undefined optional properties
 */

class BuildErrorFixer {
  
  async fixAll(): Promise<void> {
    
    await this.fixScrapedContentFiles();
    await this.fixImportPaths();
    await this.addMissingDateFields();
    
  }

  // Fix 1: Scraped Content TypeScript Dateien
  private async fixScrapedContentFiles(): Promise<void> {
    
    const tsFiles = await glob('scraped-content/*.ts');
    
    for (const file of tsFiles) {
      try {
        let content = readFileSync(file, 'utf-8');
        let modified = false;

        // Fix Import-Pfade
        if (content.includes("from '../types'")) {
          content = content.replace("from '../types'", "from '../app/lib/types'");
          modified = true;
        }

        // Füge fehlende Felder hinzu
        if (content.includes('"id":') && !content.includes('"createdAt":')) {
          content = this.addDateFieldsToJson(content);
          modified = true;
        }

        if (modified) {
          writeFileSync(file, content);
        }
      } catch (error) {
      }
    }
  }

  // Fix 2: Import-Pfade korrigieren
  private async fixImportPaths(): Promise<void> {
    
    const files = await glob('app/**/*.ts');
    
    for (const file of files) {
      try {
        let content = readFileSync(file, 'utf-8');
        let modified = false;

        // Häufige falsche Import-Pfade
        const fixes = [
          { from: "from './types'", to: "from '../types'" },
          { from: "from '../../types'", to: "from '../types'" }
        ];

        for (const fix of fixes) {
          if (content.includes(fix.from)) {
            content = content.replace(new RegExp(fix.from, 'g'), fix.to);
            modified = true;
          }
        }

        if (modified) {
          writeFileSync(file, content);
        }
      } catch (error) {
        // Ignoriere Fehler bei nicht-TypeScript Dateien
      }
    }
  }

  // Fix 3: Füge fehlende Date-Felder zu JSON hinzu
  private addDateFieldsToJson(content: string): string {
    const now = new Date().toISOString();
    
    // Finde alle Objekten mit "id" aber ohne "createdAt"
    return content.replace(
      /"id":\s*"[^"]+",(?!\s*"createdAt")/g,
      (match) => `${match}\n    "createdAt": "${now}",\n    "updatedAt": "${now}",`
    );
  }

  // Fix 4: Füge Date-Felder zu existierenden KITrick Objekten hinzu
  private async addMissingDateFields(): Promise<void> {
    
    const jsonFiles = await glob('scraped-content/*.json');
    
    for (const file of jsonFiles) {
      try {
        const content = readFileSync(file, 'utf-8');
        const data = JSON.parse(content);
        
        if (Array.isArray(data)) {
          let modified = false;
          const now = new Date().toISOString();
          
          data.forEach(item => {
            if (item.id && !item.createdAt) {
              item.createdAt = now;
              item.updatedAt = now;
              modified = true;
            }
          });
          
          if (modified) {
            writeFileSync(file, JSON.stringify(data, null, 2));
          }
        }
      } catch (error) {
      }
    }
  }

  // Utility: Entferne problematische Dateien
  async removeBrokenFiles(): Promise<void> {
    
    const problematicFiles = [
      'scraped-content/kitricks-2025-08-04.ts' // Alte Version ohne Date-Felder
    ];
    
    for (const file of problematicFiles) {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const fixer = new BuildErrorFixer();
  
  try {
    if (args.includes('--remove-broken')) {
      await fixer.removeBrokenFiles();
    } else {
      await fixer.fixAll();
    }
  } catch (error) {
    console.error(`❌ Fix-Script fehlgeschlagen: ${error}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}