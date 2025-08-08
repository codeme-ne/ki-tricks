# ÜBERBLICK SCRAPING-SYSTEM

## 📊 **GROBE ÜBERSICHT** 

```
npm run scrape-production → Keywords wählen → Reddit durchsuchen → 
Posts filtern → AI übersetzt & formatiert → Dateien speichern → 
Review-System → In mock-data.ts integrieren
```

---

## 🔄 **KONKRETE SCHRITTE**

### **Phase 1: Initialisierung**
1. Terminal-Befehl `npm run scrape-production` startet `scripts/scrape-content.ts`
2. Lädt Production-Config: 50 Tricks max, 70% Confidence, Reddit + Twitter + Hacker News
3. Prüft API-Keys (APIFY_API_TOKEN, OPENAI_API_KEY, ANTHROPIC_API_KEY)

### **Phase 2: Scraping**
4. Wählt 5 zufällige Keywords aus 100 verfügbaren
5. Sucht auf Reddit mit diesen Keywords (Twitter/HN noch nicht implementiert)
6. Filtert Posts: Min. 3 Upvotes, 1 Kommentar, >200 Zeichen
7. Bei Fehler: Automatischer Fallback zu 8 Demo-Posts

### **Phase 3: AI-Verarbeitung**
8. Jeder Post wird verarbeitet:
   - Priorisiert OpenAI GPT-4o-mini (günstig)
   - Fallback zu Claude API
   - Notfalls Pattern-Matching
9. Generiert deutschen KI-Trick mit allen Komponenten

### **Phase 4: Qualitätskontrolle**
10. Duplikat-Check gegen existierende Tricks
11. Confidence-Score Bewertung (min. 70%)
12. Stoppt bei 50 erfolgreichen Tricks

### **Phase 5: Speicherung**
13. Erstellt JSON + TypeScript Dateien in `scraped-content/`
14. Generiert Markdown-Zusammenfassung

### **Phase 6: Review & Integration**
15. Optional: `npm run review-and-append` für manuelle Review
16. Genehmigung einzelner Tricks mit Edit-Möglichkeit
17. Automatische Integration in `src/lib/data/mock-data.ts`

---

## 🔬 **SUPER-DETAILLIERTE ROADMAP**

### **🚀 START: npm run scrape-production**

#### **1️⃣ Initialisierungs-Phase (0-5 Sekunden)**

**1.1 Script-Start**
- Datei: `scripts/scrape-content.ts`
- Lädt `.env.local` für API-Keys
- Parst Kommandozeilen-Argumente

**1.2 Konfiguration laden**
```javascript
config = DEFAULT_BATCH_CONFIGS.production = {
  maxTricksPerRun: 50,
  minConfidenceScore: 70,
  outputFormat: 'both',
  dryRun: false,
  useDemo: false,
  platforms: ['reddit', 'twitter', 'hackernews']
}
```

**1.3 API-Key Status-Check**
```
🔑 Environment Check:
   APIFY_API_TOKEN: Gesetzt ✅ / Fehlt ❌
   OPENAI_API_KEY: Gesetzt ✅ / Fehlt ❌
   ANTHROPIC_API_KEY: Gesetzt ✅ / Fehlt ❌
```

---

#### **2️⃣ Vorbereitung (5-10 Sekunden)**

**2.1 ContentBatchProcessor initialisieren**
- Erstellt RedditScraper-Instanz
- Lädt existierende Tricks aus `src/lib/data/mock-data.ts`
- Extrahiert ~44 Trick-Titel für Duplikat-Check

**2.2 Keyword-Auswahl**
- Datei: `src/lib/ai/scraping-keywords.ts`
- Funktion: `getBalancedKeywords(5)`
- Wählt aus 10 Kategorien mit je 10 Keywords:
  - productivity: "AI productivity hack", "automate tasks with AI"...
  - programming: "ChatGPT tips for developers", "Claude coding tricks"...
  - contentCreation: "AI for content creation", "Midjourney prompt guide"...
  - (7 weitere Kategorien)
- **Zufällig 5 Keywords** aus 100 möglichen

---

#### **3️⃣ Reddit-Scraping (10-30 Sekunden)**

