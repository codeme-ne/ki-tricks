import { ContentScraper, RawContent } from './content-scraper';
import { getBalancedKeywords, getKeywordStats } from './scraping-keywords';

// Reddit-spezifische Konfiguration für AI-Subreddits
export interface RedditScrapingParams {
  subreddits: string[];
  sort: 'hot' | 'new' | 'top' | 'rising';
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  maxPosts: number;
  minScore?: number;
  minComments?: number;
}

// AI-relevante Subreddits mit ihren Schwerpunkten
export const AI_SUBREDDITS = {
  // Hauptkategorien
  'OpenAI': { focus: 'ChatGPT und OpenAI Tools', category: 'productivity' },
  'ChatGPT': { focus: 'ChatGPT Tipps und Tricks', category: 'productivity' },
  'artificial': { focus: 'Allgemeine AI Diskussionen', category: 'learning' },
  'MachineLearning': { focus: 'Technische ML Inhalte', category: 'programming' },
  
  // Spezielle AI-Tools
  'ClaudeAI': { focus: 'Claude-spezifische Tipps', category: 'productivity' },
  'LocalLLaMA': { focus: 'Lokale AI-Modelle', category: 'programming' },
  'StableDiffusion': { focus: 'AI-Bildgenerierung', category: 'content-creation' },
  
  // Produktivität & Business
  'productivity': { focus: 'Produktivitäts-Hacks', category: 'productivity' },
  'Entrepreneur': { focus: 'AI im Business', category: 'business' },
  'marketing': { focus: 'AI-Marketing', category: 'marketing' },
  
  // Entwicklung
  'programming': { focus: 'AI-unterstützte Programmierung', category: 'programming' },
  'webdev': { focus: 'AI für Web-Entwicklung', category: 'programming' },
  
  // Datenanalyse
  'datascience': { focus: 'AI in Data Science', category: 'data-analysis' },
  'analytics': { focus: 'AI-Analytics', category: 'data-analysis' }
};

export class RedditScraper extends ContentScraper {
  
