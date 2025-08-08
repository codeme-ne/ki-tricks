#!/usr/bin/env tsx

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { KITrick } from '../src/lib/types/types';
import { mockTricks } from '../src/lib/data/mock-data';

interface ReviewOptions {
  inputFile?: string;
  outputFile?: string;
  interactive?: boolean;
  autoApprove?: boolean;
}

class ContentReviewer {
  private scrapedTricks: KITrick[] = [];
  private existingTricks: KITrick[] = mockTricks;
  
  constructor(private options: ReviewOptions = {}) {}

  // Lädt gescrapete Tricks aus JSON-Datei
  async loadScrapedContent(filePath?: string): Promise<void> {
    const file = filePath || this.findLatestScrapedFile();
    
    if (!existsSync(file)) {
      console.error(`❌ Datei nicht gefunden: ${file}`);
      process.exit(1);
    }

    try {
      const content = readFileSync(file, 'utf-8');
      this.scrapedTricks = JSON.parse(content);
      console.log(`📁 ${this.scrapedTricks.length} Tricks geladen aus: ${file}`);
    } catch (error) {
      console.error(`❌ Fehler beim Laden der Datei: ${error}`);
      process.exit(1);
    }
  }

  // Findet die neueste scraped-content Datei
  private findLatestScrapedFile(): string {
    const today = new Date().toISOString().split('T')[0];
    const possibleFiles = [
      `scraped-content/kitricks-${today}-improved.json`,
      `scraped-content/kitricks-${today}.json`,
      'scraped-content/kitricks-2025-08-04-improved.json'
    ];

    for (const file of possibleFiles) {
      if (existsSync(file)) {
        return file;
      }
    }

    throw new Error('Keine scraped-content Datei gefunden');
  }

  // Hauptreview-Prozess
  async reviewContent(): Promise<void> {
    console.log('\\n🔍 === CONTENT REVIEW SYSTEM ===\\n');
    
    if (this.scrapedTricks.length === 0) {
      console.log('ℹ️ Keine neuen Tricks zum Review.');
      return;
    }

    // Analysiere Qualität
    const qualityReport = this.analyzeQuality();
    this.displayQualityReport(qualityReport);

    // Duplikat-Check
    const duplicates = this.checkForDuplicates();
    if (duplicates.length > 0) {
      this.displayDuplicates(duplicates);
    }

    // Review jeder Trick einzeln
    const approvedTricks: KITrick[] = [];
    const rejectedTricks: KITrick[] = [];

    for (let i = 0; i < this.scrapedTricks.length; i++) {
      const trick = this.scrapedTricks[i];
      console.log(`\\n📝 === TRICK ${i + 1}/${this.scrapedTricks.length} ===`);
      
      const decision = await this.reviewSingleTrick(trick);
      
      if (decision === 'approve') {
        approvedTricks.push(trick);
        console.log('✅ Trick genehmigt');
      } else if (decision === 'reject') {
        rejectedTricks.push(trick);
        console.log('❌ Trick abgelehnt');
      } else {
        console.log('⏸️ Review abgebrochen');
        break;
      }
    }

    // Zusammenfassung
    this.displayReviewSummary(approvedTricks, rejectedTricks);

    // Speichere genehmigte Tricks
    if (approvedTricks.length > 0) {
      await this.saveApprovedTricks(approvedTricks);
    }
  }

  // Review eines einzelnen Tricks
  private async reviewSingleTrick(trick: KITrick): Promise<'approve' | 'reject' | 'cancel'> {
    // Zeige Trick-Details
    this.displayTrickDetails(trick);

    if (this.options.autoApprove) {
      return 'approve';
    }

    if (!this.options.interactive) {
      // Auto-Entscheidung basierend auf Qualitätskriterien
      return this.autoDecision(trick);
    }

    // Interaktive Entscheidung
    return await this.promptUser();
  }

