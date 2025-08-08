# YouTube Scraper Feature - Product Requirements Document

## 1. Overview
### Purpose
Implement a lightweight YouTube scraper to extract AI-related tricks from top 15 most popular videos in a single channel, integrating seamlessly with the existing KI Tricks Platform content pipeline.

## 2. User Stories
### As a Platform Admin
- I want to input a single YouTube channel URL
- I want to automatically extract top 15 most popular videos
- I want to convert video subtitles into actionable AI tricks
- I want the extracted content to follow our existing KITrick data structure

### As a Platform User
- I want high-quality, concise AI tricks
- I want tricks that are easily implementable and categorized

## 3. Technical Specifications

### Input
- Single YouTube channel URL

### Scraping Requirements
- Use Apify YouTube Scraper Actor  
- Extract top 15 videos sorted by "POPULAR"
- Apify Configuration:
```javascript
{
  startUrls: [{ url: channelUrl }],
  maxResults: 15,
  sortVideosBy: "POPULAR",
  downloadSubtitles: true,
  subtitlesLanguage: "en", 
  subtitlesFormat: "plaintext",
  hasSubtitles: true,
  lengthFilter: "between420"  // 4-20min Videos, max 45min
}
```
- Capture video metadata:
  - Title
  - Channel name
  - View count
  - Publish date
  - Duration

### Subtitle Extraction
- Extract full plaintext subtitles
- Support multiple language subtitles
- Fallback to auto-generated subtitles if manual subtitles unavailable

### Content Processing
- LLM-powered transformation pipeline
- Extract actionable steps from subtitles
- Categorize tricks using existing platform categories
- Assign difficulty level

### Output & Storage
- Save to `scraped-content/youtube-YYYY-MM-DD_HH-MM-SS.json` for manual review
- Follow existing Reddit scraper workflow for verification
- After manual verification, append to `mock-data.ts`
- Generate summary markdown for quick overview

### Data Structure Mapping
```typescript
interface YouTubeTrickExtraction {
  originalVideoTitle: string;
  channelName: string;
  viewCount: number;
  publishDate: Date;
  extractedTricks: KITrick[];
}
```

## 4. Implementation Approach

### Components
1. **YouTube Scraper Script**
   - Located: `scripts/youtube-scraper.ts`
   - Responsibilities:
     - Handle Apify YouTube Scraper configuration
     - Manage actor input/output
     - Coordinate subtitle extraction

2. **Subtitle Processor**
   - Located: `lib/subtitle-processor.ts`
   - Responsibilities:
     - Clean and normalize subtitle text
     - Prepare text for LLM processing

3. **Trick Extraction Service**
   - Located: `services/trick-extraction-service.ts`
   - Responsibilities:
     - Use LLM to convert subtitles to tricks
     - Apply KITrick structure
     - Categorize and tag tricks

### Technology Stack
- Apify SDK
- OpenAI/Claude API for trick extraction
- TypeScript
- Node.js

## 5. Success Criteria
- ✅ Scrape top 15 videos from a given channel
- ✅ Extract full subtitles with >90% accuracy
- ✅ Generate minimum 15 unique AI tricks in german per video batch
- ✅ Maintain existing KITrick data quality standards

### Quality Gates
- ✅ Minimum 10,000 Views pro Video
- ✅ Minimum 1,000 Wörter in Subtitles
- ✅ Maximum 45 Minuten Video-Länge
- ✅ Nur Videos mit englischen Subtitles

## 6. Non-Functional Requirements
- Secure API key management
- Graceful error handling
- Logging of scraping and processing activities
- Respect YouTube's Terms of Service

## 7. Potential Risks & Mitigations
- Subtitle quality variance
  - Mitigation: Implement multi-language support, fallback mechanisms
- LLM hallucination
  - Mitigation: Implement strict prompt engineering, validation steps

### Error Handling Scenarios
- **Channel existiert nicht**
  - Benutzerfreundliche Fehlermeldung mit Beispiel-URLs
  - Validierung der Channel-URL vor Scraping
- **Videos ohne Subtitles**
  - Skip mit Warnung in Console
  - Continue mit verfügbaren Videos
- **Apify Rate Limits**
  - Exponential backoff retry-Mechanismus
  - User-friendly Progress-Updates
- **LLM API Failures**
  - Graceful degradation mit Retry-Logic
  - Speichere rohe Subtitles für späteren Retry
- **Network Issues**
  - 3x Retry mit steigenden Intervals
  - Offline-Modus für gespeicherte Daten

## 8. Timeline & Milestones

### Tag 1: Foundation (2-3 Stunden)

  - Apify Actor testen mit einem Channel (30 min)
  - scripts/scrape-youtube-channel.ts erstellen (1h)
  - Basic CLI Interface für Channel-Input (1h)
  - Erste Test-Videos scrapen und JSON ausgeben (30 min)

### Tag 2: Subtitle Processing (2-3 Stunden)

  - Subtitle-Extraktion aus Apify Response (1h)
  - Text-Cleaning und Formatierung (1h)
  - Integration mit bestehender content-scraper.ts (1h)

### Tag 3: LLM Integration (3-4 Stunden)

  - Prompt Engineering für Trick-Extraktion (1h)
  - youtube-trick-extractor.ts erstellen (2h)
  - Test mit 3 Videos und manuelle Qualitätsprüfung (1h)

### Tag 4: Integration & Polish (2-3 Stunden)

  - Integration in bestehende KITrick Struktur (1h)
  - Error Handling und Logging (1h)
  - Package.json Script und Dokumentation (1h)

### Tag 5: Testing & Deployment (1-2 Stunden)

  - Test mit verschiedenen Channels (Matt Wolfe, Fireship) (30 min)
  - Edge Cases testen (Videos ohne Subtitles, etc.) (30 min)
  - Final cleanup und Dokumentation (30 min)

## 9. Integration Points
- **Storage Integration**: Nutzt bestehenden `ContentBatchProcessor.saveResults()` Workflow
- **Content Pipeline**: Reused Reddit-Scraper Architektur für YouTube-Videos
- **Manual Review**: Folgt bewährtem Workflow: scraped-content/ → Review → mock-data.ts
- **Data Structure**: Vollständige Kompatibilität mit bestehender `KITrick` Interface
- **CLI Integration**: Erweitert bestehende Scraping-Scripts um YouTube-Funktionalität

**Note:** This PRD follows the minimalistic and focused approach outlined in our platform's design principles, emphasizing simplicity and actionable content generation.