  // Reddit-spezifisches Scraping mit erweiterten Parametern
  async scrapeAISubreddits(params?: Partial<RedditScrapingParams>): Promise<RawContent[]> {
    const defaultParams: RedditScrapingParams = {
      subreddits: Object.keys(AI_SUBREDDITS),
      sort: 'hot',
      timeframe: 'month',
      maxPosts: 20,
      minScore: 3,    // Gelockert von 5 auf 3 für diversifizierte Keywords
      minComments: 1, // Gelockert von 2 auf 1 für breiteren Content
      ...params
    };

    console.log(`🔍 Scraping Reddit - ${defaultParams.subreddits.length} Subreddits`);
    console.log(`📊 Parameter: ${defaultParams.sort}, ${defaultParams.timeframe}, max ${defaultParams.maxPosts} posts`);

    try {
      console.log('🎯 Starte Reddit Scraper Actor: trudax/reddit-scraper-lite');
      
      // Dynamische Keyword-Auswahl für thematische Vielfalt
      const dynamicKeywords = getBalancedKeywords(5);
      const keywordStats = getKeywordStats();
      
      console.log(`🔀 Dynamische Keywords ausgewählt aus ${keywordStats.totalKeywords} verfügbaren:`);
      dynamicKeywords.forEach((keyword, index) => {
        console.log(`   ${index + 1}. ${keyword}`);
      });
      
      const inputConfig = {
        searches: dynamicKeywords,
        searchPosts: true,
        searchComments: false,
        sort: 'top',
        time: 'month',
        includeNSFW: false,
        maxItems: 50,
        maxPostCount: 25,
        proxy: {
          useApifyProxy: true,
          apifyProxyGroups: ["RESIDENTIAL"]
        },
        debugMode: true
      };

      console.log('🔧 Aktualisierte Actor Input:', inputConfig);

      const run = await this.client.actor('trudax/reddit-scraper-lite').call(inputConfig);

      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
      
      console.log(`📊 Apify Actor Response: ${items.length} rohe Items erhalten`);
      if (items.length > 0) {
        console.log(`🔍 Erstes Item Beispiel:`, JSON.stringify(items[0], null, 2));
      } else {
        console.log(`⚠️ Keine Items vom Apify Actor erhalten`);
        console.log(`🔧 Run Info:`, { runId: run.id, status: run.status, datasetId: run.defaultDatasetId });
      }
      
      // Filtere und normalisiere die Ergebnisse
      const rawContent = this.normalizeRedditContent(items);
      console.log(`📝 Nach Normalisierung: ${rawContent.length} Items`);
      
      const filteredContent = this.filterQualityContent(rawContent, defaultParams);
      console.log(`✅ Nach Qualitätsfilter: ${filteredContent.length} qualitative Reddit-Posts gefunden`);
      return filteredContent;
      
    } catch (error) {
      console.error('❌ Fehler beim Reddit-Scraping:', error);
      console.error('🔍 Actor: trudax/reddit-scraper-lite');
      console.error('🔍 Error Type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('🔍 Error Message:', error instanceof Error ? error.message : String(error));
      
      // Detailliertes Error-Object ausgeben falls verfügbar
      if (error && typeof error === 'object' && 'statusCode' in error) {
        console.error('🔍 HTTP Status:', (error as any).statusCode);
      }
      
      return [];
    }
  }

  // Erweiterte Reddit-spezifische Normalisierung
  private normalizeRedditContent(items: any[]): RawContent[] {
    return items.map(item => {
      console.log(`🔍 Normalisiere Item: "${item.title?.substring(0, 40)}..." - Votes: ${item.upVotes}, Comments: ${item.numberOfComments}`);
      
      return {
        platform: 'reddit',
        title: item.title || '',
        content: this.extractBestContent(item),
        url: item.url || item.link || 'https://reddit.com',
        score: item.upVotes || item.score || 0, // Apify verwendet upVotes
        comments: item.numberOfComments || item.num_comments || 0, // Apify verwendet numberOfComments
        author: item.username || item.author || 'unknown', // Apify verwendet username
        createdAt: item.createdAt || new Date().toISOString(),
        tags: [
          item.parsedCommunityName || item.subreddit,
          ...(item.flair ? [item.flair] : []),
          ...(this.extractHashtags(item.title + ' ' + (item.body || item.selftext || '')))
        ].filter(Boolean)
      };
    });
  }

  // Extrahiere den besten Content aus Post + Top-Comments
  private extractBestContent(item: any): string {
    let content = item.body || item.selftext || '';
    
    // Füge wertvollen Content aus Top-Comments hinzu
    if (item.comments && item.comments.length > 0) {
      const topComments = item.comments
        .filter((comment: any) => comment.score > 5 && comment.body.length > 50)
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 3);
      
      if (topComments.length > 0) {
        content += '\n\n**Top-Community-Tipps:**\n';
        topComments.forEach((comment: any, index: number) => {
          content += `\n${index + 1}. ${comment.body.substring(0, 200)}...`;
        });
      }
    }
    
    return content;
  }

  // Qualitätsfilterung für Reddit-Content
  private filterQualityContent(content: RawContent[], params: RedditScrapingParams): RawContent[] {
    console.log(`🔍 Filtere ${content.length} Items mit Kriterien: Score >= ${params.minScore || 3}, Comments >= ${params.minComments || 1}`);
    
    const filtered = content.filter(item => {
      // Gelockerte Basis-Qualitätskriterien für Apify-Daten
      const minScore = params.minScore || 3; // Reduziert von 5 auf 3
      const minComments = params.minComments || 1; // Reduziert von 2 auf 1
      
      console.log(`   📊 "${item.title.substring(0, 30)}..." - Score: ${item.score}, Comments: ${item.comments}, Length: ${item.content.length}`);
      
      if (!item.score || item.score < minScore) {
        console.log(`      ❌ Score zu niedrig: ${item.score} < ${minScore}`);
        return false;
      }
      
      if (!item.comments || item.comments < minComments) {
        console.log(`      ❌ Comments zu wenig: ${item.comments} < ${minComments}`);
        return false;
      }
      
      // Gelockerte Content-Länge für Image-Posts
      const minLength = item.content.includes('image') || item.content.includes('imgur') ? 10 : 30;
      if (item.content.length < minLength) {
        console.log(`      ❌ Content zu kurz: ${item.content.length} < ${minLength}`);
        return false;
      }
      
      // AI-Relevanz prüfen
      if (!this.isAIRelevant(item)) {
        console.log(`      ❌ Nicht AI-relevant`);
        return false;
      }
      
      // Spam und Low-Quality Content ausfiltern
      if (this.isSpamOrLowQuality(item)) {
        console.log(`      ❌ Spam/Low-Quality erkannt`);
        return false;
      }
      
      console.log(`      ✅ Qualitätscheck bestanden`);
      return true;
    }).sort((a, b) => (b.score || 0) - (a.score || 0)); // Nach Score sortieren
    
    console.log(`✅ ${filtered.length} Items nach Qualitätsfilter übrig`);
    return filtered;
  }

