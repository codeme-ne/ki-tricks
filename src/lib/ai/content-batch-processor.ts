import { RedditScraper } from './reddit-scraper';
import { AIContentProcessor, ProcessingResult } from './ai-content-processor';
import { ClaudeAIProcessor, ClaudeProcessingResult } from './claude-ai-processor';
import { KITrick } from '../types/types';
import { RawContent } from './content-scraper';
import { DemoContentScraper } from './demo-content-scraper';
import fs from 'fs/promises';
import path from 'path';

// Batch-Processing Konfiguration
export interface BatchConfig {
  maxTricksPerRun: number;
  minConfidenceScore: number;
  outputFormat: 'json' | 'typescript' | 'both';
  outputPath?: string;
  dryRun?: boolean;
  useDemo?: boolean;
  platforms: ('reddit' | 'twitter' | 'hackernews')[];
}

// Batch-Processing Ergebnisse
export interface BatchResult {
  totalProcessed: number;
  successfulTricks: number;
  failedProcessing: number;
  duplicatesSkipped: number;
  lowQualitySkipped: number;
  newTricks: KITrick[];
  processingTime: number;
  errors: string[];
}

export class ContentBatchProcessor {
  private redditScraper: RedditScraper;
  private existingTricks: KITrick[] = [];

  constructor() {
    this.redditScraper = new RedditScraper();
  }

  // Hauptfunktion für Batch-Processing
  async processBatch(config: BatchConfig): Promise<BatchResult> {
    const startTime = Date.now();
    console.log('🚀 Starte Batch-Processing für KI-Tricks...');
    
    const result: BatchResult = {
      totalProcessed: 0,
      successfulTricks: 0,
      failedProcessing: 0,
      duplicatesSkipped: 0,
      lowQualitySkipped: 0,
      newTricks: [],
      processingTime: 0,
      errors: []
    };

    try {
      // 1. Lade existierende Tricks für Duplikat-Check
      await this.loadExistingTricks();
      
      // 2. Scrape Content von allen konfigurierten Plattformen
      const rawContent = await this.scrapeAllPlatforms(config.platforms, config.useDemo);
      result.totalProcessed = rawContent.length;
      
      console.log(`📊 ${rawContent.length} Inhalte gescraped von ${config.platforms.join(', ')}`);
      
      // 3. Verarbeite jeden Content-Item
      for (const content of rawContent) {
        try {
          const processingResult = await this.processSingleContent(content, config);
          
          if (processingResult.success && processingResult.kitrick) {
            // Duplikat-Check
            if (this.isDuplicate(processingResult.kitrick)) {
              result.duplicatesSkipped++;
              continue;
            }
            
            // Qualitäts-Check
            if (processingResult.confidence < config.minConfidenceScore) {
              result.lowQualitySkipped++;
              continue;
            }
            
            result.newTricks.push(processingResult.kitrick);
            result.successfulTricks++;
            
            console.log(`✅ Neuer KI-Trick: "${processingResult.kitrick.title}"`);
            
            // Limit erreicht?
            if (result.newTricks.length >= config.maxTricksPerRun) {
              console.log(`🎯 Limit von ${config.maxTricksPerRun} Tricks erreicht`);
              break;
            }
          } else {
            result.failedProcessing++;
            if (processingResult.error) {
              result.errors.push(processingResult.error);
            }
          }
        } catch (error) {
          result.failedProcessing++;
          result.errors.push(`Processing error: ${error}`);
        }
      }
      
      // 4. Speichere Ergebnisse (außer bei Dry Run)
      if (!config.dryRun && result.newTricks.length > 0) {
        await this.saveResults(result.newTricks, config);
      }
      
      result.processingTime = Date.now() - startTime;
      this.logResults(result, config);
      
      return result;
      
    } catch (error) {
      result.errors.push(`Batch processing failed: ${error}`);
      result.processingTime = Date.now() - startTime;
      return result;
    }
  }

  // Scrape von allen Plattformen
  private async scrapeAllPlatforms(platforms: string[], useDemo: boolean = false): Promise<RawContent[]> {
    const allContent: RawContent[] = [];
    
    if (useDemo) {
      console.log('🎭 Verwende Demo-Modus für Scraping...');
      return await DemoContentScraper.scrapeAllDemo();
    }
    
    for (const platform of platforms) {
      try {
        switch (platform) {
          case 'reddit':
            console.log('🔍 Scraping Reddit...');
            const redditContent = await this.redditScraper.scrapeAISubreddits({
              maxPosts: 30,
              sort: 'hot',
              timeframe: 'week',
              minScore: 3
            });
            allContent.push(...redditContent);
            break;
            
          case 'twitter':
            // TODO: Implementiere Twitter Scraper
            console.log('⏳ Twitter Scraping noch nicht implementiert');
            break;
            
          case 'hackernews':
            // TODO: Implementiere Hacker News Scraper
            console.log('⏳ Hacker News Scraping noch nicht implementiert');
            break;
        }
        
        // Pause zwischen Plattformen
        await this.delay(1000);
        
      } catch (error) {
        console.error(`❌ Fehler beim Scraping von ${platform}:`, error);
        console.log('🎭 Wechsle zu Demo-Modus aufgrund von Scraping-Fehlern...');
        
        // Fallback zu Demo-Daten bei Fehlern
        if (platform === 'reddit') {
          const demoContent = await DemoContentScraper.scrapeRedditDemo();
          allContent.push(...demoContent);
        }
      }
    }
    
    return allContent;
  }

