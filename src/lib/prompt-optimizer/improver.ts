/**
 * Rule-based Prompt Improver
 * 
 * Applies deterministic improvement patterns to enhance prompt quality
 * without requiring LLM API calls
 */

import { scorePrompt } from './scorer';
import { OptimizationResult, OptimizationIteration, ImprovementPattern } from './types';
import { 
  ALL_ADVANCED_PATTERNS, 
  SELF_REFLECTION_PATTERN,
  REACT_PATTERN,
  COT_PATTERN,
  CONSTITUTIONAL_PATTERN,
  META_INSTRUCTIONS_PATTERN,
} from './advanced-patterns';

const TARGET_SCORE = 9.2;
const MAX_ITERATIONS = 5; // Mehr Runden für bessere Qualität

/**
 * Optimize a prompt through iterative improvements
 */
export function optimizePrompt(
  originalPrompt: string,
  userInput?: string,
  context?: { trickTitle?: string; trickCategory?: string }
): OptimizationResult {
  const iterations: OptimizationIteration[] = [];
  let currentPrompt = originalPrompt;

  // Round 1: Initial analysis
  const score1 = scorePrompt(currentPrompt);
  iterations.push({
    round: 1,
    prompt: currentPrompt,
    score: score1,
    improvements: ['Initiale Analyse durchgeführt'],
  });

  // ALWAYS run all 5 rounds to ensure all dimensions are optimized
  // (Don't stop early just because overall score looks good - context might still be weak!)
  
  // Round 2: Core elements (role, format, structure)
  const result2 = applyRound1Improvements(currentPrompt, context);
  if (result2.applied.length > 0) {
    currentPrompt = result2.prompt;
  }
  const score2 = scorePrompt(currentPrompt);
  iterations.push({
    round: 2,
    prompt: currentPrompt,
    score: score2,
    improvements: result2.applied,
  });
  
  // Round 3: Examples and specificity
  const result3 = applyRound2Improvements(currentPrompt, context);
  if (result3.applied.length > 0) {
    currentPrompt = result3.prompt;
  }
  const score3 = scorePrompt(currentPrompt);
  iterations.push({
    round: 3,
    prompt: currentPrompt,
    score: score3,
    improvements: result3.applied,
  });
  
  // Round 4: Advanced enhancements (Context, CoT, etc.)
  const result4 = applyRound3Improvements(currentPrompt, context);
  if (result4.applied.length > 0) {
    currentPrompt = result4.prompt;
  }
  const score4 = scorePrompt(currentPrompt);
  iterations.push({
    round: 4,
    prompt: currentPrompt,
    score: score4,
    improvements: result4.applied,
  });
  
  // Round 5: Ultimate polish with Constitutional AI + Meta-Instructions
  const result5 = applyUltimatePolish(currentPrompt, context);
  if (result5.applied.length > 0) {
    currentPrompt = result5.prompt;
  }
  const score5 = scorePrompt(currentPrompt);
  iterations.push({
    round: 5,
    prompt: currentPrompt,
    score: score5,
    improvements: result5.applied,
  });

  const finalScore = scorePrompt(currentPrompt);

  return {
    original: originalPrompt,
    optimized: currentPrompt,
    iterations,
    finalScore,
  };
}

/**
 * Round 1: Add core missing elements (role, format, clarity)
 */
function applyRound1Improvements(
  prompt: string,
  context?: { trickTitle?: string; trickCategory?: string }
): { prompt: string; applied: string[] } {
  let improved = prompt;
  const applied: string[] = [];

  const score = scorePrompt(prompt);

  // Add role definition if missing
  if (score.dimensions.roleDefinition.score < 5) {
    const role = generateRoleDefinition(context);
    improved = `${role}\n\n${improved}`;
    applied.push('Rollendefinition hinzugefügt');
  }

  // Add output format if missing
  if (score.dimensions.outputFormat.score < 5) {
    improved = addOutputFormatSection(improved);
    applied.push('Output-Format spezifiziert');
  }

  // Add structure if missing
  if (score.dimensions.structureClarity.score < 6) {
    improved = addStructure(improved);
    applied.push('Struktur verbessert');
  }

  return { prompt: improved, applied };
}

/**
 * Round 2: Add examples and enhance specificity
 */