  // Zeigt Trick-Details an
  private displayTrickDetails(trick: KITrick): void {
    console.log(`🏷️  Titel: ${trick.title}`);
    console.log(`📁 Kategorie: ${trick.category} | Schwierigkeit: ${trick.difficulty} | Impact: ${trick.impact}`);
    console.log(`⏱️  Zeit: ${trick.timeToImplement} | Tools: ${trick.tools.join(', ')}`);
    console.log(`\\n📝 Beschreibung:`);
    console.log(trick.description.substring(0, 200) + (trick.description.length > 200 ? '...' : ''));
    
    if (trick.steps && trick.steps.length > 0) {
      console.log(`\\n🔢 Schritte (${trick.steps.length}):`);
      trick.steps.slice(0, 2).forEach((step, i) => {
        console.log(`${i + 1}. ${step.substring(0, 80)}${step.length > 80 ? '...' : ''}`);
      });
    } else {
      console.log('⚠️  Keine Schritte definiert');
    }

    if (trick.examples && trick.examples.length > 0) {
      console.log(`\\n💡 Beispiele (${trick.examples.length}):`);
      console.log(`• ${trick.examples[0].substring(0, 80)}${trick.examples[0].length > 80 ? '...' : ''}`);
    } else {
      console.log('⚠️  Keine Beispiele definiert');
    }
  }

  // Qualitätsanalyse
  private analyzeQuality(): { good: number; warning: number; poor: number } {
    let good = 0, warning = 0, poor = 0;

    this.scrapedTricks.forEach(trick => {
      let score = 0;
      
      // Titel-Qualität
      if (trick.title.length >= 30 && trick.title.length <= 80) score++;
      
      // Beschreibung mit "Warum es funktioniert"
      if (trick.description.includes('**Warum es funktioniert:**')) score++;
      
      // Vollständige Schritte
      if (trick.steps && trick.steps.length >= 3) score++;
      
      // Beispiele vorhanden
      if (trick.examples && trick.examples.length >= 1) score++;
      
      // Deutsche Übersetzung erkannt
      if (!this.isEnglishText(trick.title)) score++;

      if (score >= 4) good++;
      else if (score >= 2) warning++;
      else poor++;
    });

    return { good, warning, poor };
  }

  // Prüft ob Text auf Englisch ist
  private isEnglishText(text: string): boolean {
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    const words = text.toLowerCase().split(' ');
    const englishCount = words.filter(word => englishWords.includes(word)).length;
    return englishCount / words.length > 0.3;
  }

  // Zeigt Qualitätsbericht an
  private displayQualityReport(report: { good: number; warning: number; poor: number }): void {
    console.log('📊 === QUALITÄTSBERICHT ===');
    console.log(`✅ Hochwertig: ${report.good} Tricks`);
    console.log(`⚠️  Verbesserungsbedarf: ${report.warning} Tricks`);
    console.log(`❌ Niedrige Qualität: ${report.poor} Tricks`);
  }

  // Duplikat-Check
  private checkForDuplicates(): Array<{ scraped: KITrick; existing: KITrick; similarity: number }> {
    const duplicates: Array<{ scraped: KITrick; existing: KITrick; similarity: number }> = [];

    this.scrapedTricks.forEach(scrapedTrick => {
      this.existingTricks.forEach(existingTrick => {
        const similarity = this.calculateSimilarity(scrapedTrick.title, existingTrick.title);
        if (similarity > 0.7) {
          duplicates.push({ scraped: scrapedTrick, existing: existingTrick, similarity });
        }
      });
    });

    return duplicates;
  }

