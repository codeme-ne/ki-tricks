#!/usr/bin/env tsx

// Auto-generated merge script
import { readFileSync, writeFileSync } from 'fs';
import { KITrick } from '../src/lib/types/types';

console.log('🔄 Merge genehmigte Tricks in mock-data.ts...');

// Lade genehmigte Tricks
const approvedTricks: KITrick[] = JSON.parse(readFileSync('scraped-content/approved-tricks-2025-08-05.json', 'utf-8'));

// Hier würde normalerweise mock-data.ts erweitert werden
console.log(`✅ ${approvedTricks.length} Tricks bereit zum Merge`);
console.log('⚠️  Manueller Merge erforderlich - Backup erstellen!');

approvedTricks.forEach((trick, i) => {
  console.log(`${i + 1}. ${trick.title} (${trick.category})`);
});
