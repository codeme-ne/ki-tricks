import { KITrick, Category, Difficulty, Impact } from '../types/types';
import { RawContent } from './content-scraper';

// AI-Content-Verarbeitung für KI-Tricks Erstellung
export interface ProcessingResult {
  success: boolean;
  kitrick?: KITrick;
  error?: string;
  confidence: number;
}

export class AIContentProcessor {

  // Hauptfunktion: Wandelt Raw-Content in KI-Trick um
  static async processToKITrick(content: RawContent): Promise<ProcessingResult> {
    try {
      // 1. Relevanz und Qualität prüfen
      if (!this.isHighQualityContent(content)) {
        return {
          success: false,
          error: 'Content quality too low',
          confidence: 0
        };
      }

      // 2. KI-Trick extrahieren
      const extractedTrick = await this.extractTrickFromContent(content);
      if (!extractedTrick) {
        return {
          success: false,
          error: 'No actionable trick found',
          confidence: 0
        };
      }

      // 3. Deutsche Übersetzung und Strukturierung
      const kitrick = await this.createKITrick(extractedTrick, content);
      
      return {
        success: true,
        kitrick,
        confidence: this.calculateConfidence(content, kitrick)
      };

    } catch (error) {
      return {
        success: false,
        error: `Processing failed: ${error}`,
        confidence: 0
      };
    }
  }

  // Prüft ob Content qualitativ hochwertig genug ist
  private static isHighQualityContent(content: RawContent): boolean {
    // Mindest-Engagement
    if ((content.score || 0) < 3) return false;
    
    // Mindest-Länge
    if (content.content.length < 100) return false;
    
    // Muss praktische Informationen enthalten
    const practicalIndicators = [
      'how to', 'tip', 'trick', 'method', 'technique', 'way to',
      'step', 'process', 'workflow', 'hack', 'secret', 'strategy'
    ];
    
    const text = `${content.title} ${content.content}`.toLowerCase();
    return practicalIndicators.some(indicator => text.includes(indicator));
  }

  // Extrahiert den praktischen Trick aus dem Content
  private static async extractTrickFromContent(content: RawContent): Promise<{
    title: string;
    description: string;
    steps: string[];
    examples: string[];
    tools: string[];
  } | null> {
    
    const text = `${content.title}\n\n${content.content}`;
    
    // Titel extrahieren (erste Zeile oder aus Kontext)
    const title = this.extractTitle(content);
    if (!title) return null;

    // Beschreibung mit "Warum es funktioniert" Hook erstellen
    const description = this.createDescription(content);
    
    // Schritte extrahieren
    const steps = this.extractSteps(text);
    
    // Beispiele extrahieren
    const examples = this.extractExamples(text);
    
    // Tools identifizieren
    const tools = this.identifyTools(text);

    return {
      title,
      description,
      steps,
      examples,
      tools
    };
  }

  // Titel-Extraktion mit verbesserter deutscher Übersetzung
  private static extractTitle(content: RawContent): string | null {
    let title = content.title;
    
    // Bereinige Reddit/Twitter spezifische Prefixes
    title = title.replace(/^(LPT:|TIL:|PSA:|YSK:|\[.*?\]|\(.*?\))/i, '').trim();
    
    // Entferne Frage-Zeichen bei How-To Titeln
    title = title.replace(/\?$/, '');
    
    // Erweiterte deutsche Übersetzung für verkaufsstarke Titel
    const translations: { [key: string]: string } = {
      'The .*? that': 'Der $1 der',
      'How to': 'So',
      'Tips for': 'Tipps für',
      'Ways to': 'Methoden um',
      'Best practices': 'Best Practices',
      'Productivity hack': 'Produktivitäts-Trick',
      'AI trick': 'KI-Trick',
      'ChatGPT tip': 'ChatGPT-Tipp',
      'prompt template': 'Prompt-Template',
      'that increased': 'das',
      'quality by': 'um',
      'personalized': 'personalisierte',
      'learning paths': 'Lernpfade',
      'for any skill': 'für jede Fähigkeit',
      'debugs any code error': 'jeden Code-Fehler debuggt',
      'turn any meeting into': 'verwandelt jedes Meeting in',
      'actionable tasks': 'umsetzbare Aufgaben',
      'automatically': 'automatisch'
    };

    // Vollständige deutsche Übersetzung falls englisch
    if (this.isEnglishTitle(title)) {
      title = this.translateTitleToGerman(title);
    } else {
      // Nur einzelne Begriffe übersetzen
      for (const [english, german] of Object.entries(translations)) {
        title = title.replace(new RegExp(english, 'gi'), german);
      }
    }

    // Überprüfe Mindestlänge
    if (title.length < 10 || title.length > 100) return null;

    return title;
  }