**3.1 Reddit Scraper aktiviert**
```javascript
inputConfig = {
  searches: [5 dynamische Keywords],
  searchPosts: true,
  searchComments: false,
  sort: 'top',
  time: 'month',
  maxItems: 50,
  maxPostCount: 25,
  proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] }
}
```

**3.2 Apify Actor Call**
- Actor: `trudax/reddit-scraper-lite`
- Sucht in Reddit nach den 5 Keywords
- Fokus auf Posts (keine Kommentare)
- Zeitraum: Letzter Monat
- Max. 50 Items insgesamt

**3.3 Fallback-Mechanismus**
```
Wenn Apify fehlschlägt:
├── Fehlerursachen:
│   ├── Kein/Falscher API-Token
│   ├── Rate Limits erreicht
│   └── Actor nicht verfügbar
└── Automatischer Switch zu Demo-Daten (8 hochwertige Beispiel-Posts)
```

---

#### **4️⃣ Content-Normalisierung (1-2 Sekunden)**

**4.1 Reddit-Content normalisieren**
```javascript
Für jeden Post:
{
  platform: 'reddit',
  title: post.title,
  content: post.body || post.selftext,
  url: post.url,
  score: post.upVotes,        // Reddit-Upvotes
  comments: post.numberOfComments,
  author: post.username,
  createdAt: post.createdAt,
  tags: [subreddit, flair, extrahierte Hashtags]
}
```

**4.2 Qualitätsfilter**
```
Bedingungen für Behalten:
✓ score >= 3 (mindestens 3 Upvotes)
✓ comments >= 1 (mindestens 1 Kommentar)
✓ content.length > 200 (substantieller Inhalt)
✓ AI-Relevanz erkannt (Keywords in Title/Content)
```

---

#### **5️⃣ AI-Verarbeitung (30-120 Sekunden)**

**5.1 Für jeden gefilterten Post:**

**API-Priorität:**
1. **OpenAI GPT-4o-mini** (wenn OPENAI_API_KEY vorhanden)
   - Kosten: $0.15 per 1M Input-Tokens
   - Schnell und günstig
   
2. **Claude API** (wenn ANTHROPIC_API_KEY vorhanden)
   - Als Backup für OpenAI
   
3. **Pattern-Matching** (wenn keine API verfügbar)
   - Regelbasierte Extraktion

**5.2 AI-Prompt-Struktur:**
```xml
Analysiere diesen Reddit-Post und erstelle einen deutschen KI-Trick:

<reddit_post>
[Title und Content]
</reddit_post>

Erstelle folgende Struktur:
<kitrick>
  <title>Catchy deutscher Titel (max 100 Zeichen)</title>
  <description>Beschreibung mit **Warum es funktioniert:** Hook</description>
  <category>productivity|programming|learning|etc</category>
  <difficulty>beginner|intermediate|advanced</difficulty>
  <tools>Claude, ChatGPT, etc</tools>
  <timeToImplement>5-10 Minuten</timeToImplement>
  <impact>low|medium|high</impact>
  <steps>4 konkrete Schritte</steps>
  <examples>2 Real-World Beispiele</examples>
</kitrick>
```

**5.3 Generierte Komponenten:**
- **Titel**: "Der 10-Sekunden Prompt der jeden Code-Fehler debuggt"
- **Psychologie-Hook**: "**Warum es funktioniert:** Nutzt das Prinzip der kognitiven Entlastung..."
- **4 Schritte**: Beginnend mit Aktionsverben
- **2 Beispiele**: Mit messbaren Resultaten
- **Kategorisierung**: Automatisch basierend auf Content
- **Schwierigkeit**: Basierend auf Komplexität
- **Zeitschätzung**: "10-15 Minuten", "30-45 Minuten"
- **Impact**: Basierend auf potenziellem Nutzen

---

#### **6️⃣ Qualitätskontrolle (1 Sekunde pro Trick)**

**6.1 Duplikat-Check**
```javascript
Vergleicht mit ~44 existierenden Tricks:
├── Exakter Titel-Match → Skip
├── Ähnlichkeit > 80% → Skip
└── Neu → Weiter
```

