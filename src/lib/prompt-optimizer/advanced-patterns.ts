/**
 * Advanced Prompt Engineering Patterns
 * 
 * State-of-the-art techniques from 2025 research:
 * - Chain-of-Thought (CoT)
 * - ReAct (Reasoning + Acting)
 * - Tree of Thoughts (ToT)
 * - Self-Reflection
 * - Constitutional AI Principles
 */

export interface AdvancedPattern {
  name: string;
  template: string;
  triggerPhrases: string[];
  weight: number; // Impact on score
}

/**
 * Chain-of-Thought Pattern
 * Trigger: "Let's think step by step"
 */
export const COT_PATTERN: AdvancedPattern = {
  name: 'Chain-of-Thought',
  template: `

# Denkprozess (Chain-of-Thought)

**Gehe systematisch vor:**
1. Analysiere die Anfrage Schritt für Schritt
2. Identifiziere alle relevanten Teilaspekte
3. Entwickle eine logische Argumentationskette
4. Ziehe fundierte Schlussfolgerungen

**Denke laut:**
- Erkläre deinen Denkprozess transparent
- Zeige Zwischenschritte deiner Überlegungen
- Begründe deine Entscheidungen`,
  triggerPhrases: [
    'Denke Schritt für Schritt',
    'Gehe systematisch vor',
    'Analysiere schrittweise',
  ],
  weight: 1.5,
};

/**
 * ReAct Pattern (Reasoning + Acting)
 * Combines thinking with action
 */
export const REACT_PATTERN: AdvancedPattern = {
  name: 'ReAct',
  template: `

# Vorgehensweise (ReAct-Methode)

Folge diesem Reasoning-Action-Zyklus:

**1. THOUGHT (Überlegung):**
- Was ist das eigentliche Problem?
- Welche Informationen habe ich?
- Was fehlt mir noch?

**2. ACTION (Handlung):**
- Welche konkreten Schritte sind nötig?
- Was ist die nächste sinnvolle Aktion?

**3. OBSERVATION (Beobachtung):**
- Was habe ich erreicht?
- Ist das Ergebnis zufriedenstellend?
- Muss ich korrigieren oder weitermachen?

Wiederhole diesen Zyklus bis zur Lösung.`,
  triggerPhrases: [
    'Überlege, dann handle',
    'Thought, Action, Observation',
    'Iteriere bis zur Lösung',
  ],
  weight: 1.8,
};

/**
 * Self-Reflection Pattern
 * Critical self-assessment of outputs
 */
export const SELF_REFLECTION_PATTERN: AdvancedPattern = {
  name: 'Self-Reflection',
  template: `

# Selbstprüfung (Self-Reflection)

**BEVOR du deine finale Antwort gibst:**

**Frage dich selbst:**
- ✓ Ist diese Antwort vollständig und präzise?
- ✓ Habe ich alle Aspekte der Anfrage addressiert?
- ✓ Sind meine Aussagen faktisch korrekt?
- ✓ Ist die Struktur klar und logisch?
- ✓ Könnte ich irgendetwas verbessern?

**Falls NEIN bei irgendeinem Punkt:**
→ Überarbeite deine Antwort BEVOR du sie abgibst

**Qualitätscheck:**
Bewerte deine eigene Antwort auf einer Skala 1-10.
Wenn unter 9: Verbessere sie!`,
  triggerPhrases: [
    'Überprüfe deine Antwort',
    'Kritische Selbstbewertung',
    'Qualitätscheck vor Abgabe',
  ],
  weight: 2.0,
};

/**
 * Constitutional AI Principles
 * Explicit rules for behavior
 */
