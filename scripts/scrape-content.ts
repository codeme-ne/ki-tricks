#!/usr/bin/env tsx
import { config } from 'dotenv';
import path from 'path';

// Lade Environment Variables aus .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { ContentBatchProcessor, DEFAULT_BATCH_CONFIGS, BatchConfig } from '../src/lib/ai/content-batch-processor';

// Kommandozeilen-Argumente parsen
function parseArgs(): { config: string; dryRun?: boolean; maxTricks?: number } {
  const args = process.argv.slice(2);
  const result: any = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--config':
        result.config = args[i + 1];
        i++;
        break;
      case '--dry-run':
        result.dryRun = true;
        break;
      case '--max-tricks':
        result.maxTricks = parseInt(args[i + 1]);
        i++;
        break;
      case '--help':
        showHelp();
        process.exit(0);
        break;
      default:
        if (!result.config) {
          result.config = arg;
        }
    }
  }
  
  return result;
}

function showHelp() {
  console.log(`
🚀 KI-Tricks Content Scraper

VERWENDUNG:
  npm run scrape-content [config] [optionen]

KONFIGURATIONEN:
  quick      - Schneller Test-Lauf (10 Tricks, Demo-Daten)
  test       - Echter Apify-Test (3 Tricks, Dry-Run, echtes Scraping)
  production - Vollständiger Lauf (50 Tricks, alle Plattformen)
  premium    - Hochqualitative Tricks (20 Tricks, hohe Confidence)

OPTIONEN:
  --dry-run           Führe Scraping durch ohne Dateien zu speichern
  --max-tricks N      Begrenze auf N Tricks
  --help             Zeige diese Hilfe

BEISPIELE:
  npm run scrape-content quick
  npm run scrape-content production --dry-run
  npm run scrape-content premium --max-tricks 15

UMGEBUNGSVARIABLEN:
  APIFY_API_TOKEN     Dein Apify API Token (optional, Default verwendet)
`);
}

async function main() {
  console.log('🤖 KI-Tricks Content Scraper gestartet...\n');
  
  // Debug: Environment Variables Status
  console.log('🔑 Environment Check:');
  console.log(`   APIFY_API_TOKEN: ${process.env.APIFY_API_TOKEN ? 'Gesetzt ✅' : 'Fehlt ❌'}`);
  console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Gesetzt ✅' : 'Fehlt ❌'}`);
  console.log(`   ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? 'Gesetzt ✅' : 'Fehlt ❌'}`);
  console.log('');
  
  try {
    const args = parseArgs();
    const configName = args.config || 'quick';
    
    // Lade Basis-Konfiguration
    let config: BatchConfig;
    switch (configName) {
      case 'quick':
        config = DEFAULT_BATCH_CONFIGS.quick;
        break;
      case 'test':
        config = DEFAULT_BATCH_CONFIGS.test;
        break;
      case 'production':
        config = DEFAULT_BATCH_CONFIGS.production;
        break;
      case 'premium':
        config = DEFAULT_BATCH_CONFIGS.premium;
        break;
      default:
        console.error(`❌ Unbekannte Konfiguration: ${configName}`);
        console.log('Verfügbare Konfigurationen: quick, test, production, premium');
        process.exit(1);
    }
    
    // Überschreibe mit Kommandozeilen-Argumenten
    if (args.dryRun !== undefined) {
      config.dryRun = args.dryRun;
    }
    if (args.maxTricks) {
      config.maxTricksPerRun = args.maxTricks;
    }
    
    console.log(`📋 Verwende Konfiguration: ${configName}`);
    console.log(`🎯 Max Tricks: ${config.maxTricksPerRun}`);
    console.log(`🔒 Mindest-Confidence: ${config.minConfidenceScore}%`);
    console.log(`💾 Output-Format: ${config.outputFormat}`);
    console.log(`🧪 Dry-Run: ${config.dryRun ? 'Ja' : 'Nein'}`);
    console.log(`🌐 Plattformen: ${config.platforms.join(', ')}`);
    console.log('');
    
    // Starte Batch-Processing
    const processor = new ContentBatchProcessor();
    const result = await processor.processBatch(config);
    
    // Exit-Code basierend auf Ergebnis
    if (result.newTricks.length === 0 && result.errors.length > 0) {
      console.error('❌ Scraping fehlgeschlagen');
      process.exit(1);
    }
    
    if (result.newTricks.length === 0) {
      console.log('⚠️ Keine neuen Tricks gefunden');
      process.exit(0);
    }
    
    console.log(`✅ ${result.newTricks.length} neue KI-Tricks erfolgreich erstellt!`);
    
    // Zeige nächste Schritte
    if (!config.dryRun) {
      console.log('\n🎯 NÄCHSTE SCHRITTE:');
      console.log('1. Prüfe die erstellten Dateien im scraped-content/ Verzeichnis');
      console.log('2. Reviewe die Tricks manuell auf Qualität');
      console.log('3. Integriere gewünschte Tricks in mock-data.ts');
      console.log('4. Teste die neuen Tricks auf der Website');
    }
    
  } catch (error) {
    console.error('❌ Unerwarteter Fehler:', error);
    process.exit(1);
  }
}

// Führe das Script aus
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}