function applyRound2Improvements(
  prompt: string,
  context?: { trickTitle?: string; trickCategory?: string }
): { prompt: string; applied: string[] } {
  let improved = prompt;
  const applied: string[] = [];

  const score = scorePrompt(prompt);

  // Add examples if missing
  if (score.dimensions.examples.score < 7) {
    improved = addExamplesSection(improved, context);
    applied.push('Few-shot Beispiele hinzugefügt');
  }

  // Enhance specificity
  if (score.dimensions.specificity.score < 8) {
    improved = enhanceSpecificity(improved);
    applied.push('Anweisungen präzisiert');
  }

  // Add constraints section
  if (!improved.includes('Achte auf:') && !improved.includes('Constraints:')) {
    improved = addConstraintsSection(improved);
    applied.push('Richtlinien hinzugefügt');
  }

  return { prompt: improved, applied };
}

/**
 * Round 3: Advanced enhancements (detailed examples, richer context)
 */
function applyRound3Improvements(
  prompt: string,
  context?: { trickTitle?: string; trickCategory?: string }
): { prompt: string; applied: string[] } {
  let improved = prompt;
  const applied: string[] = [];

  const score = scorePrompt(prompt);

  // Add Chain-of-Thought pattern if score < 8.5
  if (score.overall < 8.5 && !prompt.includes('Schritt für Schritt')) {
    improved += COT_PATTERN.template;
    applied.push('Chain-of-Thought Reasoning hinzugefügt');
  }

  // Enhance examples with more detail
  if (score.dimensions.examples.score < 9) {
    improved = enhanceExamplesDetail(improved, context);
    applied.push('Beispiele detaillierter ausformuliert');
  }

  // Add more context if still lacking
  if (score.dimensions.context.score < 8) {
    improved = addRicherContext(improved, context);
    applied.push('Umfangreicheren Kontext hinzugefügt');
  }

  // Ensure output format is explicit
  if (score.dimensions.outputFormat.score < 9) {
    improved = enhanceOutputFormat(improved);
    applied.push('Output-Format präzisiert');
  }

  return { prompt: improved, applied };
}

/**
 * Round 4: Final polish (perfecting all dimensions)
 */
function applyFinalPolish(
  prompt: string,
  context?: { trickTitle?: string; trickCategory?: string }
): { prompt: string; applied: string[] } {
  let improved = prompt;
  const applied: string[] = [];

  const score = scorePrompt(prompt);

  // Round 4: ReAct + Self-Reflection (Critical for 9+)
  if (!prompt.includes('Self-Reflection') && !prompt.includes('Selbstprüfung')) {
    improved += SELF_REFLECTION_PATTERN.template;
    applied.push('Self-Reflection Qualitätscheck hinzugefügt');
  }

  if (!prompt.includes('ReAct') && !prompt.includes('Vorgehensweise')) {
    improved += REACT_PATTERN.template;
    applied.push('ReAct Reasoning-Action Cycle hinzugefügt');
  }

  // Final role enhancement
  if (score.dimensions.roleDefinition.score < 9) {
    improved = enhanceRoleDefinition(improved, context);
    applied.push('Rollendefinition verfeinert');
  }

  // Perfect structure with clear sections
  if (score.dimensions.structureClarity.score < 9) {
    improved = perfectStructure(improved);
    applied.push('Struktur perfektioniert');
  }

  return { prompt: improved, applied };
}

/**
 * Round 5: Ultimate Polish - Constitutional AI + Meta-Instructions
 * This is the final push to 9.2+
 */
function applyUltimatePolish(
  prompt: string,
  context?: { trickTitle?: string; trickCategory?: string }
): { prompt: string; applied: string[] } {
  let improved = prompt;
  const applied: string[] = [];

  const score = scorePrompt(prompt);

  // Add Constitutional Principles if not already present
  if (!prompt.includes('Grundprinzipien') && !prompt.includes('Constitutional')) {
    improved += CONSTITUTIONAL_PATTERN.template;
    applied.push('Constitutional AI Principles hinzugefügt');
  }

  // Add Meta-Instructions for perfect adherence
  if (!prompt.includes('Meta-Instruktionen') && !prompt.includes('Meta-Instructions')) {
    improved += META_INSTRUCTIONS_PATTERN.template;
    applied.push('Meta-Instruktionen für optimale Befolgung hinzugefügt');
  }

  // Ensure all sections have proper XML-style structure for clarity
  if (!improved.includes('<') || improved.split('<').length < 3) {
    improved = addXMLStructure(improved);
    applied.push('XML-Struktur für maximale Klarheit hinzugefügt');
  }

  return { prompt: improved, applied };
}