  // Prüft AI-Relevanz spezifisch für Reddit
  private isAIRelevant(content: RawContent): boolean {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    const aiKeywords = [
      'ai', 'artificial intelligence', 'chatgpt', 'gpt', 'claude', 'llm',
      'prompt', 'automation', 'machine learning', 'deep learning',
      'neural network', 'transformer', 'openai', 'anthropic'
    ];
    
    const productivityKeywords = [
      'productivity', 'workflow', 'efficiency', 'hack', 'tip', 'trick',
      'automation', 'tool', 'technique', 'method', 'strategy'
    ];
    
    const hasAI = aiKeywords.some(keyword => text.includes(keyword));
    const hasProductivity = productivityKeywords.some(keyword => text.includes(keyword));
    
    return hasAI || (hasProductivity && text.length > 100);
  }

  // Spam und Low-Quality Detection
  private isSpamOrLowQuality(content: RawContent): boolean {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    // Spam-Indikatoren
    const spamIndicators = [
      'buy now', 'click here', 'limited time', 'act now',
      'make money fast', 'get rich', 'free money',
      'affiliate', 'referral code', 'discount code'
    ];
    
    // Low-Quality Indikatoren
    const lowQualityIndicators = [
      'help me', 'what should i do', 'how do i',
      'eli5', 'noob question', 'beginner here'
    ];
    
    const hasSpam = spamIndicators.some(indicator => text.includes(indicator));
    const isLowQuality = lowQualityIndicators.some(indicator => text.includes(indicator)) && content.content.length < 200;
    
    return hasSpam || isLowQuality;
  }

  // Hashtags aus Text extrahieren
  private extractHashtags(text: string): string[] {
    const hashtags = text.match(/#\w+/g) || [];
    return hashtags.map(tag => tag.toLowerCase());
  }

  // Erstelle Reddit Start-URLs aus Subreddit-Namen
  private buildRedditStartUrls(subreddits: string[]): Array<{url: string, method: string}> {
    return subreddits.map(subreddit => ({
      url: `https://www.reddit.com/r/${subreddit}/hot/`,
      method: "GET"
    }));
  }

  // Spezielle Subreddit-Analyse für bessere Kategorisierung
  async analyzeSubredditTrends(subreddit: string, days: number = 7): Promise<{
    topKeywords: string[];
    averageScore: number;
    postCount: number;
    trendingTopics: string[];
  }> {
    const content = await this.scrapeAISubreddits({
      subreddits: [subreddit],
      timeframe: 'week',
      maxPosts: 100,
      sort: 'hot'
    });

    const keywords = new Map<string, number>();
    let totalScore = 0;

    content.forEach(item => {
      totalScore += item.score || 0;
      
      // Keyword-Extraktion
      const words = `${item.title} ${item.content}`.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3 && !['this', 'that', 'with', 'have', 'been'].includes(word));
      
      words.forEach(word => {
        keywords.set(word, (keywords.get(word) || 0) + 1);
      });
    });

    const topKeywords = Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    return {
      topKeywords,
      averageScore: content.length > 0 ? totalScore / content.length : 0,
      postCount: content.length,
      trendingTopics: topKeywords.slice(0, 5)
    };
  }
}

export default RedditScraper;