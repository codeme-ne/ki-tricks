# KI-Tricks Platform - Service-Architektur

## Wie hängen die verschiedenen Dienste zusammen: Stripe - Crawling - generieren von Posts - Datenbank speichern?

### Überblick der Architektur

Die KI-Tricks Platform ist eine Next.js 15 Webanwendung, die verschiedene Services zur Verwaltung und Bereitstellung von KI-Tipps und -Tricks orchestriert. Hier ist eine detaillierte Analyse der Service-Verbindungen:

## 1. **Stripe Integration**

**Status: Nicht implementiert**

Nach der Analyse des Repositories wurde **keine Stripe-Integration** gefunden. Die Plattform scheint derzeit kostenlos zu sein ohne Zahlungsabwicklung. Potenzielle zukünftige Integration könnte für:
- Premium-Inhalte
- Erweiterte Features
- Subscription-Modelle

## 2. **Crawling Services**

**Implementiert über mehrere Scripts:**

### 2.1 Omnisearch Results Ingestion
- **Script**: `scripts/ingest-omnisearch-results.ts`
- **Zweck**: Importiert kuratierte KI-Tricks aus externen Quellen
- **Datenfluss**: 
  ```
  Externe JSON-Datei → Validierung → Slug-Generierung → Supabase ki_tricks Tabelle
  ```
- **Features**:
  - Automatische Slug-Generierung aus Titeln
  - Upsert-Funktionalität (verhindert Duplikate)
  - Metadaten-Extraktion (Rolle, Tool-Vendor, Zeitschätzungen)

### 2.2 Bulk Import System
- **Script**: `scripts/bulk-import-tricks.ts`
- **Unterstützte Formate**: CSV, JSON
- **Validierung**: Kategorien, Schwierigkeitsgrade, Impact-Level
- **Duplikats-Erkennung**: Slug-basierte Prüfung

## 3. **Post-Generierung und Content Management**

### 3.1 Submission Workflow
```
Benutzer-Eingabe → Validierung → Quality Scoring → Pending Status → Admin Review → Veröffentlichung
```

**Komponenten:**
- **API Route**: `/api/tricks/route.ts`
- **Service**: `SubmissionsService`
- **Qualitätsbewertung**: `calculateQualityScore()`
- **Duplikats-Erkennung**: `checkPendingDuplicates()`

### 3.2 Content Pipeline
1. **Einreichung** (POST `/api/tricks`)
   - Rate Limiting (3 Einreichungen/Stunde pro IP)
   - Validierung (Titel ≥10 Zeichen, Beschreibung ≥50 Zeichen)
   - Quality Score Berechnung

2. **Review Process** (PUT `/api/tricks`)
   - Admin-Authentifizierung erforderlich
   - Approve/Reject Workflow
   - Status-Updates

3. **Veröffentlichung**
   - Automatische Slug-Generierung
   - Timestamp-Management
   - Status: `pending` → `published`/`rejected`

## 4. **Datenbank-Architektur (Supabase)**

### 4.1 Haupttabellen

#### `ki_tricks` (Kern-Content)
```sql
- id (UUID, Primary Key)
- title, description, category
- tools[] (Array), steps[], examples[]
- slug (Unique Index)
- why_it_works
- status (draft|pending|published|rejected)
- quality_score
- created_at, updated_at, published_at
- view_count
```

#### `trick_submissions` (Einreichungen)
```sql
- id (UUID)
- trick_data (JSONB) - Vollständige Trick-Daten
- submitter_email, submitter_name
- status (pending|approved|rejected)
- quality_score
- review_notes
```

#### `trick_analytics` (Tracking)
```sql
- id (UUID)
- trick_id (FK zu ki_tricks)
- event_type (view|share|implement)
- session_id, metadata (JSONB)
- created_at
```

### 4.2 Row Level Security (RLS)
- **Public**: Kann veröffentlichte Tricks lesen
- **Authenticated**: Vollzugriff für Admin-Funktionen
- **Submissions**: Jeder kann einreichen, nur Admins verwalten

## 5. **Service-Verbindungen im Detail**

### 5.1 Datenfluss-Diagramm
```
[Externe Quellen] 
    ↓ (Crawling Scripts)
[Validierung & Transformation]
    ↓
[Supabase ki_tricks] ← [User Submissions] ← [Web Interface]
    ↓                      ↓
[Public API]          [Admin Review]
    ↓                      ↓
[Frontend Display]    [Approval/Rejection]
    ↓
[Analytics Tracking]
```

### 5.2 Service Layer
- **TricksService**: CRUD-Operationen für Tricks
  - `getPublishedTricks()` - Öffentliche Tricks
  - `incrementViewCount()` - Analytics
  - `createTrick()` - Admin-Funktionen

- **SubmissionsService**: Einreichungs-Management
  - `submitTrick()` - Neue Einreichungen
  - `approveSubmission()` - Admin-Approval
  - `bulkApproveSubmissions()` - Batch-Verarbeitung

### 5.3 API-Endpunkte
- `GET /api/tricks` - Pending Tricks (Admin)
- `POST /api/tricks` - Neue Einreichung
- `PUT /api/tricks` - Status-Update (Admin)
- `GET /api/analytics` - Tracking-Daten
- `GET /api/tags` - Tag-Management

## 6. **Fehlende Services (Potenzielle Erweiterungen)**

### 6.1 Stripe Integration
- Zahlungsabwicklung für Premium-Features
- Subscription-Management
- Webhook-Handling für Zahlungsstatus

### 6.2 Erweiterte Crawling-Services
- Automatisierte Web-Scraping
- RSS-Feed Integration
- Social Media Monitoring
- Scheduled Jobs für regelmäßige Updates

### 6.3 AI-gestützte Content-Generierung
- Automatische Trick-Generierung
- Content-Optimierung
- SEO-Verbesserungen
- Personalisierte Empfehlungen

## 7. **Deployment und Infrastructure**

- **Frontend**: Vercel (Next.js)
- **Datenbank**: Supabase (PostgreSQL)
- **Analytics**: Vercel Analytics
- **Email**: EmailJS (Kontaktformulare)
- **Authentication**: Supabase Auth (Admin-Bereich)

## 8. **Sicherheit und Performance**

- **Rate Limiting**: IP-basiert für Submissions
- **RLS**: Datenbankebene Sicherheit
- **Caching**: Next.js ISR für statische Inhalte
- **Optimierung**: React.memo, useMemo für Performance

## Fazit

Die Plattform nutzt eine moderne, serverless Architektur mit klarer Trennung zwischen Content-Management, Datenbank und Frontend. Während Stripe derzeit nicht implementiert ist, bietet die Architektur eine solide Grundlage für zukünftige Erweiterungen um Zahlungsabwicklung und erweiterte Crawling-Services.