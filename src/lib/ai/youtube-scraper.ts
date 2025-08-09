import { ContentScraper, RawContent } from './content-scraper';
import { getBalancedKeywords, getKeywordStats } from './scraping-keywords';

// YouTube-spezifische Konfiguration für AI-Channels
export interface YouTubeScrapingParams {
  channels?: string[];
  searchQueries?: string[];
  sortVideosBy: 'POPULAR' | 'NEWEST' | 'OLDEST';
  maxResults: number;
  downloadSubtitles: boolean;
  subtitlesLanguage: string;
  subtitlesFormat: 'srt' | 'vtt' | 'xml' | 'plaintext';
  hasSubtitles: boolean;
  lengthFilter?: string; // e.g., "between420" for 4-20 minutes
  minViews?: number;
  minLikes?: number;
}

// AI-relevante YouTube-Channels mit ihren Schwerpunkten
export const AI_YOUTUBE_CHANNELS = {
  // Hauptkategorien - AI/Productivity
  '@AIExplained-official': { focus: 'AI News und Erkl├ñrungen', category: 'learning' },
  '@TwoMinutePapers': { focus: 'AI Research Papers', category: 'learning' },
  '@OpenAI': { focus: 'OpenAI Updates und Features', category: 'productivity' },
  '@AnthropicAI': { focus: 'Claude und AI Safety', category: 'productivity' },
  
  // Produktivit├ñt & Tools
  '@AliAbdaal': { focus: 'Productivity Hacks', category: 'productivity' },
  '@ThomasFrankExplains': { focus: 'Study und Productivity Tips', category: 'productivity' },
  '@SkillsFactory': { focus: 'Praktische AI Tools', category: 'productivity' },
  '@MattWolfe': { focus: 'AI Tools und Reviews', category: 'productivity' },
  
  // Programming & Development
  '@CodeBullet': { focus: 'AI Programming Projects', category: 'programming' },
  '@3Blue1Brown': { focus: 'Math und AI Konzepte', category: 'programming' },
  '@TechWithTim': { focus: 'AI Programming Tutorials', category: 'programming' },
  '@Fireship': { focus: 'Modern Development mit AI', category: 'programming' },
  
  // Business & Marketing
  '@GaryVee': { focus: 'AI im Business', category: 'business' },
  '@NeilPatel': { focus: 'AI Marketing Strategies', category: 'marketing' },
  '@hubspot': { focus: 'AI Sales und Marketing', category: 'marketing' },
  
  // Content Creation
  '@MrBeast': { focus: 'AI Content Strategies', category: 'content-creation' },
  '@MKBHD': { focus: 'AI Tools Reviews', category: 'content-creation' },
  '@MattGielen': { focus: 'YouTube AI Optimization', category: 'content-creation' },
  
  // Data & Analytics
  '@KenJee1': { focus: 'Data Science mit AI', category: 'data-analysis' },
  '@TinaHuang1': { focus: 'Data Career mit AI', category: 'data-analysis' },
  '@StatQuestWithJoshStarmer': { focus: 'Statistics mit AI', category: 'data-analysis' }
};

// YouTube-spezifische Datenstrukturen
export interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  channelName: string;
  channelUrl: string;
  url: string;
  publishedDate: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  subtitles?: Array<{
    text: string;
    start: number;
    duration: number;
  }>;
  subtitlesText?: string;
  tags: string[];
  categoryId: string;
}

export class YouTubeScraper extends ContentScraper {
  
