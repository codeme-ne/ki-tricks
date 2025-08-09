#!/usr/bin/env tsx
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { createInterface } from 'readline';
import { spawn } from 'child_process';
import { KITrick } from '../src/lib/types/types';

// Hilfsfunktion für Benutzerangaben
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// Finde die neueste kitricks JSON-Datei
async function findLatestKitricksFile(): Promise<string | null> {
  try {
    const scrapedContentDir = join(process.cwd(), 'scraped-content');
    const files = await readdir(scrapedContentDir);
    
    // Filtere nur kitricks-*.json Dateien
    const kitricksFiles = files.filter(file => 
      file.startsWith('kitricks-') && file.endsWith('.json')
    );
    
    if (kitricksFiles.length === 0) {
      return null;
    }
    
    // Sortiere nach Datum (neueste zuerst)
    kitricksFiles.sort((a, b) => {
      const dateA = a.match(/kitricks-(\d{4}-\d{2}-\d{2})\.json/)?.[1] || '';
      const dateB = b.match(/kitricks-(\d{4}-\d{2}-\d{2})\.json/)?.[1] || '';
      return dateB.localeCompare(dateA);
    });
    
    return join(scrapedContentDir, kitricksFiles[0]);
  } catch (error) {
    console.error('❌ Fehler beim Suchen der KI-Tricks Dateien:', error);
    return null;
  }
}

// Lade KI-Tricks aus JSON-Datei
async function loadKitricksFromFile(filePath: string): Promise<KITrick[]> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('❌ Fehler beim Laden der KI-Tricks:', error);
    return [];
  }
}

// Öffne externen Editor mit einer Datei
async function openEditor(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Erkenne das Betriebssystem und wähle den passenden Editor
    const platform = process.platform;
    let command: string;
    let args: string[];
    
    if (platform === 'win32') {
      // Windows: Versuche VS Code, dann notepad
      command = 'code';
      args = ['-w', filePath]; // -w wartet bis Editor geschlossen wird
    } else if (platform === 'darwin') {
      // macOS: Versuche VS Code, dann TextEdit
      command = 'code';
      args = ['-w', filePath];
    } else {
      // Linux: Versuche VS Code, dann nano
      command = 'code';
      args = ['-w', filePath];
    }
    
    console.log(`🚀 Öffne ${filePath} im Editor...`);
    console.log('💡 Bearbeite die Datei und schließe den Editor, um fortzufahren.');
    
    const childProcess = spawn(command, args, { 
      stdio: 'inherit',
      shell: true 
    });
    
    childProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Editor geschlossen. Lade bearbeiteten Trick...');
        resolve();
      } else {
        console.log('⚠️ Editor mit Code', code, 'geschlossen. Versuche trotzdem fortzufahren...');
        resolve(); // Auch bei Fehlern fortfahren
      }
    });
    
    childProcess.on('error', (error) => {
      console.error('❌ Fehler beim Öffnen des Editors:', error.message);
      console.log('💡 Versuche manuell die Datei zu bearbeiten:', filePath);
      console.log('Drücke Enter wenn fertig...');
      
      // Fallback: Warte auf Enter
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question('', () => {
        rl.close();
        resolve();
      });
    });
  });
}

// Speichere einen Trick als temporäre JSON-Datei zum Bearbeiten
async function saveTrickForEditing(trick: KITrick): Promise<string> {
  const tempFilePath = join(process.cwd(), 'edit-trick.json');
  const trickForEdit = {
    ...trick,
    createdAt: trick.createdAt.toISOString(),
    updatedAt: trick.updatedAt.toISOString()
  };
  
  await writeFile(tempFilePath, JSON.stringify(trickForEdit, null, 2), 'utf-8');
  return tempFilePath;
}

// Lade den bearbeiteten Trick von der temporären Datei
async function loadEditedTrick(filePath: string): Promise<KITrick | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    
    // Konvertiere Datumsstrings zurück zu Date-Objekten
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt)
    };
  } catch (error) {
    console.error('❌ Fehler beim Laden des bearbeiteten Tricks:', error);
    return null;
  }
}