  // Prüft ob Titel auf Englisch ist
  private static isEnglishTitle(title: string): boolean {
    const englishIndicators = ['the', 'that', 'any', 'for', 'with', 'how', 'use', 'create', 'make'];
    const words = title.toLowerCase().split(/\s+/);
    const englishWords = words.filter(word => englishIndicators.includes(word));
    return englishWords.length >= 2;
  }

  // Vollständige deutsche Übersetzung für englische Titel
  private static translateTitleToGerman(title: string): string {
    const commonPatterns: { [key: string]: string } = {
      'The prompt template that increased my AI writing quality by 300%': 'Das Prompt-Template das meine AI-Schreibqualität um 300% verbesserte',
      'Use ChatGPT to create personalized learning paths for any skill': 'Personalisierte Lernpfade mit ChatGPT erstellen für jede Fähigkeit',
      'The 10-second prompt that debugs any code error': 'Der 10-Sekunden Prompt der jeden Code-Fehler debuggt',
      'I use AI to turn any meeting into actionable tasks automatically': 'Meetings automatisch in umsetzbare Aufgaben verwandeln'
    };

    // Exakte Übereinstimmung
    if (commonPatterns[title]) {
      return commonPatterns[title];
    }

    // Pattern-basierte Übersetzung
    let translated = title
      .replace(/The (.+) that (.+)/gi, 'Der $1 der $2')
      .replace(/Use (.+) to (.+)/gi, '$2 mit $1')
      .replace(/(.+) automatically/gi, '$1 automatisch')
      .replace(/prompt template/gi, 'Prompt-Template')
      .replace(/learning paths/gi, 'Lernpfade')
      .replace(/personalized/gi, 'personalisierte')
      .replace(/quality/gi, 'Qualität')
      .replace(/increased/gi, 'verbessert')
      .replace(/debugs/gi, 'debuggt')
      .replace(/code error/gi, 'Code-Fehler')
      .replace(/meeting/gi, 'Meeting')
      .replace(/actionable tasks/gi, 'umsetzbare Aufgaben');

    return translated;
  }

  // Beschreibung mit "Warum es funktioniert" Hook
  private static createDescription(content: RawContent): string {
    const text = content.content;
    
    // Extrahiere die ersten 2-3 Sätze als Basis
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    let baseDescription = sentences.slice(0, 2).join('. ').trim();
    
    if (baseDescription.length < 50) {
      baseDescription = sentences.slice(0, 3).join('. ').trim();
    }

    // Füge "Warum es funktioniert" Hook hinzu
    const whyItWorks = this.generateWhyItWorksSection(content);
    
    return `${baseDescription}\n\n**Warum es funktioniert:**\n${whyItWorks}`;
  }

  // "Warum es funktioniert" Sektion generieren
  private static generateWhyItWorksSection(content: RawContent): string {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    // Kontextuelle Erklärungen basierend auf Content-Art
    if (text.includes('prompt')) {
      return 'Durch spezifische Prompting-Techniken wird die AI dazu gebracht, strukturierter und zielgerichteter zu antworten, was zu besseren Ergebnissen führt.';
    }
    
    if (text.includes('automation')) {
      return 'Automatisierung reduziert repetitive Aufgaben und minimiert menschliche Fehler, während gleichzeitig die Konsistenz und Geschwindigkeit erhöht wird.';
    }
    
    if (text.includes('workflow')) {
      return 'Ein optimierter Workflow nutzt die Stärken von AI-Tools in der richtigen Reihenfolge und maximiert so die Effizienz des gesamten Prozesses.';
    }
    
    if (text.includes('template')) {
      return 'Vorgefertigte Templates standardisieren den Prozess und stellen sicher, dass wichtige Elemente nicht vergessen werden.';
    }
    
    // Default-Erklärung
    return 'Diese Methode nutzt die natürlichen Stärken von AI-Systemen und kompensiert gleichzeitig deren Schwächen durch strukturierte Herangehensweise.';
  }

