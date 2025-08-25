/**
 * Removes difficulty, timeToImplement, and impact keys from data/generated-ki-tips.json
 * Works line-by-line to tolerate malformed JSON chunks.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'generated-ki-tips.json');

try {
  const input = fs.readFileSync(FILE, 'utf8');
  const lines = input.split(/\r?\n/);
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('"difficulty"')) return false;
    if (trimmed.startsWith('"timeToImplement"')) return false;
    if (trimmed.startsWith('"impact"')) return false;
    return true;
  });

  fs.writeFileSync(FILE, filtered.join('\n'), 'utf8');
  console.log('Cleaned generated-ki-tips.json: removed difficulty, timeToImplement, impact.');
} catch (err) {
  console.error('Failed to clean generated-ki-tips.json:', err.message);
  process.exit(1);
}