// Zeige einen Trick formatiert in der Konsole
function displayTrick(trick: KITrick, index: number, total: number) {
  console.log('\n' + '='.repeat(80));
  console.log(`📝 TRICK ${index + 1}/${total}`);
  console.log('='.repeat(80));
  console.log(`🏷️  **Titel:** ${trick.title}`);
  console.log(`📂 **Kategorie:** ${trick.category}`);
  console.log(`⚡ **Schwierigkeit:** ${trick.difficulty}`);
  console.log(`🛠️  **Tools:** ${trick.tools.join(', ')}`);
  console.log(`⏱️  **Zeit:** ${trick.timeToImplement}`);
  console.log(`🎯 **Impact:** ${trick.impact}`);
  console.log('\n📄 **Beschreibung:**');
  console.log(trick.description);
  
  if (trick.steps && trick.steps.length > 0) {
    console.log('\n🔢 **Schritte:**');
    trick.steps.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step}`);
    });
  }
  
  if (trick.examples && trick.examples.length > 0) {
    console.log('\n💡 **Beispiele:**');
    trick.examples.forEach((example, i) => {
      console.log(`   ${i + 1}. ${example}`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
}

// Lade aktuelle mock-data.ts und finde die richtige Stelle zum Einfügen
async function loadMockData(): Promise<string> {
  try {
    const mockDataPath = join(process.cwd(), 'src/lib/mock-data.ts');
    return await readFile(mockDataPath, 'utf-8');
  } catch (error) {
    console.error('❌ Fehler beim Laden der mock-data.ts:', error);
    throw error;
  }
}

// Generiere den Code für neue Tricks
function generateTrickCode(tricks: KITrick[]): string {
  return tricks.map(trick => {
    const stepsStr = trick.steps 
      ? `[\n    ${trick.steps.map(step => `'${step.replace(/'/g, "\\'")}'`).join(',\n    ')}\n  ]`
      : 'undefined';
    
    const examplesStr = trick.examples
      ? `[\n    ${trick.examples.map(ex => `'${ex.replace(/'/g, "\\'")}'`).join(',\n    ')}\n  ]`
      : 'undefined';

    return `  {
    id: '${trick.id}',
    title: '${trick.title.replace(/'/g, "\\'")}',
    description: \`${trick.description.replace(/`/g, '\\`')}\`,
    category: '${trick.category}',
    difficulty: '${trick.difficulty}',
    tools: [${trick.tools.map(tool => `'${tool}'`).join(', ')}],
    timeToImplement: '${trick.timeToImplement}',
    impact: '${trick.impact}',
    steps: ${stepsStr},
    examples: ${examplesStr},
    slug: '${trick.slug}',
    createdAt: new Date('${trick.createdAt}'),
    updatedAt: new Date('${trick.updatedAt}')
  }`;
  }).join(',\n\n');
}

