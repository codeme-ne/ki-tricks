import { ApifyClient } from 'apify-client';
import { KITrick, Category, Difficulty, Impact } from '../types/types';

// Lazy-initialized Apify Client (wird zur Laufzeit erstellt)
let apifyClient: ApifyClient | null = null;

function getApifyClient(): ApifyClient {
  if (!apifyClient) {
    const token = process.env.APIFY_API_TOKEN || '';
    console.log('🔑 Initialisiere Apify Client mit Token:', token ? `${token.substring(0, 10)}...` : 'FEHLT');
    apifyClient = new ApifyClient({ token });
  }
  return apifyClient;
}

// Scraping-Konfiguration für verschiedene Plattformen
export interface ScrapingConfig {
  platform: 'reddit' | 'twitter' | 'hackernews' | 'devto';
  actorId: string;
  inputParams: any;
  maxResults?: number;
}

// Standard-Konfigurationen für AI-Content
export const AI_SCRAPING_CONFIGS: ScrapingConfig[] = [
  {
    platform: 'reddit',
    actorId: 'trudax/reddit-scraper-lite',
    inputParams: {
      subreddits: ['OpenAI', 'MachineLearning', 'artificial', 'ChatGPT', 'LocalLLaMA'],
      maxPosts: 50,
      sort: 'hot',
      timeframe: 'week'
    },
    maxResults: 50
  },
  {
    platform: 'twitter',
    actorId: 'quacker/twitter-scraper',
    inputParams: {
      searchTerms: ['#AITips', '#ProductivityHacks', '#AIProductivity', '#ChatGPTTips'],
      maxTweets: 100,
      language: 'en'
    },
    maxResults: 100
  },
  {
    platform: 'hackernews',
    actorId: 'epctex/hackernews-scraper',
    inputParams: {
      searchTerms: ['AI', 'ChatGPT', 'productivity', 'automation'],
      maxItems: 30,
      sortBy: 'points'
    },
    maxResults: 30
  }
];

// Interface für rohe Scraping-Ergebnisse
export interface RawContent {
  platform: string;
  title: string;
  content: string;
  url: string;
  score?: number;
  comments?: number;
  author?: string;
  createdAt: string;
  tags?: string[];
}

// Haupt-Scraping-Klasse
export class ContentScraper {
  protected client: ApifyClient;

  constructor() {
    // Client wird lazy initialisiert beim ersten Aufruf
    this.client = getApifyClient();
  }

