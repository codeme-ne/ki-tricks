# Lead Magnet PDFs

Diese Directory enthält die herunterladbaren Lead Magnets für Newsletter-Anmeldungen.

## Benötigte PDFs:

### 1. ki-tricks-guide.pdf
**Titel:** Die 50 besten KI-Tricks
**Beschreibung:** Sofort anwendbare Workflows für mehr Produktivität
**Seiten:** ~50
**Größe:** ~2-3 MB

**Inhalt sollte umfassen:**
- Top 50 KI-Tricks aus der Plattform
- Kategorisiert nach Anwendungsgebieten
- Schritt-für-Schritt Anleitungen
- Tool-Empfehlungen
- Praxisbeispiele

### 2. productivity-hacks.pdf (Optional)
**Titel:** Produktivitäts-Hacks mit KI
**Beschreibung:** Zeitsparer für deinen Arbeitsalltag
**Seiten:** ~25
**Größe:** ~1-2 MB

## PDF erstellen:

1. **Exportiere Top Tricks aus Supabase**
   ```bash
   npm run export-tricks-to-pdf
   ```

2. **Manuell designen** mit Tools wie:
   - Canva
   - Figma + Export
   - LaTeX
   - InDesign

3. **PDF hier ablegen:**
   ```
   public/downloads/ki-tricks-guide.pdf
   public/downloads/productivity-hacks.pdf
   ```

## Temporäre Lösung:

Bis das echte PDF fertig ist, kannst du einen Redirect zur Tricks-Seite einrichten oder ein einfaches Placeholder-PDF erstellen mit:

```bash
# Placeholder PDF generieren (benötigt pandoc)
echo "# Die 50 besten KI-Tricks\n\nComming Soon..." | pandoc -o ki-tricks-guide.pdf
```