// Robuste Funktion zum Hinzufügen von Tricks zu mock-data.ts
async function appendToMockData(newTricks: KITrick[]): Promise<void> {
  try {
    const mockDataPath = join(process.cwd(), 'src/lib/mock-data.ts');
    const content = await readFile(mockDataPath, 'utf-8');
    
    // Finde den mockTricks Array-Start und -Ende mit Regex
    const arrayStartMatch = content.match(/export const mockTricks:\s*KITrick\[\]\s*=\s*\[/);
    if (!arrayStartMatch) {
      throw new Error('Konnte den mockTricks Array-Start nicht finden');
    }
    
    const arrayStartIndex = arrayStartMatch.index! + arrayStartMatch[0].length;
    
    // Finde das Ende des Arrays (schließende eckige Klammer)
    let bracketCount = 1;
    let arrayEndIndex = arrayStartIndex;
    
    for (let i = arrayStartIndex; i < content.length && bracketCount > 0; i++) {
      if (content[i] === '[') bracketCount++;
      if (content[i] === ']') bracketCount--;
      if (bracketCount === 0) {
        arrayEndIndex = i;
        break;
      }
    }
    
    if (bracketCount !== 0) {
      throw new Error('Konnte das Ende des mockTricks Arrays nicht finden');
    }
    
    // Extrahiere den Inhalt des Arrays
    const arrayContent = content.substring(arrayStartIndex, arrayEndIndex);
    
    // Bestimme das Trennzeichen
    const trimmedContent = arrayContent.trim();
    const needsComma = trimmedContent.length > 0 && !trimmedContent.endsWith(',');
    const separator = needsComma ? ',\n\n' : '\n\n';
    
    // Generiere den Code für neue Tricks
    const newTricksCode = generateTrickCode(newTricks);
    
    // Baue die neue Datei zusammen
    const beforeArray = content.substring(0, arrayStartIndex);
    const afterArray = content.substring(arrayEndIndex);
    const updatedArrayContent = arrayContent + (trimmedContent.length > 0 ? separator : '') + newTricksCode;
    
    const updatedContent = beforeArray + updatedArrayContent + afterArray;
    
    // Schreibe die aktualisierte Datei
    await writeFile(mockDataPath, updatedContent, 'utf-8');
    console.log(`✅ ${newTricks.length} neue Tricks erfolgreich zu mock-data.ts hinzugefügt!`);
    
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der mock-data.ts:', error);
    throw error;
  }
}

// Hauptfunktion
async function main() {
  console.log('📋 KI-Tricks Review & Append Tool');
  console.log('==================================\n');
  
  try {
    // 1. Finde die neueste kitricks Datei
    console.log('🔍 Suche nach der neuesten kitricks Datei...');
    const latestFile = await findLatestKitricksFile();
    
    if (!latestFile) {
      console.log('❌ Keine kitricks-*.json Dateien im scraped-content/ Ordner gefunden.');
      console.log('💡 Führe zuerst `npm run scrape-production` aus, um Tricks zu generieren.');
      return;
    }
    
    console.log(`✅ Gefunden: ${latestFile}`);
    
    // 2. Lade die Tricks
    console.log('📥 Lade KI-Tricks...');
    const tricks = await loadKitricksFromFile(latestFile);
    
    if (tricks.length === 0) {
      console.log('❌ Keine Tricks in der Datei gefunden.');
      return;
    }
    
    console.log(`📊 ${tricks.length} Tricks gefunden. Starte Review...\n`);
    
    // 3. Review jedes Tricks
    const approvedTricks: KITrick[] = [];
    
    for (let i = 0; i < tricks.length; i++) {
      let currentTrick = tricks[i];
      let reviewComplete = false;
      
      while (!reviewComplete) {
        // Zeige den Trick
        displayTrick(currentTrick, i, tricks.length);
        
        // Frage nach Genehmigung mit Edit-Option
        const answer = await askQuestion('\n❓ Diesen Trick hinzufügen? (y/n/e) - e für Edit: ');
        
        if (answer === 'y' || answer === 'yes') {
          approvedTricks.push(currentTrick);
          console.log('✅ Trick zur Genehmigungsliste hinzugefügt!');
          reviewComplete = true;
        } else if (answer === 'e' || answer === 'edit') {
          // Edit-Workflow
          console.log('📝 Starte Edit-Modus...');
          
          try {
            // Speichere Trick als temporäre JSON-Datei
            const tempFilePath = await saveTrickForEditing(currentTrick);
            console.log(`💾 Trick gespeichert in: ${tempFilePath}`);
            
            // Öffne Editor
            await openEditor(tempFilePath);
            
            // Lade bearbeiteten Trick
            const editedTrick = await loadEditedTrick(tempFilePath);
            
            if (editedTrick) {
              currentTrick = editedTrick;
              console.log('✅ Bearbeiteter Trick geladen!');
              
              // Frage nach Genehmigung des bearbeiteten Tricks
              const editAnswer = await askQuestion('\n❓ Den bearbeiteten Trick hinzufügen? (y/n): ');
              
              if (editAnswer === 'y' || editAnswer === 'yes') {
                approvedTricks.push(currentTrick);
                console.log('✅ Bearbeiteter Trick zur Genehmigungsliste hinzugefügt!');
                reviewComplete = true;
              } else {
                console.log('❌ Bearbeiteter Trick verworfen. Zurück zum Original...');
                currentTrick = tricks[i]; // Zurück zum Original
              }
            } else {
              console.log('❌ Fehler beim Laden des bearbeiteten Tricks. Verwende Original.');
            }
            
          } catch (error) {
            console.error('❌ Fehler im Edit-Modus:', error);
            console.log('Verwende Original-Trick...');
          }
          
        } else {
          console.log('❌ Trick übersprungen.');
          reviewComplete = true;
        }
      }
    }
    
    // 4. Zusammenfassung
    console.log('\n' + '='.repeat(80));
    console.log('📊 REVIEW ZUSAMMENFASSUNG');
    console.log('='.repeat(80));
    console.log(`📥 Total überprüft: ${tricks.length}`);
    console.log(`✅ Genehmigt: ${approvedTricks.length}`);
    console.log(`❌ Abgelehnt: ${tricks.length - approvedTricks.length}`);
    
    if (approvedTricks.length === 0) {
      console.log('\n🤷 Keine Tricks genehmigt. Nichts zu tun.');
      return;
    }
    
    // 5. Frage nach finaler Bestätigung
    console.log('\n📝 Genehmigte Tricks:');
    approvedTricks.forEach((trick, i) => {
      console.log(`   ${i + 1}. ${trick.title}`);
    });
    
    const finalConfirm = await askQuestion('\n🚀 Diese Tricks zu mock-data.ts hinzufügen? (y/n): ');
    
    if (finalConfirm === 'y' || finalConfirm === 'yes') {
      console.log('\n💾 Füge Tricks zu mock-data.ts hinzu...');
      await appendToMockData(approvedTricks);
      console.log('\n🎉 Fertig! Die neuen Tricks sind jetzt live auf der Website verfügbar.');
      console.log('💡 Starte `npm run dev` um die Änderungen zu sehen.');
    } else {
      console.log('\n❌ Abgebrochen. Keine Tricks wurden hinzugefügt.');
    }
    
  } catch (error) {
    console.error('\n❌ Unerwarteter Fehler:', error);
  }
}

// Skript ausführen wenn direkt aufgerufen
if (require.main === module) {
  main().catch(console.error);
}

export { main as reviewAndAppend };