**6.2 Confidence-Score**
```javascript
Berechnung (0-100%):
├── Hat Psychologie-Hook: +20
├── Konkrete Zeitangabe: +10
├── Steps mit Verben: +10
├── Beispiele mit Zahlen: +20
├── 1-3 Tools: +10
├── Gute Länge (200-500): +10
├── High Impact: +20
└── Minimum für Production: 70%
```

**6.3 Limit-Check**
```
Nach jedem erfolgreichen Trick:
if (newTricks.length >= 50) {
  console.log("🎯 Limit von 50 Tricks erreicht");
  break;
}
```

---

#### **7️⃣ Speicherung (2-5 Sekunden)**

**7.1 Datei-Erstellung**
```
Ordner: scraped-content/
├── kitricks-2025-08-06_14-30-15.json (JSON-Format)
├── kitricks-2025-08-06_14-30-15.ts (TypeScript-Export)
└── summary-2025-08-06_14-30-15.md (Zusammenfassung)
```

**7.2 JSON-Format**
```json
[{
  "id": "scraped-1754348175143-e59b2h1xz",
  "title": "Der ultimative ChatGPT Prompt",
  "description": "...\n\n**Warum es funktioniert:**...",
  "category": "productivity",
  "difficulty": "beginner",
  "tools": ["ChatGPT", "Claude"],
  "timeToImplement": "10-15 Minuten",
  "impact": "high",
  "steps": ["Schritt 1...", "..."],
  "examples": ["Beispiel 1...", "..."],
  "slug": "der-ultimative-chatgpt-prompt",
  "createdAt": "2025-08-06T14:30:15Z",
  "updatedAt": "2025-08-06T14:30:15Z"
}]
```

**7.3 Zusammenfassung**
```markdown
# KI-Tricks Scraping Zusammenfassung

**Datum:** 6.8.2025, 14:30:15
**Gesamt:** 23 neue KI-Tricks
**Verarbeitet:** 50 Posts
**Übersprungen:** 27 (15 Duplikate, 12 Low-Quality)

## Kategorien
- productivity: 8
- programming: 6
- learning: 5
- business: 4

## Top Tricks (nach Impact)
1. Der 10-Sekunden Debug-Prompt (programming)
2. Meetings in Tasks verwandeln (productivity)
[...]
```

---

#### **8️⃣ Abschluss & Review (Optional)**

**8.1 Erfolgsmeldung**
```
✅ 23 neue KI-Tricks erfolgreich erstellt!

🎯 NÄCHSTE SCHRITTE:
1. Prüfe die erstellten Dateien im scraped-content/ Verzeichnis
2. Reviewe die Tricks manuell auf Qualität
3. Integriere gewünschte Tricks in mock-data.ts
4. Teste die neuen Tricks auf der Website
```

**8.2 Review-System (npm run review-and-append)**
```
Für jeden Trick:
├── Zeigt Trick-Details
├── Optionen:
│   ├── y: Genehmigen
│   ├── n: Überspringen
│   └── e: Editieren (öffnet VS Code)
└── Genehmigte Tricks → Automatisch in mock-data.ts eingefügt
```

---

### **⏱️ ZEITLICHE ÜBERSICHT**

| Phase | Dauer | Beschreibung |
|-------|-------|--------------|
| Initialisierung | 0-5 Sek | Config laden, API-Keys prüfen |
| Vorbereitung | 5-10 Sek | Existierende Tricks laden, Keywords wählen |
| Scraping | 10-30 Sek | Reddit durchsuchen (oder Demo-Daten) |
| AI-Verarbeitung | 30-120 Sek | 50 Posts → KI-Tricks konvertieren |
| Qualitätskontrolle | 5-10 Sek | Duplikate filtern, Confidence prüfen |
| Speicherung | 2-5 Sek | JSON/TS/MD Dateien erstellen |
| **GESAMT** | **~1-3 Minuten** | **Für 20-50 neue Tricks** |

---

### **🎯 ENDE: Integration in mock-data.ts**

Die neuen Tricks sind jetzt bereit für die Website und werden beim nächsten Build automatisch angezeigt!