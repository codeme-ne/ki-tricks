# Suggested Commands
```bash
# Install
npm install

# Run dev server
npm run dev
npm run dev:mobile      # expose on 0.0.0.0 for devices

# Quality gates
npm run lint            # ESLint/Next lint
npm run fix-build       # lint --fix + tsc check

# Production
npm run build
npm start

# Data & scripts
npm run clean:data
npm run import-tricks           # bulk import from CSV/JSON
npm run transform-tricks        # transform generated tips to Supabase format
npm run ingest:omni             # ingest omni-search data

# Supabase helpers (require CLI, env vars)
npm run supabase:login
npm run supabase:link
npm run db:start                # start local Supabase stack
npm run db:push                 # apply migrations
npm run db:reset                # restart/reset stack

# Pipeline (ETL)
npm run pipeline:fetch          # fetch feeds
npm run pipeline:normalize
npm run pipeline:curate
npm run pipeline:format-guides
npm run pipeline:full           # chained run
```