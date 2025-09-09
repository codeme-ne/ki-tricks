OmniSearch MCP Integration (curation workflow)

Goal
- Source 50+ high-quality, research-backed AI tricks targeted to DACH roles (Sales, HR, Finance, IT, Procurement, Operations, Marketing, Consulting).
- Capture sources and evidence level; add privacy notes and estimated time/savings.

Install
- Requires Node.js 18+, and MCP-capable client.
- Add to `.mcp.json` (example):

{
  "mcpServers": {
    "omnisearch": {
      "command": "npx",
      "args": ["-y", "@openai/omnisearch-mcp@latest"],
      "env": {
        "OMNISEARCH_API_KEY": "<your_api_key>"
      }
    }
  }
}

Usage pattern
1) Query examples to source workflows:
   - "site:microsoft.com/copilot use cases finance"
   - "site:sap.com AI automation procurement"
   - "site:salesforce.com copilot sales workflows"
   - "site:deepl.com business use cases"
   - "site:notion.so AI templates consulting"

2) Export results as JSON with fields: title, url, snippet, tags.
3) Curate manually: confirm reproducibility, DACH relevance, vendor UI recency.
4) Use `npm run ingest:omni -- <file.json>` to map curated items into `ki_tricks` with sources and evidence.

Ingestion script
- Script: `scripts/ingest-omnisearch-results.ts`
- Requires `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Adds/updates records by `slug`.

Quality rubric (assign evidence level)
- A = internal pilot metrics/screenshots + vendor docs
- B = SME review + vendor docs
- C = Vendor pattern + public case study

Privacy notes quick-check
- Avoid copying sensitive data to third-party models
- Prefer EU data residency where possible
- Link to vendor DPA/processing documentation

