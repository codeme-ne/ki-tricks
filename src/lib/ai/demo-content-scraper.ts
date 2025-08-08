import { RawContent } from './content-scraper';

// Demo-Implementation für Content-Scraping ohne Apify-Kosten
// Dies simuliert echte Scraping-Ergebnisse mit hochwertigen AI-Tricks von Reddit

export const DEMO_REDDIT_CONTENT: RawContent[] = [
  {
    platform: 'reddit',
    title: 'LPT: Use ChatGPT to create personalized learning paths for any skill',
    content: `I discovered a game-changing way to use ChatGPT for learning. Instead of asking generic questions, I give it my background, goals, and time constraints, then ask it to create a detailed learning path.

Here's my template:
"I'm a [your background]. I want to learn [skill] to [specific goal]. I have [time available] per day/week. Create a detailed 4-week learning path with daily tasks, resources, and milestones."

The AI gives you a structured plan with:
- Day-by-day breakdown
- Specific resources (books, courses, practice exercises)
- Progress checkpoints
- Difficulty progression

Example: I wanted to learn Python for data analysis. ChatGPT created a 30-day plan with specific exercises, real datasets to practice with, and even suggested projects for my portfolio.

**Why it works so well:**
The AI considers your constraints and creates realistic, personalized schedules instead of generic advice.

**Pro tip:** Ask it to adjust the plan based on your progress each week.`,
    url: 'https://reddit.com/r/ChatGPT/comments/example1',
    score: 156,
    comments: 23,
    author: 'ProductivityHacker23',
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['ChatGPT', 'learning', 'productivity']
  },
  {
    platform: 'reddit',
    title: 'The prompt template that increased my AI writing quality by 300%',
    content: `After months of experimenting, I found the perfect prompt structure that consistently produces high-quality content:

"Act as a [specific role] writing for [target audience]. 
Topic: [your topic]
Tone: [professional/casual/friendly]
Goal: [what you want to achieve]
Length: [word count]
Key points to cover: [list 3-5 main points]
Avoid: [things to exclude]

Before writing, ask yourself:
1. What's the main value for the reader?
2. What examples would make this clearer?
3. What action should they take after reading?

Now write the content."

This template works because:
- It gives clear context and constraints
- Forces the AI to think about the reader's perspective  
- Includes self-reflection questions
- Specifies exactly what you want

I use this for blog posts, emails, social media, even technical documentation. The results are consistently better than generic prompts.

**Bonus tip:** Save variations as templates in a note-taking app for quick access.`,
    url: 'https://reddit.com/r/OpenAI/comments/example2',
    score: 234,
    comments: 45,
    author: 'AIWritingPro',
    createdAt: '2024-01-14T14:20:00Z',
    tags: ['OpenAI', 'writing', 'prompts', 'content-creation']
  },
  {
    platform: 'reddit',
    title: 'How I automated my entire research workflow with Claude + custom prompts',
    content: `I'm a grad student and was spending 10+ hours per week on research tasks. Now I do it in 2 hours using this Claude workflow:

**Step 1: Literature Discovery**
"I'm researching [topic]. Find 10 recent, credible sources. For each source, provide: title, key findings, methodology, and relevance score (1-10). Focus on peer-reviewed articles from the last 3 years."

**Step 2: Content Analysis**
"Analyze these sources for: common themes, contradictions, research gaps, and emerging trends. Create a synthesis matrix."

**Step 3: Citation Management**
"Generate APA citations for all sources and create a bibliography with annotations explaining each source's contribution to my research question."

**Step 4: Outline Creation**
"Based on this research, create a detailed outline for a [paper type] addressing [research question]. Include key arguments and supporting evidence for each section."

The time savings are incredible. What used to take me a full day now takes 2 hours, and the quality is often better because Claude spots connections I might miss.

**Key insight:** Chain multiple focused prompts instead of one massive request. Each step builds on the previous one.`,
    url: 'https://reddit.com/r/ClaudeAI/comments/example3',
    score: 189,
    comments: 31,
    author: 'ResearchNinja',
    createdAt: '2024-01-13T09:15:00Z',
    tags: ['Claude', 'research', 'automation', 'academic']
  },
  {
    platform: 'reddit',
    title: 'AI-powered email templates that get 40% more responses',
    content: `I tested AI-generated email templates against my old ones and saw a 40% increase in response rates. Here's the winning formula:

**Cold Outreach Template:**
"Write a cold email to [role] at [company type]. Goal: [specific goal]. 
Make it:
- Personal (reference something specific about them/company)
- Brief (under 100 words)
- Value-focused (what's in it for them)
- Clear call-to-action
- Professional but warm tone

Include: personalized opening, credibility statement, specific value proposition, simple ask, professional closing."

**Follow-up Template:**
"Create a follow-up email that: acknowledges they're busy, adds new value/insight, keeps it even shorter than original, maintains friendly persistence without being pushy."

The AI creates templates that I customize with specific details. Key improvements:
- Better subject lines (specific, curiosity-driven)
- Stronger value propositions
- More natural, conversational tone
- Perfect length (not too short, not too long)

I now get responses from people who previously never replied to my emails.`,
    url: 'https://reddit.com/r/artificial/comments/example4',
    score: 167,
    comments: 28,
    author: 'EmailMaster',
    createdAt: '2024-01-12T16:45:00Z',
    tags: ['artificial', 'email', 'business', 'marketing']
  },
  {
    platform: 'reddit',
    title: 'The 10-second prompt that debugs any code error',
    content: `As a developer, I waste too much time on debugging. This prompt changed everything:

"Here's my code and the error I'm getting:

[paste code]
[paste error message]

Please:
1. Explain what's causing this error in simple terms
2. Provide the corrected code
3. Explain why your solution works
4. Suggest how to prevent similar errors in the future"

This works better than Stack Overflow because:
- Immediate, personalized response
- Explains the 'why', not just the 'what'
- Teaches you to prevent future errors
- No need to search through multiple posts

I've used this for JavaScript, Python, SQL, CSS - works with any language. The AI often spots issues I completely missed and explains concepts I didn't understand.

**Pro tip:** Follow up with "Are there any edge cases I should consider?" to make your code more robust.

**Time saved:** Went from 30+ minutes per bug to under 5 minutes.`,
    url: 'https://reddit.com/r/programming/comments/example5',
    score: 342,
    comments: 67,
    author: 'DebugMaster',
    createdAt: '2024-01-11T11:30:00Z',
    tags: ['programming', 'debugging', 'development']
  },
  {
    platform: 'reddit',
    title: 'I use AI to turn any meeting into actionable tasks automatically',
    content: `Meetings used to be productivity killers. Now I use this AI workflow to extract maximum value:

**During the meeting:**
Record audio (with permission) or take rough notes

**After the meeting:**
"Analyze this meeting transcript/notes and create:

1. Executive Summary (2-3 sentences)
2. Key Decisions Made
3. Action Items with:
   - Specific task description
   - Person responsible
   - Deadline/timeline
   - Priority level (High/Medium/Low)
4. Follow-up Questions/Concerns
5. Next Steps
6. Items for Next Meeting Agenda

Format as a professional meeting summary that can be shared with attendees."

**Results:**
- 100% follow-through on action items (vs ~40% before)
- Clear accountability and deadlines
- No more "what did we decide?" confusion
- Professional documentation for future reference

**Bonus:** I also ask AI to suggest meeting improvements based on the content and flow.

This system works for team meetings, client calls, project planning sessions - any type of meeting.`,
    url: 'https://reddit.com/r/productivity/comments/example6',
    score: 198,
    comments: 34,
    author: 'MeetingOptimizer',
    createdAt: '2024-01-10T13:20:00Z',
    tags: ['productivity', 'meetings', 'organization']
  },
  {
    platform: 'reddit',
    title: 'The ultimate AI prompt for creating viral social media content',
    content: `I've been testing AI-generated social media content for 6 months. This prompt consistently creates engaging posts:

"Create a social media post for [platform] about [topic] that:

Target audience: [specific demographic]
Goal: [engagement/awareness/sales/etc.]
Tone: [brand voice]

Requirements:
- Hook: Start with attention-grabbing question/statement
- Value: Provide actionable insight or entertainment
- Engagement: Include a call-to-action that encourages interaction
- Format: Use appropriate hashtags, emojis, and formatting for [platform]
- Length: Optimize for [platform] best practices

Make it shareable and conversation-starting."

**Why this works:**
- Specific platform optimization
- Clear value proposition
- Built-in engagement mechanics
- Consistent brand voice

My engagement rates increased 250% using AI-generated content with this template. 

**Platform-specific variations:**
- LinkedIn: Professional tone, industry insights
- Twitter: Concise, thread-worthy content
- Instagram: Visual-friendly, story-telling
- TikTok: Trend-aware, entertainment-focused

**Time saved:** From 30 minutes per post to 5 minutes.`,
    url: 'https://reddit.com/r/marketing/comments/example7',
    score: 176,
    comments: 29,
    author: 'SocialMediaGuru',
    createdAt: '2024-01-09T15:10:00Z',
    tags: ['marketing', 'social-media', 'content-creation']
  },
  {
    platform: 'reddit',
    title: 'AI-powered learning: How I master any topic in 48 hours',
    content: `I developed a system to rapidly learn new topics using AI. Here's the 48-hour mastery framework:

**Hour 1-2: Foundation Building**
"I need to understand [topic] quickly. Create a beginner's guide covering: core concepts, key terminology, fundamental principles, and common misconceptions. Make it comprehensive but digestible."

**Hour 3-8: Deep Dive Research**
"Now provide advanced insights on [topic]: expert strategies, case studies, best practices, current trends, and future implications. Include real-world examples."

**Hour 9-16: Practical Application**
"Create hands-on exercises and projects for [topic] that: progress from basic to advanced, can be completed with available tools, provide measurable outcomes, build portfolio-worthy results."

**Hour 17-24: Teaching Preparation**  
"Help me create teaching materials for [topic]: presentation outline, key talking points, common questions and answers, analogies for complex concepts."

**Hour 25-48: Implementation and Testing**
Apply knowledge in real scenarios, get AI feedback on progress, iterate and improve.

**Results:** I've used this to learn data visualization, copywriting, project management, and even cooking techniques. The teaching component is crucial - if you can teach it, you truly understand it.

**Key insight:** AI accelerates the research phase, but you still need hands-on practice for true mastery.`,
    url: 'https://reddit.com/r/learning/comments/example8',
    score: 267,
    comments: 41,
    author: 'RapidLearner',
    createdAt: '2024-01-08T08:45:00Z',
    tags: ['learning', 'education', 'productivity']
  }
];

// Demo-Implementierung des Content Scrapers
export class DemoContentScraper {
  
  // Simuliert das Scraping von Reddit-Inhalten
  static async scrapeRedditDemo(): Promise<RawContent[]> {
    console.log('🎭 Verwende Demo-Daten für Reddit-Scraping...');
    
    // Simuliere Netzwerk-Verzögerung
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filtere zufällig 5-8 Inhalte für realistische Simulation
    const shuffled = [...DEMO_REDDIT_CONTENT].sort(() => 0.5 - Math.random());
    const selectedContent = shuffled.slice(0, Math.floor(Math.random() * 4) + 5);
    
    console.log(`✅ ${selectedContent.length} Demo-Inhalte von Reddit simuliert`);
    return selectedContent;
  }
  
  // Simuliert das Scraping aller Plattformen
  static async scrapeAllDemo(): Promise<RawContent[]> {
    const redditContent = await this.scrapeRedditDemo();
    
    // Weitere Plattformen könnten hier hinzugefügt werden
    return redditContent;
  }
}