  // Berechnet Titel-Ähnlichkeit
  private calculateSimilarity(title1: string, title2: string): number {
    const words1 = title1.toLowerCase().split(/\\s+/);
    const words2 = title2.toLowerCase().split(/\\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    return (commonWords.length * 2) / (words1.length + words2.length);
  }

  // Zeigt Duplikate an
  private displayDuplicates(duplicates: Array<{ scraped: KITrick; existing: KITrick; similarity: number }>): void {
    console.log('\\n⚠️  === MÖGLICHE DUPLIKATE ===');
    duplicates.forEach((dup, i) => {
      console.log(`${i + 1}. Ähnlichkeit: ${(dup.similarity * 100).toFixed(1)}%`);
      console.log(`   Neu: ${dup.scraped.title}`);
      console.log(`   Existing: ${dup.existing.title}`);
    });
  }

  // Automatische Entscheidung
  private autoDecision(trick: KITrick): 'approve' | 'reject' {
    // Lehne ab wenn wichtige Felder fehlen
    if (!trick.steps || trick.steps.length < 2) return 'reject';
    if (!trick.examples || trick.examples.length < 1) return 'reject';
    if (this.isEnglishText(trick.title)) return 'reject';
    
    return 'approve';
  }

  // Benutzer-Eingabe (simuliert für non-interactive)
  private async promptUser(): Promise<'approve' | 'reject' | 'cancel'> {
    // In einer echten Implementierung würde hier readline verwendet
    console.log('\\n[a]pprove | [r]eject | [c]ancel');
    return 'approve'; // Für Demo-Zwecke
  }

  // Zeigt Review-Zusammenfassung
  private displayReviewSummary(approved: KITrick[], rejected: KITrick[]): void {
    console.log('\\n📋 === REVIEW ZUSAMMENFASSUNG ===');
    console.log(`✅ Genehmigt: ${approved.length} Tricks`);
    console.log(`❌ Abgelehnt: ${rejected.length} Tricks`);

    if (approved.length > 0) {
      console.log('\\nGenehmigte Tricks:');
      approved.forEach((trick, i) => {
        console.log(`${i + 1}. ${trick.title} (${trick.category})`);
      });
    }
  }

  // Speichert genehmigte Tricks
  private async saveApprovedTricks(tricks: KITrick[]): Promise<void> {
    const timestamp = new Date().toISOString().split('T')[0];
    const outputFile = this.options.outputFile || `scraped-content/approved-tricks-${timestamp}.json`;

    try {
      writeFileSync(outputFile, JSON.stringify(tricks, null, 2));
      console.log(`\\n💾 ${tricks.length} genehmigte Tricks gespeichert: ${outputFile}`);
      
      // Erstelle auch Merge-Script
      this.createMergeScript(outputFile);
    } catch (error) {
      console.error(`❌ Fehler beim Speichern: ${error}`);
    }
  }

  // Erstellt Script zum Mergen in mock-data.ts
  private createMergeScript(approvedFile: string): void {
    const mergeScript = `#!/usr/bin/env tsx

// Auto-generated merge script
import { readFileSync, writeFileSync } from 'fs';
import { KITrick } from '../app/lib/types';

console.log('🔄 Merge genehmigte Tricks in mock-data.ts...');

// Lade genehmigte Tricks
const approvedTricks: KITrick[] = JSON.parse(readFileSync('${approvedFile}', 'utf-8'));

// Hier würde normalerweise mock-data.ts erweitert werden
console.log(\`✅ \${approvedTricks.length} Tricks bereit zum Merge\`);
console.log('⚠️  Manueller Merge erforderlich - Backup erstellen!\');

approvedTricks.forEach((trick, i) => {
  console.log(\`\${i + 1}. \${trick.title} (\${trick.category})\`);
});
`;

    const scriptPath = 'scripts/merge-approved-tricks.ts';
    writeFileSync(scriptPath, mergeScript);
    console.log(`📝 Merge-Script erstellt: ${scriptPath}`);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options: ReviewOptions = {
    interactive: !args.includes('--auto'),
    autoApprove: args.includes('--approve-all'),
    inputFile: args.find(arg => arg.startsWith('--input='))?.split('=')[1],
    outputFile: args.find(arg => arg.startsWith('--output='))?.split('=')[1]
  };

  const reviewer = new ContentReviewer(options);
  
  try {
    await reviewer.loadScrapedContent(options.inputFile);
    await reviewer.reviewContent();
  } catch (error) {
    console.error(`❌ Review-Fehler: ${error}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}