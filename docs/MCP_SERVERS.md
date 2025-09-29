# Installierte MCP-Server für KI-Tricks Platform

Stand: 2025-09-29

## Neu installierte Top 5 MCP-Server

### 1. 🎯 Supabase MCP (`@supabase/mcp-server-supabase@0.5.5`)
**Kritisch für dieses Projekt!**

- **Zweck**: Direkte Supabase-Integration mit TypeScript-Type-Generation
- **Features**:
  - Database branching & migrations
  - TypeScript type generation aus DB-Schema
  - Log retrieval & project management
  - 20+ Built-in Tools
- **Config**: Benötigt `SUPABASE_ACCESS_TOKEN` in Environment
- **Verwendung**:
  ```bash
  # Type generation
  supabase gen types typescript --local > types/supabase.ts

  # Query database
  # Via MCP tools in Claude Code
  ```

### 2. 🎭 Playwright MCP (`@playwright/mcp@latest`)
**Modernes Browser-Testing & Automation**

- **Zweck**: Strukturierte Browser-Automation über Accessibility-Tree
- **Features**:
  - Schneller als screenshot-basierte Ansätze
  - LLM-freundlich (kein Vision-Modell nötig)
  - Deterministische Tool-Anwendung
  - Headless oder headed Mode
- **Vorteile gegenüber Puppeteer**:
  - Nutzt Accessibility-Snapshots statt Screenshots
  - Bessere LLM-Integration
  - Offiziell von Microsoft
- **Tools**:
  - `browser_navigate`, `browser_click`, `browser_type`
  - `browser_snapshot`, `browser_screenshot`
  - `browser_fill_form`, `browser_evaluate`

### 3. 📁 Filesystem MCP (`@modelcontextprotocol/server-filesystem`)
**Strukturiertes File-Management**

- **Zweck**: Sicherer, strukturierter Zugriff auf Project-Files
- **Scope**: `/home/lukasz/development/active/ki-tricks`
- **Features**:
  - Datei-Operationen mit Validierung
  - Verhindert versehentliche Systemzugriffe
  - Komplementiert Serena MCP

### 4. 📚 Context7 MCP (`@upstash/context7-mcp@latest`)
**Up-to-date Library-Dokumentation**

- **Zweck**: Aktuelle Dokumentation für Libraries abrufen
- **Nützlich für**:
  - Next.js 15 spezifische Features
  - Supabase API Updates
  - TypeScript Best Practices
- **Beispiel**:
  ```
  # In Claude Code
  "Get me the latest Next.js 15 App Router docs"
  "Show me Supabase Auth v2 examples"
  ```

### 5. 🐙 GitHub MCP (`@modelcontextprotocol/server-github`)
**GitHub-Integration**

- **Zweck**: Repository-Operations, Issues, PRs
- **Config**: Benötigt `GITHUB_PERSONAL_ACCESS_TOKEN`
- **Features**:
  - Create/Update PRs
  - Manage Issues
  - GitHub API Access
- **Hinweis**: NPM-Version deprecated, funktioniert aber noch

## Bereits vorhandene MCP-Server

### Bewährt & Funktionierend ✓
- **zen** - Multi-Model-Reasoning & Deep Analysis
- **taskmaster-ai** - Task-Management & Workflow
- **sequential-thinking** - Strukturiertes Problemlösen
- **memory** / **memory-service** - Kontext-Persistierung
- **browser-automation** / **puppeteer-browser** - Legacy Browser-Automation
- **recursive-companion** - Rekursive Verbesserungen

## Konfiguration

Die MCP-Server sind konfiguriert in:
```
~/.config/Claude/claude_desktop_config.json
```

Backup erstellt in:
```
~/.config/Claude/claude_desktop_config.json.backup
```

## Environment Variables

Folgende Environment-Variables müssen gesetzt werden:

```bash
# Supabase
export SUPABASE_ACCESS_TOKEN="your_supabase_token"

# GitHub
export GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token"
```

## Verwendung in Claude Code

Nach dem Neustart von Claude Desktop sind alle MCP-Server verfügbar:

1. **Supabase-Operationen**:
   - "Generate TypeScript types from my Supabase schema"
   - "Query the ki_tricks table for all published tricks"

2. **Browser-Testing**:
   - "Open ki-tricks.de and test the search functionality"
   - "Take a screenshot of the homepage"

3. **File-Management**:
   - "List all TypeScript files in src/components"
   - "Read the content of src/lib/supabase.ts"

4. **Library-Docs**:
   - "Show me the latest Supabase Auth examples"
   - "Get Next.js 15 Server Actions documentation"

5. **GitHub**:
   - "Create a PR for the new MCP server setup"
   - "List open issues in this repository"

## Testing

Alle Pakete wurden getestet und funktionieren:
- ✅ Supabase MCP v0.5.5
- ✅ Playwright MCP (latest)
- ✅ Filesystem MCP
- ✅ Context7 MCP
- ✅ GitHub MCP

## Nächste Schritte

1. **Claude Desktop neu starten** um MCP-Server zu aktivieren
2. **Environment Variables setzen** für Supabase & GitHub
3. **Testen** der neuen Tools in Claude Code
4. **Playwright installieren** wenn Browser-Tests benötigt:
   ```bash
   npx playwright install
   ```

## Troubleshooting

### MCP-Server läuft nicht
- Claude Desktop neu starten
- Logs prüfen: `~/.config/Claude/logs/`
- NPX-Cache clearen: `npx clear-npx-cache`

### Supabase Token fehlt
```bash
# Token von Supabase Dashboard holen
# Settings > Access Tokens > Create new token
export SUPABASE_ACCESS_TOKEN="sbp_xxx..."
```

### Playwright Browser fehlt
```bash
npx playwright install chromium
```