  // Verbesserte Schritte-Extraktion mit intelligenter deutscher Übersetzung
  private static extractSteps(text: string): string[] {
    const steps: string[] = [];
    
    // Suche nach nummerierten Listen
    const numberedSteps = text.match(/\d+[\.\)]\s*([^\n\d]+)/g);
    if (numberedSteps) {
      steps.push(...numberedSteps.map(step => 
        step.replace(/^\d+[\.\)]\s*/, '').trim()
      ));
    }
    
    // Suche nach Bullet Points
    const bulletSteps = text.match(/[-\*•]\s*([^\n\-\*•]+)/g);
    if (bulletSteps && steps.length === 0) {
      steps.push(...bulletSteps.map(step => 
        step.replace(/^[-\*•]\s*/, '').trim()
      ));
    }
    
    // Intelligente Schritt-Generierung aus Content
    if (steps.length === 0) {
      steps.push(...this.generateStepsFromContent(text));
    }
    
    // Verbessere und übersetze Schritte
    const improvedSteps = steps.slice(0, 4).map(step => this.improveAndTranslateStep(step, text));
    
    // Filtere unvollständige Schritte
    return improvedSteps.filter(step => step.length > 10 && !step.includes('undefined'));
  }

  // Generiert Schritte aus Content-Kontext
  private static generateStepsFromContent(text: string): string[] {
    const lowerText = text.toLowerCase();
    
    // Prompt Template Steps
    if (lowerText.includes('prompt template') || lowerText.includes('act as')) {
      return [
        'Definiere die spezifische Rolle: "Agiere als [Experte] der für [Zielgruppe] schreibt"',
        'Setze klare Parameter: Thema, Tonfall, Ziel, Länge und 3-5 Hauptpunkte',
        'Füge Ausschlusskriterien hinzu: "Vermeide [unerwünschte Elemente]"',
        'Stelle Reflexionsfragen: Was ist der Hauptnutzen? Welche Beispiele verdeutlichen das?'
      ];
    }
    
    // Learning Path Steps
    if (lowerText.includes('learning') || lowerText.includes('study')) {
      return [
        'Beschreibe deinen aktuellen Wissensstand und relevante Vorerfahrungen',
        'Definiere dein konkretes Lernziel und den gewünschten Outcome',
        'Setze realistische Zeitrahmen und verfügbare Lernstunden pro Woche',
        'Fordere strukturierten Plan mit Meilensteinen und täglichen Aufgaben an'
      ];
    }
    
    // Debugging Steps
    if (lowerText.includes('debug') || lowerText.includes('error') || lowerText.includes('code')) {
      return [
        'Kopiere den kompletten Code-Block und die exakte Fehlermeldung',
        'Nutze strukturierten Prompt: "Hier ist mein Code und der Fehler..."',
        'Fordere systematische Antwort: Ursache, Lösung, Erklärung',
        'Lasse dir Präventionsmaßnahmen für ähnliche Fehler geben'
      ];
    }
    
    // Meeting Steps
    if (lowerText.includes('meeting') || lowerText.includes('actionable')) {
      return [
        'Während des Meetings: Audio aufnehmen oder strukturierte Notizen machen',
        'Transkript erstellen und in verdaubare Informationsblöcke aufteilen',
        'AI-Prompt nutzen: "Analysiere und erstelle Executive Summary + Action Items"',
        'Follow-up planen: Deadlines setzen und Verantwortlichkeiten zuweisen'
      ];
    }
    
    // Generic actionable steps
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const actionSentences = sentences.filter(sentence => 
      /\b(use|try|set|configure|add|create|make|do|start|begin|first|then|next|finally)\b/i.test(sentence)
    );
    
    return actionSentences.slice(0, 4);
  }

  // Verbessert und übersetzt einzelne Schritte
  private static improveAndTranslateStep(step: string, context: string): string {
    // Bereinige unvollständige Schritte
    step = step.replace(/^(What's|for|by)\s+/i, '').trim();
    
    // Stelle sicher dass Schritt mit Aktion beginnt
    if (!/^(Schritt|\d+\.|[A-ZÄÖÜ])/.test(step)) {
      step = this.makeActionable(step);
    }
    
    return this.translateStep(step);
  }

  // Macht Schritt zu einer konkreten Aktion
  private static makeActionable(step: string): string {
    const actionVerbs = {
      'template': 'Erstelle ein Template',
      'prompt': 'Verwende den Prompt',
      'learning': 'Erstelle einen Lernplan',
      'code': 'Analysiere den Code',
      'meeting': 'Dokumentiere das Meeting'
    };
    
    for (const [keyword, action] of Object.entries(actionVerbs)) {
      if (step.toLowerCase().includes(keyword)) {
        return `${action}: ${step}`;
      }
    }
    
    return `Führe aus: ${step}`;
  }

  // Schritt ins Deutsche übersetzen
  private static translateStep(step: string): string {
    const translations: { [key: string]: string } = {
      'Open': 'Öffne',
      'Go to': 'Gehe zu',
      'Click on': 'Klicke auf',
      'Type': 'Gib ein',
      'Select': 'Wähle',
      'Copy': 'Kopiere',
      'Paste': 'Füge ein',
      'Save': 'Speichere',
      'Use': 'Verwende',
      'Try': 'Probiere',
      'Set': 'Setze',
      'Configure': 'Konfiguriere'
    };

    let translatedStep = step;
    for (const [english, german] of Object.entries(translations)) {
      translatedStep = translatedStep.replace(new RegExp(`^${english}`, 'i'), german);
    }

    return translatedStep.trim();
  }

  // Verbesserte Beispiel-Extraktion mit deutschen Real-World Scenarios
  private static extractExamples(text: string): string[] {
    const examples: string[] = [];
    
    // Suche nach "For example", "Example:", etc.
    const exampleMatches = text.match(/(?:for example|example|e\.g\.|such as)[:\-\s]*([^.!?]*[.!?])/gi);
    if (exampleMatches) {
      examples.push(...exampleMatches.map(match => 
        match.replace(/^(?:for example|example|e\.g\.|such as)[:\-\s]*/i, '').trim()
      ));
    }
    
    // Suche nach konkreten Use Cases
    const useCaseMatches = text.match(/(?:use case|you can|i use this)[:\-\s]*([^.!?]*[.!?])/gi);
    if (useCaseMatches) {
      examples.push(...useCaseMatches.map(match => 
        match.replace(/^(?:use case|you can|i use this)[:\-\s]*/i, '').trim()
      ));
    }
    
    // Generiere kontextuelle deutsche Beispiele falls keine gefunden
    if (examples.length === 0) {
      examples.push(...this.generateContextualExamples(text));
    }
    
    return examples.slice(0, 2).map(example => this.improveExample(example));
  }

  // Generiert kontextuelle deutsche Beispiele
  private static generateContextualExamples(text: string): string[] {
    const lowerText = text.toLowerCase();
    
    // Prompt Template Beispiele
    if (lowerText.includes('prompt template') || lowerText.includes('writing')) {
      return [
        'Für Blog-Posts: "Agiere als Content-Marketing-Experte der für Startup-Gründer schreibt. Thema: AI-Produktivität, Tonfall: praxisnah, Ziel: 5 konkrete Tipps vermitteln"',
        'Für E-Mails: "Agiere als Sales-Experte der für B2B-Entscheider schreibt. Tonfall: professionell aber persönlich, Ziel: Meeting-Termin vereinbaren"'
      ];
    }
    
    // Learning Path Beispiele
    if (lowerText.includes('learning') || lowerText.includes('skill')) {
      return [
        'Python für Data Science: "Ich bin Marketing-Manager mit Excel-Kenntnissen. Ziel: Eigene Dashboards erstellen in 8 Wochen, 5h/Woche"',
        'UI/UX Design: "Ich bin Entwickler mit HTML/CSS Kenntnissen. Ziel: Erste Design-Projekte umsetzen in 12 Wochen, 3h/Woche"'
      ];
    }
    
    // Debugging Beispiele
    if (lowerText.includes('debug') || lowerText.includes('error')) {
      return [
        'JavaScript TypeError: "Cannot read property of undefined" → AI erklärt Null-Checking mit ?.-Operator und Optional Chaining',
        'Python ImportError: "ModuleNotFoundError" → AI zeigt pip install Befehl und erklärt Virtual Environments Setup'
      ];
    }
    
    // Meeting Beispiele
    if (lowerText.includes('meeting') || lowerText.includes('actionable')) {
      return [
        'Produkt-Meeting: 45min Meeting → 5min AI-Processing → Klare Feature-Roadmap mit 8 Tasks und 2-Wochen-Sprint-Plan',
        'Client-Call: 30min Kundengespräch → 3min AI-Processing → Projektscope mit Budget-Rahmen und konkreten nächsten Schritten'
      ];
    }
    
    return [];
  }

  // Verbessert Beispiele mit deutschen Real-World Scenarios
  private static improveExample(example: string): string {
    // Bereinige unvollständige Beispiele
    example = example.replace(/^(s would|for|by)\s+/i, '').trim();
    
    // Übersetze und verbessere
    let improved = this.translateExample(example);
    
    // Stelle sicher dass Beispiel konkret und messbar ist
    if (improved.length < 20) {
      improved = `Beispiel: ${improved} mit messbaren Ergebnissen nach 1-2 Wochen Anwendung`;
    }
    
    return improved;
  }

  // Erweiterte deutsche Übersetzung für Beispiele
  private static translateExample(example: string): string {
    // Umfassende Übersetzungen für häufige Beispiel-Phrasen
    return example.replace(/you can/gi, 'Du kannst')
                 .replace(/i use/gi, 'Ich verwende')
                 .replace(/this helps/gi, 'Das hilft')
                 .replace(/for instance/gi, 'Zum Beispiel')
                 .replace(/blog posts/gi, 'Blog-Posts')
                 .replace(/emails/gi, 'E-Mails')
                 .replace(/social media/gi, 'Social Media')
                 .replace(/technical documentation/gi, 'technische Dokumentation')
                 .replace(/data analysis/gi, 'Datenanalyse')
                 .replace(/dashboard/gi, 'Dashboard')
                 .replace(/meeting/gi, 'Meeting')
                 .replace(/project/gi, 'Projekt')
                 .replace(/client/gi, 'Kunde')
                 .replace(/feature/gi, 'Feature')
                 .replace(/workflow/gi, 'Workflow');
  }

  // AI-Tools im Text identifizieren
  private static identifyTools(text: string): string[] {
    const knownTools = [
      'ChatGPT', 'GPT-4', 'GPT-3.5', 'Claude', 'Anthropic',
      'Bard', 'Gemini', 'Copilot', 'GitHub Copilot',
      'Midjourney', 'DALL-E', 'Stable Diffusion',
      'Notion AI', 'Jasper', 'Copy.ai', 'Grammarly',
      'Otter.ai', 'Loom', 'Zapier', 'Make'
    ];
    
    const foundTools = knownTools.filter(tool => 
      text.toLowerCase().includes(tool.toLowerCase())
    );
    
    // Default zu Generic AI wenn keine spezifischen Tools gefunden
    if (foundTools.length === 0) {
      if (text.toLowerCase().includes('ai') || text.toLowerCase().includes('artificial intelligence')) {
        foundTools.push('AI-Tools');
      }
    }
    
    return foundTools;
  }

  // KI-Trick Objekt erstellen
  private static async createKITrick(extractedTrick: any, content: RawContent): Promise<KITrick> {
    const now = new Date();
    return {
      id: this.generateId(extractedTrick.title),
      slug: this.generateSlug(extractedTrick.title),
      title: extractedTrick.title,
      description: extractedTrick.description,
      category: this.categorizeContent(content),
      difficulty: this.assessDifficulty(content),
      tools: extractedTrick.tools,
      timeToImplement: this.estimateTimeToImplement(content),
      impact: this.assessImpact(content),
      steps: extractedTrick.steps.length > 0 ? extractedTrick.steps : undefined,
      examples: extractedTrick.examples.length > 0 ? extractedTrick.examples : undefined,
      createdAt: now,
      updatedAt: now,
      'Warum es funktioniert': extractedTrick.whyItWorks || 'Dieser Trick nutzt bewährte Prinzipien aus der Kognitionspsychologie und ist besonders effektiv.'
    };
  }

  // ID generieren
  private static generateId(title: string): string {
    return `scraped-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Slug generieren
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[äöüß]/g, char => ({
        'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss'
      }[char] || char))
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  // Kategorisierung (aus parent class übernommen aber erweitert)
  private static categorizeContent(content: RawContent): Category {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    const categoryMap: { [key: string]: string[] } = {
      'programming': ['code', 'programming', 'development', 'github', 'api', 'software'],
      'productivity': ['productivity', 'workflow', 'efficiency', 'organization', 'time management'],
      'learning': ['learn', 'study', 'education', 'tutorial', 'guide', 'course'],
      'business': ['business', 'enterprise', 'company', 'strategy', 'management'],
      'content-creation': ['content', 'writing', 'creative', 'blog', 'social media'],
      'data-analysis': ['data', 'analysis', 'analytics', 'visualization', 'statistics'],
      'marketing': ['marketing', 'advertising', 'promotion', 'campaign', 'seo'],
      'design': ['design', 'ui', 'ux', 'visual', 'graphics']
    };

    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category as Category;
      }
    }

    return 'productivity'; // Default
  }

  // Schwierigkeit einschätzen
  private static assessDifficulty(content: RawContent): Difficulty {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    if (text.includes('advanced') || text.includes('expert') || text.includes('complex') || 
        text.includes('api') || text.includes('code') || text.includes('technical')) {
      return 'advanced';
    }
    
    if (text.includes('intermediate') || text.includes('medium') || 
        text.length > 1000) {
      return 'intermediate';
    }
    
    return 'beginner';
  }

  // Impact einschätzen
  private static assessImpact(content: RawContent): Impact {
    const score = content.score || 0;
    const comments = content.comments || 0;
    const textLength = content.content.length;
    
    let impactScore = 0;
    impactScore += Math.min(score, 100) * 0.4;
    impactScore += Math.min(comments, 50) * 0.3;
    impactScore += Math.min(textLength / 100, 20) * 0.3;
    
    if (impactScore >= 40) return 'high';
    if (impactScore >= 20) return 'medium';
    return 'low';
  }

  // Zeit zum Implementieren schätzen
  private static estimateTimeToImplement(content: RawContent): string {
    const text = `${content.title} ${content.content}`.toLowerCase();
    const steps = (content.content.match(/\d+[\.\)]/g) || []).length;
    
    if (text.includes('quick') || text.includes('simple') || steps <= 2) {
      return '5-10 Minuten';
    }
    
    if (text.includes('setup') || text.includes('configure') || steps > 5) {
      return '30-45 Minuten';
    }
    
    return '10-20 Minuten'; // Default
  }

  // Vertrauen in die Verarbeitung berechnen
  private static calculateConfidence(content: RawContent, kitrick: KITrick): number {
    let confidence = 50; // Base confidence
    
    // Erhöhe basierend auf Content-Qualität
    confidence += Math.min((content.score || 0), 50);
    confidence += Math.min((content.comments || 0) * 2, 20);
    
    // Erhöhe für strukturierten Content
    if (kitrick.steps && kitrick.steps.length > 0) confidence += 10;
    if (kitrick.examples && kitrick.examples.length > 0) confidence += 10;
    
    // Reduziere für kurzen Content
    if (content.content.length < 200) confidence -= 15;
    
    return Math.max(0, Math.min(100, confidence));
  }
}

export default AIContentProcessor;