/**
 * Generate a role definition based on context
 */
function generateRoleDefinition(context?: { trickTitle?: string; trickCategory?: string }): string {
  const categoryRoles: Record<string, string> = {
    productivity: 'Produktivitäts-Experte',
    'content-creation': 'Content-Creation-Spezialist',
    programming: 'Programmier-Experte',
    design: 'Design-Experte',
    'data-analysis': 'Datenanalyse-Experte',
    learning: 'Lern-Coach',
    business: 'Business-Stratege',
    marketing: 'Marketing-Experte',
  };

  const role = context?.trickCategory 
    ? categoryRoles[context.trickCategory] || 'KI-Assistent'
    : 'KI-Assistent';

  return `# Rolle\n\nDu bist ein ${role}, der präzise und hilfreiche Antworten liefert.`;
}

/**
 * Add explicit output format section
 */
function addOutputFormatSection(prompt: string): string {
  if (prompt.includes('Format:') || prompt.includes('Output:')) {
    return prompt;
  }

  const formatSection = `\n\n# Gewünschtes Output-Format\n\nGib deine Antwort in folgendem Format:\n- Klar strukturiert mit Überschriften\n- Konkrete, umsetzbare Schritte\n- Bei Bedarf mit Beispielen`;

  return prompt + formatSection;
}

/**
 * Add/improve structure with markdown headers
 */