  // Scraping für eine bestimmte Plattform
  async scrapeContent(config: ScrapingConfig): Promise<RawContent[]> {
    try {
      console.log(`🔍 Scraping ${config.platform} mit Actor: ${config.actorId}`);
      console.log('🔑 Apify Token Status:', process.env.APIFY_API_TOKEN ? 'Gesetzt ✅' : 'Fehlt ❌');
      
      // Actor ausführen
      const run = await this.client.actor(config.actorId).call(config.inputParams);
      
      // Ergebnisse abrufen
      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
      
      // Ergebnisse in einheitliches Format konvertieren
      const rawContent = this.normalizeContent(items, config.platform);
      
      console.log(`✅ ${rawContent.length} Inhalte von ${config.platform} gescraped`);
      return rawContent.slice(0, config.maxResults);
      
    } catch (error) {
      console.error(`❌ Fehler beim Scraping von ${config.platform}:`, error);
      console.error(`🔍 Actor ID: ${config.actorId}`);
      console.error(`🔍 Input Parameters:`, JSON.stringify(config.inputParams, null, 2));
      console.error(`🔍 Error Details:`, error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  // Alle konfigurierten Plattformen scrapen
  async scrapeAllPlatforms(): Promise<RawContent[]> {
    const allContent: RawContent[] = [];
    
    for (const config of AI_SCRAPING_CONFIGS) {
      const content = await this.scrapeContent(config);
      allContent.push(...content);
      
      // Pause zwischen Scraping-Läufen um Rate Limits zu vermeiden
      await this.delay(2000);
    }
    
    return allContent;
  }

  // Plattform-spezifische Daten normalisieren
  private normalizeContent(items: any[], platform: string): RawContent[] {
    return items.map(item => {
      switch (platform) {
        case 'reddit':
          return {
            platform,
            title: item.title || '',
            content: item.selftext || item.body || '',
            url: item.url || `https://reddit.com${item.permalink}`,
            score: item.score || 0,
            comments: item.num_comments || 0,
            author: item.author,
            createdAt: new Date(item.created_utc * 1000).toISOString(),
            tags: item.subreddit ? [item.subreddit] : []
          };
          
        case 'twitter':
          return {
            platform,
            title: item.text?.substring(0, 100) || '',
            content: item.text || '',
            url: item.url || '',
            score: item.favorite_count || 0,
            comments: item.reply_count || 0,
            author: item.user?.screen_name,
            createdAt: item.created_at,
            tags: item.hashtags || []
          };
          
        case 'hackernews':
          return {
            platform,
            title: item.title || '',
            content: item.text || '',
            url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            score: item.score || 0,
            comments: item.descendants || 0,
            author: item.by,
            createdAt: new Date(item.time * 1000).toISOString(),
            tags: []
          };
          
        default:
          return {
            platform,
            title: item.title || '',
            content: item.content || item.text || '',
            url: item.url || '',
            score: 0,
            comments: 0,
            author: item.author,
            createdAt: item.createdAt || new Date().toISOString(),
            tags: []
          };
      }
    });
  }

  // Hilfsfunktion für Verzögerungen
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Content-Filter und -Bewertung
export class ContentProcessor {
  // Prüft ob der Inhalt relevant für KI-Tricks ist
  static isRelevantContent(content: RawContent): boolean {
    const relevantKeywords = [
      'AI', 'artificial intelligence', 'ChatGPT', 'GPT', 'Claude', 'LLM',
      'productivity', 'automation', 'prompt', 'tip', 'trick', 'hack',
      'workflow', 'efficiency', 'tool', 'technique'
    ];
    
    const text = `${content.title} ${content.content}`.toLowerCase();
    return relevantKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  // Bewertung der Content-Qualität
  static scoreContent(content: RawContent): number {
    let score = 0;
    
    // Basis-Score basierend auf Engagement
    score += Math.min(content.score || 0, 100) * 0.5;
    score += Math.min(content.comments || 0, 50) * 0.3;
    
    // Bonus für Länge (aber nicht zu lang)
    const contentLength = content.content.length;
    if (contentLength > 100 && contentLength < 2000) score += 20;
    
    // Bonus für strukturierten Content
    if (content.content.includes('step') || content.content.includes('tip')) score += 15;
    
    // Malus für sehr kurzen Content
    if (contentLength < 50) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  // Automatische Kategorisierung
  static categorizeContent(content: RawContent): Category {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    if (text.includes('code') || text.includes('programming') || text.includes('development')) {
      return 'programming';
    }
    if (text.includes('productivity') || text.includes('workflow') || text.includes('efficiency')) {
      return 'productivity';
    }
    if (text.includes('learn') || text.includes('study') || text.includes('education')) {
      return 'learning';
    }
    if (text.includes('business') || text.includes('enterprise') || text.includes('company')) {
      return 'business';
    }
    if (text.includes('content') || text.includes('writing') || text.includes('creative')) {
      return 'content-creation';
    }
    if (text.includes('data') || text.includes('analysis') || text.includes('analytics')) {
      return 'data-analysis';
    }
    if (text.includes('marketing') || text.includes('social media') || text.includes('advertisement')) {
      return 'marketing';
    }
    if (text.includes('design') || text.includes('ui') || text.includes('ux')) {
      return 'design';
    }
    
    return 'productivity'; // Default
  }

  // Schwierigkeit einschätzen
  static assessDifficulty(content: RawContent): Difficulty {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    if (text.includes('advanced') || text.includes('expert') || text.includes('complex')) {
      return 'advanced';
    }
    if (text.includes('intermediate') || text.includes('medium')) {
      return 'intermediate';
    }
    
    return 'beginner'; // Default für die meisten AI-Tricks
  }

  // Impact einschätzen
  static assessImpact(content: RawContent): Impact {
    const score = this.scoreContent(content);
    
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}

export default ContentScraper;