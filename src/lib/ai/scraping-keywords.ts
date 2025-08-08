/**
 * Eine umfassende, kategorisierte Liste von Long-Tail-Keywords für das Scrapen von KI-Tricks.
 * Diese Liste ist auf hohe Relevanz und thematische Vielfalt ausgelegt.
 * Die Anführungszeichen sind beabsichtigt, um nach exakten Phrasen zu suchen, was die Qualität der Ergebnisse drastisch erhöht.
 */
export const scrapingKeywords = {
  // Keywords, die sich auf die Steigerung der persönlichen oder beruflichen Effizienz konzentrieren
  productivity: [
    '"AI productivity hack"',
    '"automate tasks with AI"',
    '"AI workflow automation"',
    '"AI for meeting summaries"',
    '"automate email with AI"',
    '"AI time management tools"',
    '"getting things done with AI"',
    '"AI for project management"',
    '"Notion AI workflow"',
    '"AI personal assistant"'
  ],

  // Keywords für Entwickler, Coder und technisch versierte Anwender
  programming: [
    '"ChatGPT tips for developers"',
    '"Claude coding tricks"',
    '"AI code generation prompt"',
    '"GitHub Copilot best practices"',
    '"AI for debugging code"',
    '"generate unit tests with AI"',
    '"refactor code with AI"',
    '"AI for code review"',
    '"explain code with AI"',
    '"build apps faster with AI"'
  ],

  // Keywords rund um das Erstellen von Texten, Bildern, Videos und Musik
  contentCreation: [
    '"AI for content creation"',
    '"write blog post with AI"',
    '"AI video script generator"',
    '"best AI image prompts"',
    '"Midjourney prompt guide"',
    '"AI for copywriting"',
    '"generate social media content with AI"',
    '"AI storytelling techniques"',
    '"AI music generation"',
    '"AI voice over tools"'
  ],

  // Keywords für den Einsatz von KI in Unternehmen, Startups und im Management
  business: [
    '"AI in business workflow"',
    '"using AI for market research"',
    '"AI sales assistant"',
    '"create presentations with AI"',
    '"AI for business strategy"',
    '"customer service automation AI"',
    '"AI for financial analysis"',
    '"automating business processes with AI"',
    '"AI for lead generation"',
    '"strategic planning with AI"'
  ],

  // Keywords für Schüler, Studenten und lebenslanges Lernen
  learning: [
    '"learn faster with AI"',
    '"AI study buddy"',
    '"summarize pdf with AI"',
    '"AI for language learning"',
    '"explain complex topics with AI"',
    '"AI flashcard generator"',
    '"create a learning plan with AI"',
    '"AI research assistant"',
    '"AI for exam preparation"',
    '"Socratic learning with AI"'
  ],

  // Keywords für den Umgang mit Daten, Tabellen und Analysen
  dataAnalysis: [
    '"data analysis with ChatGPT"',
    '"AI for excel spreadsheets"',
    '"AI data visualization"',
    '"write SQL query with AI"',
    '"interpret data with AI"',
    '"AI for data cleaning"',
    '"predictive analysis with AI"',
    '"automating reports with AI"',
    '"AI in Google Sheets"',
    '"data science tricks with AI"'
  ],

  // Keywords für Marketing, SEO und Social Media Management
  marketing: [
    '"AI for marketing strategy"',
    '"SEO content with AI"',
    '"AI email marketing campaigns"',
    '"generate ad copy with AI"',
    '"social media management with AI"',
    '"AI for competitor analysis"',
    '"content calendar with AI"',
    '"A/B testing ideas with AI"',
    '"customer segmentation AI"',
    '"analyze marketing data with AI"'
  ],

  // Keywords für Designer und Kreative im visuellen Bereich
  design: [
    '"AI design tools"',
    '"generate UI mockups with AI"',
    '"AI logo generator"',
    '"AI color palette generator"',
    '"create mood boards with AI"',
    '"AI for UX design"',
    '"image editing with AI"',
    '"AI presentation design"',
    '"generative art with AI"',
    '"website design with AI"'
  ],

  // Keywords, die sich auf spezifische, populäre KI-Tools konzentrieren
  specificTools: [
    '"best claude 3 prompts"',
    '"advanced ChatGPT techniques"',
    '"Midjourney v6 tips"',
    '"creative uses for Perplexity AI"',
    '"automating with Zapier AI"',
    '"hidden features of Gemini AI"',
    '"Gamma app for presentations"',
    '"Cool things to do with DALL-E 3"',
    '"mastering Suno AI music"',
    '"HeyGen AI video tips"'
  ],

  // Allgemeine, hochfrequentierte Keywords, die oft gute Tricks liefern
  general: [
    '"underrated AI tools"',
    '"AI tips and tricks"',
    '"creative ways to use AI"',
    '"AI tools you haven\'t tried"',
    '"AI life hacks"',
    '"free AI tools to try"',
    '"AI secrets and tricks"',
    '"most useful AI prompts"',
    '"game-changing AI workflow"',
    '"AI tools that feel illegal to know"'
  ]
};

/**
 * Hilfsfunktionen für die dynamische Keyword-Auswahl
 */

// Wählt zufällige Keywords aus allen Kategorien
export function getRandomKeywords(count: number): string[] {
  const allKeywords = Object.values(scrapingKeywords).flat();
  const shuffled = allKeywords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Wählt Keywords aus spezifischen Kategorien
export function getKeywordsByCategory(categories: (keyof typeof scrapingKeywords)[], countPerCategory: number = 1): string[] {
  const selectedKeywords: string[] = [];
  
  categories.forEach(category => {
    const categoryKeywords = scrapingKeywords[category];
    const shuffled = categoryKeywords.sort(() => 0.5 - Math.random());
    selectedKeywords.push(...shuffled.slice(0, countPerCategory));
  });
  
  return selectedKeywords;
}

// Wählt eine ausgewogene Mischung aus verschiedenen Kategorien
export function getBalancedKeywords(totalCount: number): string[] {
  const categories = Object.keys(scrapingKeywords) as (keyof typeof scrapingKeywords)[];
  const keywordsPerCategory = Math.ceil(totalCount / categories.length);
  
  const selectedKeywords: string[] = [];
  
  categories.forEach(category => {
    const categoryKeywords = scrapingKeywords[category];
    const shuffled = categoryKeywords.sort(() => 0.5 - Math.random());
    selectedKeywords.push(...shuffled.slice(0, keywordsPerCategory));
  });
  
  // Falls wir zu viele haben, zufällig reduzieren
  if (selectedKeywords.length > totalCount) {
    const shuffled = selectedKeywords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, totalCount);
  }
  
  return selectedKeywords;
}

// Statistiken über die Keyword-Sammlung
export function getKeywordStats() {
  const stats = {
    totalKeywords: 0,
    categoryCounts: {} as Record<string, number>
  };
  
  Object.entries(scrapingKeywords).forEach(([category, keywords]) => {
    stats.categoryCounts[category] = keywords.length;
    stats.totalKeywords += keywords.length;
  });
  
  return stats;
}