export const CONSTITUTIONAL_PATTERN: AdvancedPattern = {
  name: 'Constitutional Principles',
  template: `

# Grundprinzipien (Constitutional AI)

**DU MUSST:**
✓ Präzise und faktisch korrekt antworten
✓ Strukturiert und klar kommunizieren
✓ Alle relevanten Details einbeziehen
✓ Praktisch umsetzbare Lösungen bieten
✓ Bei Unsicherheit dies klar kommunizieren

**DU DARFST NIEMALS:**
✗ Vage oder mehrdeutige Aussagen machen
✗ Wichtige Informationen auslassen
✗ Ungeprüfte Behauptungen aufstellen
✗ Die Struktur oder das Format ignorieren
✗ Oberflächlich oder unvollständig antworten

**BEI KONFLIKTEN:**
Priorisiere: Korrektheit > Vollständigkeit > Klarheit > Kreativität`,
  triggerPhrases: [
    'Befolge diese Grundprinzipien',
    'Halte dich strikt an',
    'Constitutional rules',
  ],
  weight: 1.7,
};

/**
 * Meta-Instructions Pattern
 * Instructions about following instructions
 */
export const META_INSTRUCTIONS_PATTERN: AdvancedPattern = {
  name: 'Meta-Instructions',
  template: `

# Meta-Instruktionen

**Wie du diese Instruktionen interpretieren sollst:**

1. **Priorität der Abschnitte:**
   - Rolle & Kontext → Verstehe deine Aufgabe
   - Beispiele → Lerne das gewünschte Muster
   - Output-Format → Halte dich STRIKT daran
   - Richtlinien → Berücksichtige bei jeder Entscheidung

2. **Bei Widersprüchen:**
   - Explizite Nutzeranfrage > Allgemeine Richtlinien
   - Spätere Instruktionen > Frühere Instruktionen
   - Spezifisches > Allgemeines

3. **Qualitätsstandard:**
   - Jede Antwort muss mindestens 9/10 Qualität erreichen
   - Lieber länger nachdenken als schnell schlechte Antwort geben
   - Selbstkorrektur ist erwünscht und notwendig`,
  triggerPhrases: [
    'Beachte die Instruktionen-Hierarchie',
    'Meta-level guidance',
    'Interpretation dieser Anweisungen',
  ],
  weight: 1.6,
};

/**
 * Task Decomposition Pattern
 * Breaking complex tasks into steps
 */
export const TASK_DECOMPOSITION_PATTERN: AdvancedPattern = {
  name: 'Task Decomposition',
  template: `

# Aufgabenzerlegung

**Komplexe Aufgaben systematisch angehen:**

**Schritt 1: Analyse**
- Identifiziere Haupt- und Teilaufgaben
- Liste alle Anforderungen auf
- Erkenne Abhängigkeiten zwischen Aufgaben

**Schritt 2: Priorisierung**
- Was muss zuerst erledigt werden?
- Welche Aufgaben sind kritisch?
- Was kann parallel bearbeitet werden?

**Schritt 3: Ausführung**
- Bearbeite eine Teilaufgabe vollständig
- Validiere das Ergebnis
- Gehe zur nächsten Teilaufgabe

**Schritt 4: Integration**
- Füge alle Teilergebnisse zusammen
- Prüfe Konsistenz und Vollständigkeit
- Finales Review`,
  triggerPhrases: [
    'Zerlege die Aufgabe in Schritte',
    'Systematische Dekomposition',
    'Divide and conquer approach',
  ],
  weight: 1.4,
};

/**
 * All advanced patterns for easy iteration
 */
export const ALL_ADVANCED_PATTERNS: AdvancedPattern[] = [
  SELF_REFLECTION_PATTERN,      // Weight 2.0 - Most important
  REACT_PATTERN,                 // Weight 1.8
  CONSTITUTIONAL_PATTERN,        // Weight 1.7
  META_INSTRUCTIONS_PATTERN,     // Weight 1.6
  COT_PATTERN,                   // Weight 1.5
  TASK_DECOMPOSITION_PATTERN,    // Weight 1.4
].sort((a, b) => b.weight - a.weight); // Sort by weight descending