  // Einzelnen Content verarbeiten
  private async processSingleContent(content: RawContent, config: BatchConfig): Promise<ClaudeProcessingResult> {
    console.log(`🔄 Verarbeite: "${content.title.substring(0, 40)}..."`);
    
    // Versuche zuerst den neuen Claude AI Processor
    const result = await ClaudeAIProcessor.processToKITrick(content);
    
    if (result.usedAI) {
      console.log(`🧠 Mit Claude AI verarbeitet - Confidence: ${result.confidence}%`);
    } else {
      console.log(`📝 Mit Pattern-Matching verarbeitet - Confidence: ${result.confidence}%`);
    }
    
    return result;
  }

  // Lade existierende Tricks für Duplikat-Check
  private async loadExistingTricks(): Promise<void> {
    try {
      // Versuche aus mock-data.ts zu laden
      const mockDataPath = path.join(process.cwd(), 'app/lib/mock-data.ts');
      const mockDataContent = await fs.readFile(mockDataPath, 'utf-8');
      
      // Einfacher Regex-basierter Parser für existierende Titles
      const titleMatches = mockDataContent.match(/title:\s*['"]([^'"]+)['"]/g);
      if (titleMatches) {
        this.existingTricks = titleMatches.map((match, index) => ({
          id: `existing-${index}`,
          title: match.replace(/title:\s*['"]([^'"]+)['"]/, '$1'),
          slug: '',
          description: '',
          category: 'productivity' as any,
          difficulty: 'beginner' as any,
          tools: [],
          timeToImplement: '',
          impact: 'medium' as any,
          createdAt: new Date(),
          updatedAt: new Date(),
          'Warum es funktioniert': ''
        }));
      }
      
      console.log(`📚 ${this.existingTricks.length} existierende Tricks geladen`);
      
    } catch (error) {
      console.log('⚠️ Konnte existierende Tricks nicht laden, verwende leere Liste');
      this.existingTricks = [];
    }
  }

  // Duplikat-Check
  private isDuplicate(newTrick: KITrick): boolean {
    const newTitle = newTrick.title.toLowerCase();
    
    return this.existingTricks.some(existing => {
      const existingTitle = existing.title.toLowerCase();
      
      // Exakte Übereinstimmung
      if (existingTitle === newTitle) return true;
      
      // Ähnlichkeits-Check (vereinfacht)
      const similarity = this.calculateSimilarity(existingTitle, newTitle);
      return similarity > 0.8;
    });
  }

  // Einfacher Ähnlichkeits-Check
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    
    const commonWords = words1.filter(word => 
      word.length > 3 && words2.includes(word)
    );
    
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  // Ergebnisse speichern
  private async saveResults(tricks: KITrick[], config: BatchConfig): Promise<void> {
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + '_' + 
                     now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const outputDir = config.outputPath || path.join(process.cwd(), 'scraped-content');
    
    // Stelle sicher, dass Output-Verzeichnis existiert
    await fs.mkdir(outputDir, { recursive: true });
    
    if (config.outputFormat === 'json' || config.outputFormat === 'both') {
      const jsonPath = path.join(outputDir, `kitricks-${timestamp}.json`);
      await fs.writeFile(jsonPath, JSON.stringify(tricks, null, 2));
      console.log(`💾 ${tricks.length} Tricks als JSON gespeichert: ${jsonPath}`);
    }
    
    if (config.outputFormat === 'typescript' || config.outputFormat === 'both') {
      const tsPath = path.join(outputDir, `kitricks-${timestamp}.ts`);
      const tsContent = this.generateTypeScriptExport(tricks);
      await fs.writeFile(tsPath, tsContent);
      console.log(`💾 ${tricks.length} Tricks als TypeScript gespeichert: ${tsPath}`);
    }
    
    // Erstelle auch eine Zusammenfassung
    const summaryPath = path.join(outputDir, `summary-${timestamp}.md`);
    const summary = this.generateSummary(tricks);
    await fs.writeFile(summaryPath, summary);
    console.log(`📋 Zusammenfassung erstellt: ${summaryPath}`);
  }