function addStructure(prompt: string): string {
  // If already well-structured, return as is
  if (prompt.match(/^#{1,3}\s+\w+/m)) {
    return prompt;
  }

  // Split into paragraphs and add structure
  const lines = prompt.split('\n\n');
  
  if (lines.length === 1) {
    // Single paragraph - add sections
    return `# Aufgabe\n\n${prompt}\n\n# Anforderungen\n\n- Sei präzise und konkret\n- Achte auf Vollständigkeit\n- Gib praktische Beispiele`;
  }

  // Multiple paragraphs - add headers
  return lines
    .map((line, idx) => {
      if (idx === 0) return `# Kontext\n\n${line}`;
      if (idx === 1) return `\n# Aufgabe\n\n${line}`;
      return `\n${line}`;
    })
    .join('\n');
}

/**
 * Add few-shot examples section
 */
function addExamplesSection(
  prompt: string,
  context?: { trickTitle?: string }
): string {
  // Check for STRUCTURED examples (not just the word "beispiel")
  const hasStructuredExamples = /<beispiele>|<example|# Beispiele|# Examples/i.test(prompt);
  if (hasStructuredExamples) {
    return prompt; // Already has structured examples
  }

  // Generate RICH examples with: positive + negative + edge case + CoT
  const isEmailTask = /e-mail|email|mail/i.test(prompt);
  const isTextTask = /text|artikel|blog/i.test(prompt);
  const isCodeTask = /code|programm|funktion|function/i.test(prompt);
  
  let examplesSection = '';
  
  if (isEmailTask) {
    examplesSection = `

# Beispiele

<beispiele>

<example type="positive">
**Beispiel 1: Update-Ankündigung (GUTES Beispiel)**
Eingabe: Schreibe eine E-Mail über das neue Software-Update v2.3

Erwartete Ausgabe:
Betreff: Wichtiges Update: Software v2.3 wird am 15. März ausgerollt

Liebes Team,

ich möchte euch über das bevorstehende Software-Update v2.3 informieren, das am 15. März um 22:00 Uhr ausgerollt wird.

**Was ist neu:**
- Verbesserte Performance beim Laden großer Datensätze (+40%)
- Neues Dashboard mit erweiterten Analytics
- Behobene Bugs in der Suchfunktion

**Was ihr tun müsst:**
- Bitte speichert alle offenen Arbeiten vor 21:45 Uhr
- Ein kurzer Neustart der Anwendung wird empfohlen
- Bei Problemen: Support unter support@firma.de

Vielen Dank für eure Kooperation!
</example>

<example type="negative">
**Beispiel 2: Update-Ankündigung (SCHLECHTES Beispiel - NICHT nachmachen!)**
Eingabe: Schreibe eine E-Mail über das neue Software-Update v2.3

Schlechte Ausgabe:
Hey, wir machen ein Update. Wird besser werden. Checkt es aus!

<reasoning_for_bad_output>
❌ Dieser Output ist unzureichend, weil:
- Kein professioneller Betreff vorhanden
- Keine spezifischen Details (wann? welche Features?)
- Keine Handlungsanweisungen für das Team
- Unprofessioneller Ton ("Hey", "checkt es aus")
- Keine Kontaktinformationen bei Problemen
✅ Ein guter Output MUSS enthalten: Betreff, Zeitpunkt, Features, Action Items, Kontakt
</reasoning_for_bad_output>
</example>

<example type="edge_case">
**Beispiel 3: Unklare Anfrage (Edge Case - zeigt Robustheit)**
Eingabe: Mail.

Erwartete Ausgabe:
Um eine hilfreiche E-Mail zu erstellen, benötige ich weitere Informationen:
1. **Thema:** Worüber soll die E-Mail sein? (z.B. Meeting-Einladung, Update, Anfrage)
2. **Empfänger:** An wen geht die Mail? (Team, Kunde, Management)
3. **Ziel:** Was soll erreicht werden? (Informieren, Einladen, Entscheidung treffen)
4. **Dringlichkeit:** Normal oder zeitkritisch?

<reasoning>
Bei extrem kurzen oder unklaren Inputs ist die beste Reaktion eine strukturierte Rückfrage. 
NICHT raten oder halluzinieren, sondern proaktiv die notwendigen Informationen sammeln.
</reasoning>
</example>

<example type="chain_of_thought_demonstration">
**Beispiel 4: CoT-Demonstration (zeigt den Denkprozess)**
Eingabe: Erstelle eine Willkommens-Mail für neue Teammitglieder

<thought>
1. **Analyse:** Zielgruppe sind neue Teammitglieder am ersten Tag. Sie sind wahrscheinlich nervös und brauchen Orientierung.
2. **Kernbotschaft:** Willkommen heißen + praktische Infos + Ansprechpartner
3. **Ton:** Warm und professionell, nicht zu formell, aber auch nicht zu locker
4. **Struktur-Entwurf:**
   - Begrüßung
   - Erste Schritte (Login, Tools)
   - Team-Kontakte
   - Nächste Meetings
5. **Prüfung:** Habe ich alle praktischen Fragen beantwortet? Fühlt sich die Person willkommen?
</thought>

Ausgabe:
Betreff: Willkommen im Team! 🎉 Dein Start bei [Firma]

Hallo [Name],

herzlich willkommen im Team! Wir freuen uns sehr, dich an Bord zu haben.

**Deine ersten Schritte:**
1. Login-Daten: Prüfe deine IT-Welcome-Mail für Zugangsdaten
2. Slack: Tritt unserem Channel #team-[abteilung] bei
3. Onboarding-Dokument: [Link] - hier findest du alle wichtigen Infos

**Deine Ansprechpartner:**
- Buddy: [Name] - für alle Alltags-Fragen
- Manager: [Name] - für strategische Themen
- IT-Support: support@firma.de

**Diese Woche:**
- Montag 10:00 - Team-Kennenlern-Meeting
- Mittwoch 14:00 - Onboarding-Session mit HR
- Freitag 16:00 - Informeller Team-Coffee ☕

Wenn du Fragen hast, melde dich jederzeit!

Viele Grüße und einen tollen Start!
</example>

</beispiele>`;
  } else if (isTextTask) {
    examplesSection = `

# Beispiele

<beispiele>

<example type="positive">
**Beispiel 1: Tutorial-Format (GUTES Beispiel)**
Eingabe: Erkläre wie man produktiv arbeitet
Ausgabe: Schritt-für-Schritt Anleitung mit nummerierten Punkten (1. Prioritäten setzen, 2. Zeitblöcke nutzen...), praktischen Beispielen und umsetzbaren Action Items
</example>

<example type="negative">
**Beispiel 2: Vager Text (SCHLECHTES Beispiel - NICHT nachmachen!)**
Eingabe: Erkläre wie man produktiv arbeitet
Schlechte Ausgabe: Man sollte fokussiert bleiben und Ablenkungen vermeiden. Pausen sind auch wichtig.

<reasoning_for_bad_output>
❌ Dieser Output ist unzureichend, weil:
- Zu vage und allgemein ("fokussiert bleiben" - wie?)
- Keine konkreten, umsetzbaren Schritte
- Keine Struktur oder Priorisierung
- Keine Beispiele oder Tools genannt
✅ Ein guter Output MUSS enthalten: Konkrete Schritte, Beispiele, Tools, Priorisierung
</reasoning_for_bad_output>
</example>

<example type="edge_case">
**Beispiel 3: Unklar formulierte Anfrage**
Eingabe: Text.

Ausgabe:
Um einen hilfreichen Text zu erstellen, benötige ich mehr Details:
1. **Thema:** Worüber soll der Text handeln?
2. **Länge:** Kurzer Absatz (50-100 Wörter) oder ausführlicher Artikel (500+ Wörter)?
3. **Zielgruppe:** Anfänger, Experten, allgemeines Publikum?
4. **Zweck:** Informieren, überzeugen, unterhalten, erklären?
</example>

</beispiele>`;
  } else if (isCodeTask) {
    examplesSection = `

# Beispiele

<beispiele>

<example type="positive">
**Beispiel 1: Typsichere Funktion (GUTES Beispiel)**
Eingabe: Erstelle eine Funktion zur Validierung von E-Mail-Adressen
\`\`\`typescript
function validateEmail(email: string): boolean {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}
\`\`\`
</example>

<example type="negative">
**Beispiel 2: Unsichere Implementierung (SCHLECHTES Beispiel)**
Eingabe: Erstelle eine Funktion zur Validierung von E-Mail-Adressen
\`\`\`javascript
function check(e) { return e.includes('@') }
\`\`\`

<reasoning_for_bad_output>
❌ Dieser Code ist problematisch, weil:
- Keine TypeScript-Typen (e ist any)
- Zu einfache Validierung (a@b ist kein gültiges Email)
- Unklarer Funktionsname ("check" vs "validateEmail")
- Keine Null-Checks oder Fehlerbehandlung
✅ Guter Code MUSS enthalten: Typen, robuste Validierung, sprechende Namen
</reasoning_for_bad_output>
</example>

<example type="chain_of_thought_demonstration">
**Beispiel 3: CoT-Demonstration**
Eingabe: Erstelle eine Funktion zum sicheren Parsen von JSON

<thought>
1. **Anforderungen:** JSON parsen, aber Fehler abfangen (weil JSON.parse wirft)
2. **Rückgabetyp:** Entweder das geparste Objekt oder undefined bei Fehler
3. **TypeScript:** Generics verwenden für Typ-Sicherheit
4. **Edge Cases:** leerer String, null, undefined, invalides JSON
5. **Design-Entscheidung:** Lieber undefined zurückgeben als Error werfen (einfacher zu handhaben)
</thought>

\`\`\`typescript
function safeParse<T>(jsonString: string | null | undefined): T | undefined {
  if (!jsonString || jsonString.trim() === '') return undefined;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return undefined;
  }
}

// Usage
const data = safeParse<{name: string}>(response);
if (data) {
  console.log(data.name); // Type-safe!
}
\`\`\`
</example>

</beispiele>`;
  } else {
    // Generic with all patterns
    examplesSection = `

# Beispiele

<beispiele>

<example type="positive">
**Beispiel 1: Vollständige Antwort (GUTES Beispiel)**
Eingabe: [Typische Anfrage für diese Art von Aufgabe]
Ausgabe: [Konkrete, strukturierte Antwort mit klarem Format, spezifischen Details, mindestens 3-5 Sätzen, umsetzbaren Informationen]
</example>

<example type="negative">
**Beispiel 2: Unzureichende Antwort (SCHLECHTES Beispiel)**
Eingabe: [Gleiche Anfrage]
Schlechte Ausgabe: [Kurze, vage Antwort ohne Details]

<reasoning_for_bad_output>
❌ Diese Antwort ist problematisch, weil:
- Zu wenig Details und Kontext
- Keine konkret umsetzbaren Informationen
- Vage Formulierungen ohne Spezifität
✅ Gute Antworten MÜSSEN enthalten: Spezifische Details, klare Struktur, umsetzbare Schritte
</reasoning_for_bad_output>
</example>

<example type="edge_case">
**Beispiel 3: Umgang mit unklarer Anfrage**
Eingabe: [Sehr kurze/unklare Anfrage]

Ausgabe:
Um eine hilfreiche Antwort zu geben, benötige ich mehr Informationen:
1. **Kontext:** [Relevante Kontextfrage]
2. **Ziel:** [Frage nach dem gewünschten Ergebnis]
3. **Details:** [Frage nach spezifischen Anforderungen]

<reasoning>
Bei unklaren Inputs: NICHT raten oder halluzinieren.
Stattdessen: Strukturierte Rückfragen stellen, um die notwendigen Informationen zu sammeln.
</reasoning>
</example>

</beispiele>`;
  }

  return prompt + examplesSection;
}

/**
 * Enhance specificity by making instructions more concrete
 */
function enhanceSpecificity(prompt: string): string {
  let improved = prompt;

  // Replace vague terms with specific ones
  const replacements: Record<string, string> = {
    'könnte': 'sollte',
    'vielleicht': 'idealerweise',
    'eventuell': 'bei Bedarf',
    'might': 'should',
    'maybe': 'ideally',
    'perhaps': 'if needed',
  };

  Object.entries(replacements).forEach(([vague, specific]) => {
    const regex = new RegExp(`\\b${vague}\\b`, 'gi');
    improved = improved.replace(regex, specific);
  });

  return improved;
}

/**
 * Add constraints/guidelines section
 */
function addConstraintsSection(prompt: string): string {
  const constraintsSection = `\n\n# Richtlinien\n\n**Achte auf:**\n- Klarheit und Präzision in der Antwort\n- Vollständigkeit aller relevanten Informationen\n- Praktische Umsetzbarkeit der Vorschläge\n\n**Vermeide:**\n- Vage oder unspezifische Aussagen\n- Unnötige technische Details ohne Erklärung`;

  return prompt + constraintsSection;
}

/**
 * Enhance examples with more detail and variety
 */
function enhanceExamplesDetail(
  prompt: string,
  context?: { trickTitle?: string }
): string {
  // If examples section exists, make it more detailed
  if (prompt.includes('# Beispiele')) {
    // Already has examples section - enhance it
    return prompt.replace(
      /# Beispiele\n\n[\s\S]*?\n\n/,
      `# Beispiele

**Beispiel 1 (Einfach):**
Eingabe: [Einfacher Use Case]
Erwartete Ausgabe: [Konkrete, detaillierte Antwort mit Struktur]
Erklärung: [Warum diese Ausgabe optimal ist]

**Beispiel 2 (Komplex):**
Eingabe: [Komplexerer Use Case mit mehr Details]
Erwartete Ausgabe: [Umfangreichere, noch strukturiertere Antwort]
Erklärung: [Besondere Aspekte dieser Ausgabe]

**Beispiel 3 (Edge Case):**
Eingabe: [Grenzfall oder ungewöhnlicher Use Case]
Erwartete Ausgabe: [Wie mit Ausnahmefällen umgegangen wird]
Erklärung: [Wichtige Überlegungen für solche Fälle]

`
    );
  }
  return prompt;
}

/**
 * Add richer context and background information
 */
function addRicherContext(
  prompt: string,
  context?: { trickTitle?: string; trickCategory?: string }
): string {
  // Determine task type for personalized context
  const isEmailTask = /e-mail|email|mail/i.test(prompt);
  const isCodeTask = /code|programm|funktion|function/i.test(prompt);
  const isCreativeTask = /blog|artikel|story|text|schreib/i.test(prompt);
  const isAnalysisTask = /analys|auswert|bericht|report/i.test(prompt);

  // Select appropriate persona
  let persona = 'ein erfahrener Experte';
  let audienceDescription = 'das Team oder die Zielgruppe';
  let goalDescription = 'ein qualitativ hochwertiges, professionelles Ergebnis zu liefern';
  
  if (isEmailTask) {
    persona = 'ein professioneller Business-Kommunikator mit Erfahrung in klarer, zielgerichteter Korrespondenz';
    audienceDescription = 'Kollegen, Teammitglieder oder Business-Partner';
    goalDescription = 'eine klare, handlungsorientierte E-Mail zu verfassen, die alle relevanten Informationen enthält und zum gewünschten Ergebnis führt';
  } else if (isCodeTask) {
    persona = 'ein Senior Software Engineer mit Fokus auf Clean Code, Type Safety und Best Practices';
    audienceDescription = 'andere Entwickler, die den Code verstehen und warten müssen';
    goalDescription = 'robusten, wartbaren und gut dokumentierten Code zu schreiben, der alle Edge Cases behandelt';
  } else if (isCreativeTask) {
    persona = 'ein erfahrener Content Creator mit Expertise in strukturiertem, leserfreundlichem Schreiben';
    audienceDescription = 'Leser, die praktische, gut strukturierte Informationen suchen';
    goalDescription = 'einen informativen, gut strukturierten Text zu erstellen, der die Leser fesselt und Mehrwert bietet';
  } else if (isAnalysisTask) {
    persona = 'ein Datenanalyst mit Erfahrung in der Aufbereitung komplexer Informationen für Entscheidungsträger';
    audienceDescription = 'Führungskräfte oder Stakeholder, die auf Basis der Analyse Entscheidungen treffen';
    goalDescription = 'eine präzise, datengetriebene Analyse mit klaren Handlungsempfehlungen zu liefern';
  }

  const contextSection = `

# Kontext & Hintergrund

<kontext>

## Persona & Rolle
<persona>
Du bist ${persona}. Dein Ton ist professionell, präzise und auf den Nutzen fokussiert. Du lieferst stets praktisch umsetzbare Ergebnisse.
</persona>

## Zielgruppe
<target_audience>
Die Empfänger deiner Antwort sind: ${audienceDescription}. 
Sie erwarten eine klare, verständliche und direkt anwendbare Lösung. Berücksichtige deren Perspektive und Informationsbedarf.
</target_audience>

## Primäres Ziel
<primary_goal>
Das Hauptziel dieser Aufgabe ist: ${goalDescription}

**Erfolg bedeutet:**
- Alle relevanten Informationen sind enthalten
- Die Struktur ist klar und logisch
- Das Ergebnis ist direkt umsetzbar
- Qualität und Präzision stehen im Vordergrund
</primary_goal>

## Aufgabenkontext
**Trick/Methode:** ${context?.trickTitle || 'Prompt Engineering Best Practice'}
**Fachbereich:** ${context?.trickCategory || 'Allgemein'}

## Rahmenbedingungen & Constraints
<constraints>
**DU MUSST:**
✓ Fakten-basiert und präzise antworten
✓ Eine klare, logische Struktur einhalten
✓ Alle relevanten Details einbeziehen
✓ Praktisch umsetzbare Informationen liefern
✓ Bei Unsicherheit dies klar kommunizieren

**DU DARFST NICHT:**
✗ Vage oder mehrdeutige Aussagen machen
✗ Wichtige Informationen auslassen oder raten
✗ Die angegebene Struktur oder das Format ignorieren
✗ Ungeprüfte oder spekulative Behauptungen aufstellen
✗ Oberflächliche oder unvollständige Antworten geben
</constraints>

## Workflow-Position
<workflow_step>
Dies ist der finale Output-Schritt. Deine Antwort wird direkt verwendet oder mit minimalen Anpassungen weitergegeben. 
Konzentriere dich auf:
1. **Vollständigkeit** - Alle notwendigen Informationen müssen enthalten sein
2. **Klarheit** - Struktur und Sprache müssen eindeutig verständlich sein
3. **Qualität** - Strebe nach 9/10+ Qualität in allen Dimensionen
</workflow_step>

</kontext>`;

  // Insert context section after role if exists, otherwise at beginning
  if (prompt.includes('# Rolle')) {
    return prompt.replace(/(# Rolle\n\n<rolle>[\s\S]*?<\/rolle>)/, `$1${contextSection}\n`);
  } else {
    return contextSection + '\n\n' + prompt;
  }
}

/**
 * Enhance output format specification
 */
function enhanceOutputFormat(prompt: string): string {
  if (prompt.includes('# Gewünschtes Output-Format')) {
    return prompt.replace(
      /# Gewünschtes Output-Format\n\n[\s\S]*?\n\n/,
      `# Gewünschtes Output-Format

Deine Antwort muss folgende Kriterien erfüllen:

**Struktur:**
- Beginne mit einer kurzen Zusammenfassung (2-3 Sätze)
- Nutze nummerierte Listen für Schritte/Prozesse
- Nutze Bullet Points für Aufzählungen
- Verwende Überschriften zur Gliederung (##, ###)

**Inhalt:**
- Sei konkret und spezifisch - keine vagen Aussagen
- Gib praktische, umsetzbare Handlungsanweisungen
- Füge wo sinnvoll Beispiele oder Code-Snippets ein
- Erkläre das "Warum" hinter deinen Empfehlungen

**Stil:**
- Professionell aber zugänglich
- Klar und prägnant formuliert
- Vermeide Fachjargon ohne Erklärung

`
    );
  }
  return prompt;
}

/**
 * Enhance role definition with more detail
 */
function enhanceRoleDefinition(
  prompt: string,
  context?: { trickTitle?: string; trickCategory?: string }
): string {
  const categoryExpertise: Record<string, string> = {
    productivity: 'Produktivitäts-Optimization, Zeitmanagement und Workflow-Design',
    'content-creation': 'Content-Strategie, Copywriting und kreative Prozesse',
    programming: 'Software-Entwicklung, Code-Architektur und Best Practices',
    design: 'UI/UX-Design, Design-Systeme und visuelle Kommunikation',
    'data-analysis': 'Datenanalyse, Visualisierung und datengetriebene Entscheidungen',
    learning: 'Lernmethodik, Wissensmanagement und Skill-Entwicklung',
    business: 'Business-Strategie, Prozessoptimierung und Unternehmensführung',
    marketing: 'Marketing-Strategie, Kundenakquise und Markenaufbau',
  };

  const expertise = context?.trickCategory 
    ? categoryExpertise[context.trickCategory] || 'professionelle Problemlösung'
    : 'professionelle Problemlösung';

  if (prompt.includes('# Rolle')) {
    return prompt.replace(
      /# Rolle\n\nDu bist ein .*?\./,
      `# Rolle

Du bist ein hochqualifizierter Experte mit umfassender Erfahrung in ${expertise}.

**Deine Expertise umfasst:**
- Langjährige praktische Erfahrung in diesem Bereich
- Tiefes Verständnis für Best Practices und aktuelle Entwicklungen
- Fähigkeit, komplexe Konzepte verständlich zu erklären
- Fokus auf praxisnahe, sofort umsetzbare Lösungen

**Dein Arbeitsstil:**
- Strukturiert und methodisch
- Präzise und auf den Punkt
- Immer mit Blick auf den praktischen Nutzen`
    );
  }
  return prompt;
}

/**
 * Perfect the overall structure
 */
function perfectStructure(prompt: string): string {
  // Ensure clear section hierarchy
  let improved = prompt;

  // Make sure all main sections use # (h1) and subsections use ## (h2)
  const sections = [
    'Rolle',
    'Kontext',
    'Aufgabe',
    'Beispiele',
    'Gewünschtes Output-Format',
    'Richtlinien',
    'Qualitätskriterien',
  ];

  sections.forEach(section => {
    // Ensure consistent header level for main sections
    improved = improved.replace(
      new RegExp(`^#{2,}\\s+${section}`, 'm'),
      `# ${section}`
    );
  });

  return improved;
}

/**
 * Add quality criteria section
 */
function addQualityCriteria(prompt: string): string {
  const qualitySection = `

# Qualitätskriterien

Bevor du deine finale Antwort gibst, überprüfe diese Kriterien:

**Vollständigkeit:**
✓ Alle Aspekte der Anfrage wurden adressiert
✓ Keine wichtigen Informationen fehlen
✓ Alle Fragen wurden beantwortet

**Präzision:**
✓ Aussagen sind spezifisch und konkret
✓ Keine vagen oder mehrdeutigen Formulierungen
✓ Zahlen, Daten und Fakten sind korrekt

**Praxisrelevanz:**
✓ Empfehlungen sind direkt umsetzbar
✓ Beispiele sind realitätsnah
✓ Der praktische Nutzen ist klar erkennbar

**Verständlichkeit:**
✓ Struktur ist logisch und nachvollziehbar
✓ Fachbegriffe sind erklärt
✓ Der Text ist flüssig lesbar
`;

  return prompt + qualitySection;
}

/**
 * Add XML-style structure for maximum clarity
 */
function addXMLStructure(prompt: string): string {
  // Wrap key sections in XML-style tags for clarity
  let improved = prompt;

  // Wrap examples if they exist
  if (improved.includes('# Beispiele') && !improved.includes('<beispiele>')) {
    improved = improved.replace(
      /(# Beispiele\n\n)([\s\S]*?)(\n\n#|\n\n$)/,
      '$1<beispiele>\n$2\n</beispiele>$3'
    );
  }

  // Wrap role definition
  if (improved.includes('# Rolle') && !improved.includes('<rolle>')) {
    improved = improved.replace(
      /(# Rolle\n\n)([\s\S]*?)(\n\n#|\n\n$)/,
      '$1<rolle>\n$2\n</rolle>$3'
    );
  }

  // Wrap context
  if (improved.includes('# Kontext') && !improved.includes('<kontext>')) {
    improved = improved.replace(
      /(# Kontext[\s\S]*?\n\n)([\s\S]*?)(\n\n#|\n\n$)/,
      '$1<kontext>\n$2\n</kontext>$3'
    );
  }

  return improved;
}

/**
 * Quick check if a prompt is already high quality
 */
export function isHighQualityPrompt(prompt: string): boolean {
  const score = scorePrompt(prompt);
  return score.overall >= TARGET_SCORE;
}