  // YouTube-spezifisches Scraping mit erweiterten Parametern
  async scrapeAIChannels(params?: Partial<YouTubeScrapingParams>): Promise<RawContent[]> {
    const defaultParams: YouTubeScrapingParams = {
      channels: Object.keys(AI_YOUTUBE_CHANNELS),
      sortVideosBy: 'POPULAR',
      maxResults: 15,
      downloadSubtitles: true,
      subtitlesLanguage: 'en',
      subtitlesFormat: 'plaintext',
      hasSubtitles: true,
      lengthFilter: 'between420', // 4-20 minutes
      minViews: 10000,
      minLikes: 100,
      ...params
    };

    console.log(`🔍 Scraping YouTube - ${defaultParams.channels?.length || 0} Channels`);
    console.log(`📊 Parameter: ${defaultParams.sortVideosBy}, max ${defaultParams.maxResults} videos, subtitles: ${defaultParams.downloadSubtitles}`);

    try {
      console.log('🎯 Starte YouTube Scraper Actor: trudax/youtube-scraper');
      
      // Dynamische Keyword-Auswahl f├╝r thematische Vielfalt
      const dynamicKeywords = getBalancedKeywords(8);
      const keywordStats = getKeywordStats();
      
      console.log(`🔀 Dynamische Keywords ausgew├ñhlt aus ${keywordStats.totalKeywords} verf├╝gbaren:`);
      dynamicKeywords.forEach((keyword, index) => {
        console.log(`   ${index + 1}. ${keyword}`);
      });

      // Konfiguration f├╝r YouTube Actor
      const inputConfig = {
        startUrls: this.buildYouTubeStartUrls(defaultParams.channels || []),
        searchQueries: dynamicKeywords,
        maxResults: defaultParams.maxResults,
        sortVideosBy: defaultParams.sortVideosBy,
        downloadSubtitles: defaultParams.downloadSubtitles,
        subtitlesLanguage: defaultParams.subtitlesLanguage,
        subtitlesFormat: defaultParams.subtitlesFormat,
        hasSubtitles: defaultParams.hasSubtitles,
        lengthFilter: defaultParams.lengthFilter,
        proxy: {
          useApifyProxy: true,
          apifyProxyGroups: ["RESIDENTIAL"]
        },
        debugMode: true
      };

      console.log('🔧 YouTube Actor Input:', inputConfig);

      const run = await this.client.actor('trudax/youtube-scraper').call(inputConfig);
      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
      
      console.log(`📊 Apify Actor Response: ${items.length} rohe Videos erhalten`);
      if (items.length > 0) {
        console.log(`🔍 Erstes Video Beispiel:`, JSON.stringify(items[0], null, 2));
      } else {
        console.log(`⚠️ Keine Videos vom Apify Actor erhalten`);
        console.log(`🔧 Run Info:`, { runId: run.id, status: run.status, datasetId: run.defaultDatasetId });
      }
      
      // Filtere und normalisiere die Ergebnisse
      const rawContent = this.normalizeYouTubeContent(items);
      console.log(`📝 Nach Normalisierung: ${rawContent.length} Videos`);
      
      const filteredContent = this.filterQualityContent(rawContent, defaultParams);
      console.log(`✅ Nach Qualit├ñtsfilter: ${filteredContent.length} qualitative YouTube-Videos gefunden`);
      return filteredContent;
      
    } catch (error) {
      console.error('❌ Fehler beim YouTube-Scraping:', error);
      console.error('🔍 Actor: trudax/youtube-scraper');
      console.error('🔍 Error Type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('🔍 Error Message:', error instanceof Error ? error.message : String(error));
      
      // Detailliertes Error-Object ausgeben falls verf├╝gbar
      if (error && typeof error === 'object' && 'statusCode' in error) {
        console.error('🔍 HTTP Status:', (error as any).statusCode);
      }
      
      return [];
    }
  }

  // Erweiterte YouTube-spezifische Normalisierung
  private normalizeYouTubeContent(items: any[]): RawContent[] {
    return items.map(item => {
      console.log(`🔍 Normalisiere Video: "${item.title?.substring(0, 40)}..." - Views: ${item.viewCount}, Likes: ${item.likeCount}`);
      
      return {
        platform: 'youtube',
        title: item.title || '',
        content: this.extractBestContent(item),
        url: item.url || `https://youtube.com/watch?v=${item.id}`,
        score: item.likeCount || 0,
        comments: item.commentCount || 0,
        author: item.channelName || item.channelTitle || 'unknown',
        createdAt: item.publishedDate || item.publishedAt || new Date().toISOString(),
        tags: [
          item.channelName,
          ...(item.tags || []),
          ...(this.extractHashtags(item.title + ' ' + (item.description || '')))
        ].filter(Boolean)
      };
    });
  }

  // Extrahiere den besten Content aus Video-Details + Untertiteln
  private extractBestContent(item: any): string {
    let content = item.description || '';
    
    // F├╝ge Untertitel als wertvollen Content hinzu
    if (item.subtitles && Array.isArray(item.subtitles) && item.subtitles.length > 0) {
      // Verwende die ersten 1000 Zeichen der Untertitel
      const subtitleText = item.subtitles.map((sub: any) => sub.text).join(' ').substring(0, 1000);
      content += '\n\n**Video-Transkript (Auszug):**\n' + subtitleText;
    } else if (item.subtitlesText) {
      // Fallback f├╝r andere Untertitel-Formate
      content += '\n\n**Video-Transkript (Auszug):**\n' + item.subtitlesText.substring(0, 1000);
    }
    
    // F├╝ge Video-Metadaten hinzu
    if (item.duration) {
      content += `\n\n**Video-L├ñnge:** ${item.duration}`;
    }
    
    if (item.viewCount) {
      content += `\n**Views:** ${item.viewCount.toLocaleString()}`;
    }
    
    return content;
  }

  // Qualit├ñtsfilterung f├╝r YouTube-Content
  private filterQualityContent(content: RawContent[], params: YouTubeScrapingParams): RawContent[] {
    console.log(`🔍 Filtere ${content.length} Videos mit Kriterien: Views >= ${params.minViews || 10000}, Likes >= ${params.minLikes || 100}`);
    
    const filtered = content.filter(item => {
      const minViews = params.minViews || 10000;
      const minLikes = params.minLikes || 100;
      
      console.log(`   📊 "${item.title.substring(0, 30)}..." - Views: ${item.score}, Likes: ${item.score}, Content Length: ${item.content.length}`);
      
      // Views-Check (verwendet score als Views-Proxy)
      const viewCount = this.extractViewCount(item.content);
      if (viewCount && viewCount < minViews) {
        console.log(`      ❌ Views zu niedrig: ${viewCount} < ${minViews}`);
        return false;
      }
      
      // Likes-Check
      if (!item.score || item.score < minLikes) {
        console.log(`      ❌ Likes zu niedrig: ${item.score} < ${minLikes}`);
        return false;
      }
      
      // Content-L├ñnge pr├╝fen (Videos sollten substanziellen Content haben)
      if (item.content.length < 200) {
        console.log(`      ❌ Content zu kurz: ${item.content.length} < 200`);
        return false;
      }
      
      // AI-Relevanz pr├╝fen
      if (!this.isAIRelevant(item)) {
        console.log(`      ❌ Nicht AI-relevant`);
        return false;
      }
      
      // Spam und Low-Quality Content ausfiltern
      if (this.isSpamOrLowQuality(item)) {
        console.log(`      ❌ Spam/Low-Quality erkannt`);
        return false;
      }
      
      console.log(`      ✅ Qualit├ñtscheck bestanden`);
      return true;
    }).sort((a, b) => (b.score || 0) - (a.score || 0)); // Nach Likes sortieren
    
    console.log(`✅ ${filtered.length} Videos nach Qualit├ñtsfilter ├╝brig`);
    return filtered;
  }

  // Pr├╝ft AI-Relevanz spezifisch f├╝r YouTube
  private isAIRelevant(content: RawContent): boolean {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    const aiKeywords = [
      'ai', 'artificial intelligence', 'chatgpt', 'gpt', 'claude', 'llm',
      'prompt', 'automation', 'machine learning', 'deep learning',
      'neural network', 'transformer', 'openai', 'anthropic', 'midjourney',
      'stable diffusion', 'copilot', 'gemini'
    ];
    
    const productivityKeywords = [
      'productivity', 'workflow', 'efficiency', 'hack', 'tip', 'trick',
      'automation', 'tool', 'technique', 'method', 'strategy', 'tutorial',
      'guide', 'how to', 'best practices'
    ];
    
    const hasAI = aiKeywords.some(keyword => text.includes(keyword));
    const hasProductivity = productivityKeywords.some(keyword => text.includes(keyword));
    
    return hasAI || (hasProductivity && text.length > 300);
  }

  // Spam und Low-Quality Detection f├╝r YouTube
  private isSpamOrLowQuality(content: RawContent): boolean {
    const text = `${content.title} ${content.content}`.toLowerCase();
    
    // Spam-Indikatoren
    const spamIndicators = [
      'buy now', 'click here', 'limited time', 'act now',
      'make money fast', 'get rich quick', 'earn $$',
      'affiliate link', 'discount code', 'promo code',
      'subscribe and like', 'smash that like button'
    ];
    
    // Low-Quality Indikatoren
    const lowQualityIndicators = [
      'reaction video', 'reacting to', 'first time watching',
      'drama', 'exposed', 'clickbait', 'you won\'t believe',
      'shocking', 'gone wrong', 'prank'
    ];
    
    const hasSpam = spamIndicators.some(indicator => text.includes(indicator));
    const isLowQuality = lowQualityIndicators.some(indicator => text.includes(indicator));
    
    return hasSpam || isLowQuality;
  }

  // Hashtags aus Text extrahieren
  private extractHashtags(text: string): string[] {
    const hashtags = text.match(/#\w+/g) || [];
    return hashtags.map(tag => tag.toLowerCase());
  }

  // View-Count aus Content extrahieren
  private extractViewCount(content: string): number | null {
    const viewMatch = content.match(/views:\s*([0-9,]+)/i);
    if (viewMatch) {
      return parseInt(viewMatch[1].replace(/,/g, ''), 10);
    }
    return null;
  }

  // Erstelle YouTube Start-URLs aus Channel-Namen
  private buildYouTubeStartUrls(channels: string[]): Array<{url: string}> {
    return channels.map(channel => ({
      url: `https://www.youtube.com/${channel}/videos`
    }));
  }

  // Spezielle Channel-Analyse f├╝r bessere Kategorisierung
  async analyzeChannelTrends(channelName: string, maxVideos: number = 20): Promise<{
    topKeywords: string[];
    averageViews: number;
    videoCount: number;
    trendingTopics: string[];
    channelCategory: string;
  }> {
    const content = await this.scrapeAIChannels({
      channels: [channelName],
      maxResults: maxVideos,
      sortVideosBy: 'POPULAR'
    });

    const keywords = new Map<string, number>();
    let totalViews = 0;

    content.forEach(item => {
      // Views aus Content extrahieren
      const views = this.extractViewCount(item.content) || 0;
      totalViews += views;
      
      // Keyword-Extraktion
      const words = `${item.title} ${item.content}`.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 4 && !['this', 'that', 'with', 'have', 'been', 'video'].includes(word));
      
      words.forEach(word => {
        keywords.set(word, (keywords.get(word) || 0) + 1);
      });
    });

    const topKeywords = Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word);

    // Kategorie basierend auf Channel-Info bestimmen
    const channelInfo = AI_YOUTUBE_CHANNELS[channelName as keyof typeof AI_YOUTUBE_CHANNELS];
    const channelCategory = channelInfo?.category || 'productivity';

    return {
      topKeywords,
      averageViews: content.length > 0 ? totalViews / content.length : 0,
      videoCount: content.length,
      trendingTopics: topKeywords.slice(0, 8),
      channelCategory
    };
  }

  // Scrape spezifische YouTube-Suchbegriffe
  async scrapeYouTubeSearch(searchQueries: string[], maxResults: number = 10): Promise<RawContent[]> {
    console.log(`🔍 YouTube Search Scraping: ${searchQueries.join(', ')}`);
    
    return await this.scrapeAIChannels({
      searchQueries,
      maxResults,
      channels: [], // Nur Suche, keine spezifischen Channels
      sortVideosBy: 'POPULAR'
    });
  }
}

export default YouTubeScraper;