  // TypeScript Export generieren
  private generateTypeScriptExport(tricks: KITrick[]): string {
    // Konvertiere Date-Objekte zu new Date() Konstruktoren für TypeScript
    const tricksWithDateConstructors = JSON.stringify(tricks, null, 2)
      .replace(/"createdAt": "([^"]+)"/g, '"createdAt": new Date("$1")')
      .replace(/"updatedAt": "([^"]+)"/g, '"updatedAt": new Date("$1")');

    return `// Automatisch generierte KI-Tricks vom ${new Date().toISOString().split('T')[0]}
import { KITrick } from '@/lib/types/types';

export const scrapedKITricks: KITrick[] = ${tricksWithDateConstructors};

export default scrapedKITricks;
`;
  }

  // Zusammenfassung generieren
  private generateSummary(tricks: KITrick[]): string {
    const categories = tricks.reduce((acc, trick) => {
      acc[trick.category] = (acc[trick.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const difficulties = tricks.reduce((acc, trick) => {
      acc[trick.difficulty] = (acc[trick.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return `# KI-Tricks Scraping Zusammenfassung

**Datum:** ${new Date().toLocaleDateString('de-DE')}
**Gesamt:** ${tricks.length} neue KI-Tricks

## Kategorien
${Object.entries(categories).map(([cat, count]) => `- ${cat}: ${count}`).join('\n')}

## Schwierigkeitsgrade
${Object.entries(difficulties).map(([diff, count]) => `- ${diff}: ${count}`).join('\n')}

## Top 5 Tricks (nach Impact)
${tricks
  .filter(t => t.impact === 'high')
  .slice(0, 5)
  .map((trick, i) => `${i + 1}. **${trick.title}** (${trick.category})`)
  .join('\n')}

## Verwendete Tools
${[...new Set(tricks.flatMap(t => t.tools))].join(', ')}
`;
  }

  // Ergebnisse in Konsole ausgeben
  private logResults(result: BatchResult, config: BatchConfig): void {
    console.log('\n📊 BATCH-PROCESSING ERGEBNISSE');
    console.log('================================');
    console.log(`⏱️  Verarbeitungszeit: ${(result.processingTime / 1000).toFixed(1)}s`);
    console.log(`📥 Gesamt verarbeitet: ${result.totalProcessed}`);
    console.log(`✅ Erfolgreiche Tricks: ${result.successfulTricks}`);
    console.log(`❌ Fehlgeschlagen: ${result.failedProcessing}`);
    console.log(`🔄 Duplikate übersprungen: ${result.duplicatesSkipped}`);
    console.log(`⚡ Niedrige Qualität: ${result.lowQualitySkipped}`);
    console.log(`🎯 Neue Tricks erstellt: ${result.newTricks.length}`);
    
    if (config.dryRun) {
      console.log(`🧪 DRY-RUN: Keine Dateien gespeichert`);
    }
    
    if (result.errors.length > 0) {
      console.log(`\n⚠️  Fehler (${result.errors.length}):`);
      result.errors.slice(0, 5).forEach(error => console.log(`   - ${error}`));
      if (result.errors.length > 5) {
        console.log(`   ... und ${result.errors.length - 5} weitere`);
      }
    }
    
    console.log('\n🎉 Batch-Processing abgeschlossen!');
  }

  // Hilfsfunktion für Verzögerungen
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Standard-Konfigurationen
export const DEFAULT_BATCH_CONFIGS = {
  // Schneller Test-Lauf mit Demo-Daten
  quick: {
    maxTricksPerRun: 10,
    minConfidenceScore: 60,
    outputFormat: 'json' as const,
    dryRun: true,
    useDemo: true,
    platforms: ['reddit' as const]
  },
  
  // Produktions-Lauf
  production: {
    maxTricksPerRun: 50,
    minConfidenceScore: 70,
    outputFormat: 'both' as const,
    dryRun: false,
    useDemo: false,
    platforms: ['reddit' as const, 'twitter' as const, 'hackernews' as const]
  },
  
  // Hochqualitative Tricks
  premium: {
    maxTricksPerRun: 20,
    minConfidenceScore: 85,
    outputFormat: 'both' as const,
    dryRun: false,
    useDemo: false,
    platforms: ['reddit' as const]
  },

  // Test-Lauf mit echtem Apify (wenige Items)
  test: {
    maxTricksPerRun: 3,
    minConfidenceScore: 60,
    outputFormat: 'both' as const,
    dryRun: false, // Echte Dateien speichern
    useDemo: false, // Echtes Apify verwenden
    platforms: ['reddit' as const]
  }
};

export default ContentBatchProcessor;