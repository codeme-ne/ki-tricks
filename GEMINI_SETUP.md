# Kostenlosen Gemini API Key erhalten

## Schritt 1: Google AI Studio öffnen

Besuche: https://aistudio.google.com/

## Schritt 2: Mit Google Account anmelden

- Nutze deinen bestehenden Google Account
- Oder erstelle einen neuen (kostenlos)

## Schritt 3: API Key erstellen

1. Klicke auf "Get API Key" (oben rechts)
2. Klicke auf "Create API Key"
3. Wähle ein Google Cloud Projekt (oder erstelle ein neues)
4. Kopiere den generierten API Key

## Schritt 4: API Key in .env.local einfügen

```bash
# .env.local
GEMINI_API_KEY=dein_api_key_hier
```

## Kostenlose Limits (Stand 2025)

### Gemini 2.0 Flash Experimental (EMPFOHLEN)
- **Rate Limit**: 10 Requests/Minute, 1500 Requests/Tag
- **Token Limit**: 4M Tokens/Minute Input, 16k Tokens/Minute Output
- **Komplett kostenlos!** ✅

### Gemini 1.5 Flash
- **Rate Limit**: 15 Requests/Minute, 1500 Requests/Tag  
- **Token Limit**: 1M Tokens/Minute
- **Komplett kostenlos!** ✅

## Keine Kreditkarte erforderlich! 🎉

Die Free Tier von Google AI Studio erfordert **keine Zahlungsinformationen**.

## Für Prompt Optimizer

Bei durchschnittlich **3-5 Optimierungs-Runden** pro Prompt und ~500 Tokens pro Runde:
- **~2500 Tokens pro Optimization**
- **Bei 1M Tokens/Minute**: ~400 Optimierungen/Minute möglich
- **Bei 1500 Requests/Tag**: ~300-500 Optimierungen/Tag möglich

**Mehr als genug für intensive Nutzung!** 🚀