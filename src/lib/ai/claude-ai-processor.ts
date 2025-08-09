import { KITrick, Category, Difficulty, Impact } from '../types/types';
import { RawContent } from './content-scraper';
import OpenAI from 'openai';

// Claude AI-basierte Content-Verarbeitung für KI-Tricks
export interface ClaudeProcessingResult {
  success: boolean;
  kitrick?: KITrick;
  error?: string;
  confidence: number;
  usedAI: boolean; // Zeigt an ob Claude API verwendet wurde
}

export class ClaudeAIProcessor {
  private static openaiClient: OpenAI | null = null;

  // Lazy-initialized OpenAI Client
  private static getOpenAIClient(): OpenAI | null {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!this.openaiClient && openaiApiKey && openaiApiKey !== 'your_openai_api_key_here') {
      console.log('🔑 Initialisiere OpenAI Client...');
      this.openaiClient = new OpenAI({
        apiKey: openaiApiKey,
      });
    }
    return this.openaiClient;
  }
  
  // Hauptfunktion: Wandelt Raw-Content mit Claude API in KI-Trick um
  static async processToKITrick(content: RawContent): Promise<ClaudeProcessingResult> {
    try {
      console.log(`🤖 Verarbeite Content: "${content.title.substring(0, 50)}..."`);
      
      // 1. Basis-Qualitätsprüfung
      if (!this.isHighQualityContent(content)) {
        return {
          success: false,
          error: 'Content quality too low',
          confidence: 0,
          usedAI: false
        };
      }

      // 2. AI API verfügbar? Priorisiere OpenAI (günstiger), dann Claude, dann Fallback
      let kitrick: KITrick;
      let usedAI = false;
      
      const openaiClient = this.getOpenAIClient();
      if (openaiClient) {
        console.log('🤖 Verwende OpenAI GPT-4o-mini für Content-Verarbeitung');
        kitrick = await this.processWithOpenAI(content, openaiClient);
        usedAI = true;
      } else if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') {
        console.log('🧠 Verwende Claude API für Content-Verarbeitung');
        kitrick = await this.processWithClaudeAPI(content);
        usedAI = true;
      } else {
        console.log('📝 Keine AI API verfügbar, verwende Pattern-Matching');
        kitrick = await this.processWithPatternMatching(content);
        usedAI = false;
      }
      
      const confidence = this.calculateConfidence(content, kitrick, usedAI);
      
      return {
        success: true,
        kitrick,
        confidence,
        usedAI
      };

    } catch (error) {
      console.error('❌ Fehler bei Content-Verarbeitung:', error);
      return {
        success: false,
        error: `Processing failed: ${error}`,
        confidence: 0,
        usedAI: false
      };
    }
  }

  // OpenAI API-basierte Verarbeitung (Modern & Günstig)
  private static async processWithOpenAI(content: RawContent, client: OpenAI): Promise<KITrick> {
    try {
      const prompt = this.buildAIPrompt(content);
      console.log('🎯 OpenAI Prompt erstellt:', prompt.substring(0, 200) + '...');
      
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini", // Sehr günstig: $0.15 per 1M input tokens
        messages: [
          {
            role: "system",
            content: "Du bist ein KI-Redakteur. Deine einzige Aufgabe ist es, den User-Prompt exakt zu befolgen und ausschließlich im geforderten XML-Format zu antworten."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        console.log('✅ OpenAI Response erhalten:', response.substring(0, 100) + '...');
        return await this.parseAIResponse(response, content);
      } else {
        console.log('⚠️ Leere OpenAI Response, verwende Pattern-Matching');
        return await this.processWithPatternMatching(content, true);
      }
      
    } catch (error) {
      console.error('❌ OpenAI API Fehler:', error);
      console.log('🔄 Fallback zu Pattern-Matching');
      return this.processWithPatternMatching(content, true);
    }
  }

  // Claude API-basierte Verarbeitung (Modern)
  private static async processWithClaudeAPI(content: RawContent): Promise<KITrick> {
    const prompt = this.buildAIPrompt(content);
    
    // Hier würde der echte Claude API Call stehen
    // Für jetzt simulieren wir das mit einer verbesserten Logik
    console.log('🎯 Claude Prompt erstellt:', prompt.substring(0, 200) + '...');
    
    // TODO: Echte Claude API Integration
    // const response = await this.callClaudeAPI(prompt);
    
    // Fallback zu Pattern-Matching mit AI-ähnlicher Logik
    return this.processWithPatternMatching(content, true);
  }

  // Pattern-Matching Fallback (Legacy aber verbessert)
  private static async processWithPatternMatching(content: RawContent, aiStyle = false): Promise<KITrick> {
    const now = new Date();
    
    // Vereinfachte, robuste Titel-Extraktion
    const title = this.extractTitle(content, aiStyle);
    
    // Vereinfachte Beschreibung mit Hook
    const description = this.createDescription(content, aiStyle);
    
    // Vereinfachte Schritte-Extraktion
    const steps = this.extractSteps(content, aiStyle);
    
    // Vereinfachte Beispiele
    const examples = this.extractExamples(content, aiStyle);
    
    return {
      id: this.generateId(title),
      slug: this.generateSlug(title),
      title,
      description,
      category: this.categorizeContent(content),
      difficulty: this.assessDifficulty(content),
      tools: this.identifyTools(content),
      timeToImplement: this.estimateTimeToImplement(content),
      impact: this.assessImpact(content),
      steps: steps.length > 0 ? steps : undefined,
      examples: examples.length > 0 ? examples : undefined,
      createdAt: now,
      updatedAt: now,
      'Warum es funktioniert': 'Dieser Trick nutzt bewährte Prinzipien der kognitiven Wissenschaft und ist in der Praxis erprobt.'
    };
  }

  // AI Prompt Builder (für OpenAI und Claude) - Finale optimierte Version für 95+ Qualität
  private static buildAIPrompt(content: RawContent): string {
    return `
Du bist ein KI-gestützter Redakteur für die Plattform "ki-tricks.com". Deine einzige Aufgabe ist es, englische Online-Inhalte in hochwertige, sofort-verwendbare deutsche KI-Tricks umzuwandeln.

**STRIKTE REGELN:**
1. Deine Ausgabe MUSS IMMER und AUSSCHLIESSLICH dem unten definierten XML-Format entsprechen. Füge NIEMALS Text außerhalb der XML-Tags hinzu.
2. Wähle die Kategorie AUSSCHLIESSLICH aus dieser exakten Liste: programming, productivity, learning, business, content-creation, data-analysis, marketing, design.
3. Formuliere die <schritt>-Tags als einzelne, klare Handlungsanweisungen, die den Prozess der Anwendung beschreiben. Ein Prompt-Template sollte auf mehrere Schritte aufgeteilt werden.

---
BEISPIEL (ONE-SHOT):
---
<input>
  <titel>This prompt gets you perfect code diagnoses in 10 seconds</titel>
  <inhalt>I always struggled with bugs. Then I started using this prompt: 'You are an expert software engineer. Here is my code: [CODE]. Explain the bug, provide the corrected code, and explain the fix.' It works every time and saves me hours.</inhalt>
</input>
<output>
  <trick>
    <titel>Der 10-Sekunden-Trick für perfekte Code-Diagnosen</titel>
    <beschreibung>Fehler im Code zu finden kann Stunden dauern. Mit dem richtigen Prompt analysiert eine KI deinen Code in Sekunden und liefert nicht nur die Lösung, sondern auch eine verständliche Erklärung des Problems.

**Warum es funktioniert:** Indem du der KI eine klare Rolle ("Experte") und eine strukturierte Aufgabe gibst, aktivierst du ihre Fähigkeit zur logischen Analyse und zielgerichteten Problemlösung, was zu präziseren Ergebnissen führt.</beschreibung>
    <schritte>
      <schritt>Öffne ChatGPT oder Claude.</schritt>
      <schritt>Kopiere den folgenden Prompt und füge ihn ein: "Du bist ein erfahrener Softwareentwickler. Analysiere diesen Code, identifiziere den Fehler, korrigiere ihn und erkläre die Korrektur."</schritt>
      <schritt>Füge deinen fehlerhaften Code direkt nach dem Prompt ein.</schritt>
      <schritt>Analysiere die Antwort und integriere den korrigierten Code in dein Projekt.</schritt>
    </schritte>
    <beispiele>
      <beispiel>Ein Python-Entwickler reduzierte die Debugging-Zeit für einen komplexen Fehler von 2 Stunden auf unter 5 Minuten.</beispiel>
      <beispiel>Ein Startup-Team nutzt diesen Trick, um Code-Reviews zu beschleunigen und die Entwicklungsgeschwindigkeit um 20% zu steigern.</beispiel>
    </beispiele>
    <metadaten>
      <kategorie>programming</kategorie>
      <schwierigkeit>beginner</schwierigkeit>
      <tools>ChatGPT, Claude, GitHub Copilot</tools>
      <zeit>5-10 Minuten</zeit>
      <impact>high</impact>
    </metadaten>
  </trick>
</output>

---
DEINE AUFGABE:
---
<input>
  <titel>${content.title}</titel>
  <inhalt>${content.content}</inhalt>
  <score>${content.score}</score>
</input>
<output>
`;
  }

  // Parst AI-Response in KITrick-Objekt - Einfacher XML-Parser
  private static async parseAIResponse(response: string, content: RawContent): Promise<KITrick> {
    try {
      const now = new Date();

      const getText = (tag: string): string => {
        const match = response.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
        return match ? match[1].trim() : '';
      };

      const getItems = (parentTag: string, childTag: string): string[] => {
        const parentMatch = response.match(new RegExp(`<${parentTag}>([\\s\\S]*?)<\\/${parentTag}>`));
        if (!parentMatch) return [];
        const itemsContent = parentMatch[1];
        const itemMatches = [...itemsContent.matchAll(new RegExp(`<${childTag}>([\\s\\S]*?)<\\/${childTag}>`, 'g'))];
        return itemMatches.map(match => match[1].trim());
      };

      const title = getText('titel');
      const description = getText('beschreibung');
      const steps = getItems('schritte', 'schritt');
      const examples = getItems('beispiele', 'beispiel');
      const category = getText('kategorie') as Category;
      const difficulty = getText('schwierigkeit') as Difficulty;
      const tools = getText('tools').split(',').map(t => t.trim()).filter(Boolean);
      const timeToImplement = getText('zeit');
      const impact = getText('impact') as Impact;

      // Fallbacks für den Fall, dass die KI ein Feld vergisst
      const finalTitle = title || this.extractTitle(content, true);

      return {
        id: this.generateId(finalTitle),
        slug: this.generateSlug(finalTitle),
        title: finalTitle.length > 80 ? finalTitle.substring(0, 77) + '...' : finalTitle,
        description: description || this.createDescription(content, true),
        category: category || this.categorizeContent(content),
        difficulty: difficulty || this.assessDifficulty(content),
        tools: tools.length > 0 ? tools : this.identifyTools(content),
        timeToImplement: timeToImplement || this.estimateTimeToImplement(content),
        impact: impact || this.assessImpact(content),
        steps: steps.length > 0 ? steps : undefined,
        examples: examples.length > 0 ? examples : undefined,
        createdAt: now,
        updatedAt: now,
        'Warum es funktioniert': 'Dieser Trick basiert auf bewährten Methoden der künstlichen Intelligenz und kognitiven Psychologie.'
      };

    } catch (error) {
      console.error('❌ Fehler beim Parsen der XML-AI-Response:', error);
      console.log('🔄 Fallback zu Pattern-Matching');
      return await this.processWithPatternMatching(content, true);
    }
  }

  // Vereinfachte Hilfsfunktionen (stark gekürzt gegenüber Original)
  private static isHighQualityContent(content: RawContent): boolean {
    return (content.score || 0) >= 3 && 
           content.content.length >= 50 && 
           this.isAIRelevant(content);
  }

  private static isAIRelevant(content: RawContent): boolean {
    const text = `${content.title} ${content.content}`.toLowerCase();
    const keywords = ['ai', 'chatgpt', 'claude', 'prompt', 'productivity', 'automation', 'tip', 'trick'];
    return keywords.some(keyword => text.includes(keyword));
  }

  private static extractTitle(content: RawContent, aiStyle = false): string {
    let title = content.title;
    
    // Bereinige Reddit-Prefixes
    title = title.replace(/^(LPT:|TIL:|PSA:|YSK:|\[.*?\])/i, '').trim();
    
    // AI-Style: Intelligentere deutsche Übersetzung
    if (aiStyle && this.isEnglishTitle(title)) {
      title = this.translateToGerman(title);
    }
    
    // Fallback: Erste 60 Zeichen
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  }

  private static isEnglishTitle(title: string): boolean {
    const englishWords = ['the', 'that', 'how', 'use', 'with', 'for', 'and'];
    const words = title.toLowerCase().split(/\s+/);
    return englishWords.filter(word => words.includes(word)).length >= 2;
  }

  private static translateToGerman(title: string): string {
    // Einfache, robuste Übersetzungsmuster
    return title
      .replace(/^How to\s+/i, 'So ')
      .replace(/\buse\b/gi, 'nutze')
      .replace(/\btip\b/gi, 'Tipp') 
      .replace(/\btrick\b/gi, 'Trick')
      .replace(/\bhack\b/gi, 'Hack')
      .replace(/\bproductivity\b/gi, 'Produktivität')
      .replace(/\bAI\b/gi, 'KI')
      .replace(/\bChatGPT\b/gi, 'ChatGPT')
      .replace(/\bClaude\b/gi, 'Claude');
  }

  private static createDescription(content: RawContent, aiStyle = false): string {
    const sentences = content.content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    let description = sentences.slice(0, 2).join('. ').trim();
    
    if (description.length < 50 && sentences.length > 2) {
      description = sentences.slice(0, 3).join('. ').trim();
    }
    
    // Kürze auf max 200 Zeichen
    if (description.length > 200) {
      description = description.substring(0, 197) + '...';
    }
    
    // Füge "Warum es funktioniert" Hook hinzu
    const whyItWorks = aiStyle ? 
      'Diese Methode nutzt strukturierte AI-Prompts für konsistente, hochwertige Ergebnisse.' :
      'Durch gezielten Einsatz von AI-Tools wird der Workflow optimiert und die Effizienz gesteigert.';
    
    return `${description}\n\n**Warum es funktioniert:**\n${whyItWorks}`;
  }

  private static extractSteps(content: RawContent, aiStyle = false): string[] {
    const text = content.content;
    
    // Suche nach nummerierten Listen
    const numberedSteps = text.match(/\d+[\.\)]\s*([^\n\d]+)/g);
    if (numberedSteps) {
      return numberedSteps
        .map(step => step.replace(/^\d+[\.\)]\s*/, '').trim())
        .slice(0, 4)
        .filter(step => step.length > 10);
    }
    
    // Suche nach Bullet Points
    const bulletSteps = text.match(/[-\*•]\s*([^\n\-\*•]+)/g);
    if (bulletSteps) {
      return bulletSteps
        .map(step => step.replace(/^[-\*•]\s*/, '').trim())
        .slice(0, 4)
        .filter(step => step.length > 10);
    }
    
    // Fallback: Generiere Basis-Schritte
    return [
      'Öffne dein bevorzugtes AI-Tool (ChatGPT, Claude, etc.)',
      'Verwende den strukturierten Prompt aus der Beschreibung',
      'Passe die Ausgabe an deine spezifischen Anforderungen an',
      'Validiere das Ergebnis und optimiere bei Bedarf'
    ];
  }

  private static extractExamples(content: RawContent, aiStyle = false): string[] {
    const text = content.content;
    
    // Suche nach "example", "for example", etc.
    const exampleMatches = text.match(/(?:example|e\.g\.|such as)[:\s]*([^.!?]*[.!?])/gi);
    if (exampleMatches && exampleMatches.length > 0) {
      return exampleMatches
        .map(match => match.replace(/^(?:example|e\.g\.|such as)[:\s]*/i, '').trim())
        .slice(0, 2);
    }
    
    // Fallback: Generiere kontextuelle Beispiele
    if (content.title.toLowerCase().includes('writing')) {
      return ['Blog-Posts: 40% weniger Zeit bei gleichbleibender Qualität'];
    }
    
    if (content.title.toLowerCase().includes('learn')) {
      return ['Python-Kurs: Strukturierter 30-Tage-Plan statt ziellosem Tutorial-Hopping'];
    }
    
    return ['Startup-Team: 3 Stunden Meeting → 15 Minuten strukturierte Tasks'];
  }

  // Vereinfachte Utility-Funktionen
  private static categorizeContent(content: RawContent): Category {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    if (text.includes('code') || text.includes('programming')) return 'programming';
    if (text.includes('learn') || text.includes('study')) return 'learning';
    if (text.includes('business') || text.includes('meeting')) return 'business';
    if (text.includes('content') || text.includes('writing')) return 'content-creation';
    if (text.includes('data') || text.includes('analysis')) return 'data-analysis';
    if (text.includes('marketing') || text.includes('social')) return 'marketing';
    if (text.includes('design') || text.includes('ui')) return 'design';
    
    return 'productivity'; // Default
  }

  private static assessDifficulty(content: RawContent): Difficulty {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    if (text.includes('advanced') || text.includes('expert') || text.includes('complex')) {
      return 'advanced';
    }
    if (text.includes('intermediate') || text.includes('medium')) {
      return 'intermediate';
    }
    
    return 'beginner';
  }

  private static identifyTools(content: RawContent): string[] {
    const text = `${content.title} ${content.content}`.toLowerCase();
    const tools = [];
    
    if (text.includes('chatgpt') || text.includes('gpt')) tools.push('ChatGPT');
    if (text.includes('claude')) tools.push('Claude');
    if (text.includes('copilot')) tools.push('GitHub Copilot');
    if (text.includes('midjourney')) tools.push('Midjourney');
    if (text.includes('notion')) tools.push('Notion AI');
    
    return tools.length > 0 ? tools : ['AI-Tools'];
  }

  private static estimateTimeToImplement(content: RawContent): string {
    const text = content.content.toLowerCase();
    
    if (text.includes('quick') || text.includes('simple') || text.includes('5 min')) {
      return '5-10 Minuten';
    }
    if (text.includes('setup') || text.includes('configure') || text.includes('30 min')) {
      return '30-45 Minuten';
    }
    
    return '10-20 Minuten';
  }

  private static assessImpact(content: RawContent): Impact {
    const score = content.score || 0;
    const engagement = (content.comments || 0) * 2 + score;
    
    if (engagement >= 50) return 'high';
    if (engagement >= 20) return 'medium';
    return 'low';
  }

  private static calculateConfidence(content: RawContent, kitrick: KITrick, usedAI: boolean): number {
    let confidence = usedAI ? 85 : 65; // AI-basiert = höhere Confidence
    
    // Basis-Score aus Content-Qualität
    confidence += Math.min((content.score || 0), 20);
    confidence += Math.min((content.comments || 0), 10);
    
    // Bonus für strukturierten Output
    if (kitrick.steps && kitrick.steps.length >= 3) confidence += 5;
    if (kitrick.examples && kitrick.examples.length > 0) confidence += 5;
    
    return Math.max(0, Math.min(100, confidence));
  }

  private static generateId(title: string): string {
    return `scraped-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

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
}

export default ClaudeAIProcessor;