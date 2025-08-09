#!/usr/bin/env tsx
// Demo-Script um das Content-Scraping-System mit echten Dateien zu testen

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { ContentBatchProcessor, BatchConfig } from '../src/lib/ai/content-batch-processor';

async function demoRun() {
  console.log('🎭 Demo-Lauf: KI-Tricks Content Scraper mit Dateierstellung...\n');
  
  // Environment Check für OpenAI
  console.log('🔑 Environment Check:');
  console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Gesetzt ✅' : 'FEHLT ❌'}`);
  console.log(`   ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? 'Gesetzt ✅' : 'FEHLT ❌'}`);
  console.log('');
  
  const demoConfig: BatchConfig = {
    maxTricksPerRun: 2,
    minConfidenceScore: 60,
    outputFormat: 'both',
    dryRun: false,
    useDemo: true,
    platforms: ['reddit']
  };

  console.log('📋 Demo-Konfiguration:');
  console.log(`🎯 Max Tricks: ${demoConfig.maxTricksPerRun}`);
  console.log(`🔒 Mindest-Confidence: ${demoConfig.minConfidenceScore}%`);
  console.log(`💾 Output-Format: ${demoConfig.outputFormat}`);
  console.log(`🧪 Dry-Run: ${demoConfig.dryRun ? 'Ja' : 'Nein'}`);
  console.log(`🎭 Demo-Modus: ${demoConfig.useDemo ? 'Ja' : 'Nein'}`);
  console.log(`🌐 Plattformen: ${demoConfig.platforms.join(', ')}`);
  console.log('');

  try {
    const processor = new ContentBatchProcessor();
    const result = await processor.processBatch(demoConfig);
    
    if (result.newTricks.length > 0) {
      console.log('\n🎯 ERSTELLTE KI-TRICKS:');
      result.newTricks.forEach((trick, index) => {
        console.log(`\n${index + 1}. **${trick.title}**`);
        console.log(`   Kategorie: ${trick.category}`);
        console.log(`   Schwierigkeit: ${trick.difficulty}`);
        console.log(`   Tools: ${trick.tools.join(', ')}`);
        console.log(`   Zeit: ${trick.timeToImplement}`);
        console.log(`   Impact: ${trick.impact}`);
        console.log(`   Schritte: ${trick.steps ? trick.steps.length : 0}`);
        console.log(`   Beispiele: ${trick.examples ? trick.examples.length : 0}`);
      });
      
      console.log('\n🎉 Demo erfolgreich abgeschlossen!');
      console.log('💡 Die erstellten Dateien findest du im scraped-content/ Verzeichnis');
    } else {
      console.log('⚠️ Keine Tricks erstellt - prüfe die Konfiguration');
    }
    
  } catch (error) {
    console.error('❌ Demo-Fehler:', error);
  }
}

// Führe Demo aus
demoRun().catch(console.error);