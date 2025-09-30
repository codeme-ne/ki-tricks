/**
 * LLM-Based Prompt Optimizer API Route (STREAMING VERSION)
 *
 * Uses Gemini 2.5 Pro (FREE) with streaming to show thinking process live
 *
 * Setup: Add GEMINI_API_KEY to .env.local
 * Get free key: https://aistudio.google.com/
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import { validatePromptCached } from '@/lib/security/prompt-validator';

// Maximum duration: 5 minutes (300s)
// Streaming optimization takes ~15-20s per round, ~60s for 3 rounds
// 5 minutes provides buffer for slower responses and network delays
export const maxDuration = 300;

// Initialize Gemini (free tier)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Input validation schema
const requestSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(8000, 'Prompt too long (max 8000 characters)'),
  rounds: z.number().int().min(1).max(5).default(3)
});

/**
 * Meta-Prompt for Prompt Optimization
 */
function createMetaPrompt(
  userPrompt: string,
  currentRound: number,
  totalRounds: number,
  previousPrompt?: string
): string {
  return `Du bist ein EXTREM KRITISCHER Prompt-Engineering-Experte mit höchsten Standards. Deine Bewertungen sind gnadenlos streng.

**KONTEXT**: Dies ist Runde ${currentRound} von ${totalRounds}.

${previousPrompt ? `**VORHERIGER PROMPT**: ${previousPrompt}` : `**ORIGINAL PROMPT**: ${userPrompt}`}

**BEWERTUNGSKRITERIEN (0-10) - EXTREM STRENG**:

**Clarity (Klarheit)**:
- 9-10: UNMÖGLICH zu erreichen. Perfekte, kristallklare Formulierung ohne jegliche Mehrdeutigkeit
- 7-8: Sehr gut, aber selbst kleine Unklarheiten → Abzug
- 5-6: Akzeptabel, aber Verbesserungspotenzial erkennbar
- 3-4: Unklar, mehrdeutig
- 0-2: Völlig konfus

**Specificity (Spezifität)**:
- 9-10: NAHEZU UNMÖGLICH. Jedes Detail ist präzise definiert (Länge, Format, Stil, Zielgruppe, Constraints)
- 7-8: Sehr spezifisch, aber mindestens 1-2 Details fehlen
- 5-6: Grundlegende Details vorhanden
- 3-4: Vage Anforderungen
- 0-2: Keine konkreten Details

**Context (Kontext)**:
- 9-10: EXTREM SELTEN. Vollständiger Kontext mit Background, Zielgruppe, Use-Case, Constraints
- 7-8: Guter Kontext, aber nicht perfekt
- 5-6: Basis-Kontext vorhanden
- 3-4: Minimaler Kontext
- 0-2: Kein Kontext

**Structure (Struktur)**:
- 9-10: FAST UNERREICHBAR. Perfekte logische Gliederung, Nummerierung, klare Hierarchie
- 7-8: Gut strukturiert mit kleinen Mängeln
- 5-6: Grundstruktur erkennbar
- 3-4: Chaotisch
- 0-2: Keine Struktur

**Output Format (Output-Format)**:
- 9-10: HÖCHSTE SELTENHEIT. Exakte Format-Definition mit Beispielen, Struktur-Vorgaben, Constraints
- 7-8: Format klar, aber Details fehlen
- 5-6: Format genannt, aber vage
- 3-4: Format unklar
- 0-2: Kein Format definiert

**WICHTIGE REGELN**:
- Sei GNADENLOS streng! Ein guter Prompt bekommt maximal 6-7/10
- Ein sehr guter Prompt: 7-8/10
- Ein exzellenter Prompt: 8-9/10
- 9.5+/10: Nur für absolut perfekte, professionelle Prompts mit ALLEN Details
- Selbst kleine Mängel → sofort Punktabzug
- Wenn IRGENDWAS fehlt oder unklar ist → DEUTLICH niedrigere Bewertung

**DEIN WORKFLOW**:
1. Analysiere KRITISCH nach obigen Kriterien
2. Identifiziere ALLE Schwächen (sei pingelig!)
3. Generiere verbesserten Prompt mit ALLEN fehlenden Details
4. Bewerte realistisch und streng

**OUTPUT FORMAT** (JSON):
Deine Analyse MUSS in einem JSON-Objekt zwischen den Markern SCORE_START und SCORE_END eingeschlossen sein:

SCORE_START
{
  "analysis": {
    "clarity": 6,
    "specificity": 4,
    "context": 3,
    "structure": 5,
    "outputFormat": 2
  },
  "weaknesses": [
    "Keine Zielgruppe definiert",
    "Kein Output-Format spezifiziert",
    "Fehlender Kontext über Verwendungszweck"
  ],
  "optimizedPrompt": "Der komplett verbesserte Prompt hier...",
  "improvements": [
    "Zielgruppe hinzugefügt: Geschäftsführer ohne Tech-Background",
    "Output-Format definiert: 800 Wörter, 5 Abschnitte mit Überschriften",
    "Kontext ergänzt: Verwendung in B2B Marketing Newsletter"
  ]
}
SCORE_END

Antworte NUR mit dem JSON zwischen den Markern, keine zusätzlichen Erklärungen!`;
}

export async function POST(req: NextRequest) {
  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'GEMINI_API_KEY not configured',
        setup: 'See GEMINI_SETUP.md for free API key setup'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();

    // Validate input with Zod
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          details: validation.error.format()
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, rounds } = validation.data;
    const optimizationRounds = rounds;

    // Validate prompt for injection attacks
    const promptValidation = validatePromptCached(prompt);

    if (!promptValidation.isValid) {
      return new Response(
        JSON.stringify({
          error: 'Invalid prompt',
          message: promptValidation.reason,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use sanitized prompt
    const sanitizedPrompt = promptValidation.sanitized || prompt;

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Helper to send SSE event
        const sendEvent = (type: string, data: unknown) => {
          const message = `data: ${JSON.stringify({ type, data })}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        try {
          const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',  // FREE: 4M tokens/min, 1500 requests/day
          });

          let currentPrompt = sanitizedPrompt;

          // Iterative optimization loop
          for (let round = 1; round <= optimizationRounds; round++) {
            // Check if client disconnected
            if (req.signal.aborted) {
              sendEvent('error', {
                round,
                message: 'Client disconnected',
                currentPrompt
              });
              break;
            }

            // Signal round start
            sendEvent('round-start', {
              round,
              total: optimizationRounds,
              currentPrompt
            });

            try {
              // Generate meta-prompt
              const metaPrompt = createMetaPrompt(
                prompt,
                round,
                optimizationRounds,
                round > 1 ? currentPrompt : undefined
              );

              // Stream response from Gemini with abort signal
              const result = await model.generateContentStream(
                {
                  contents: [{ role: 'user', parts: [{ text: metaPrompt }] }],
                  generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40
                  }
                },
                { signal: req.signal } // Pass abort signal
              );

              let fullResponse = '';
              let answerContent = '';

              // Stream chunks - Flash model doesn't support thinking mode
              for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                answerContent += chunkText;

                // Send answer chunk
                sendEvent('answer', {
                  round,
                  content: chunkText,
                  accumulated: answerContent
                });
              }

              // Parse JSON response with explicit delimiters for robustness
              let jsonMatch = fullResponse.match(/SCORE_START\s*([\s\S]*?)\s*SCORE_END/);

              // Fallback to old parsing if delimiters not found (backward compatibility)
              if (!jsonMatch) {
                jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
                            fullResponse.match(/\{[\s\S]*?\}/);
              }

              if (!jsonMatch) {
                throw new Error('Invalid JSON response from LLM');
              }

              const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);

              // Calculate overall score
              const scores = Object.values(parsed.analysis) as number[];
              const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

              // Send complete round data
              sendEvent('round-complete', {
                round,
                analysis: parsed.analysis,
                weaknesses: parsed.weaknesses,
                improvements: parsed.improvements,
                optimizedPrompt: parsed.optimizedPrompt,
                overallScore,
                thinkingProcess: thinkingContent
              });

              // Update current prompt for next round
              currentPrompt = parsed.optimizedPrompt;

            } catch (error) {
              console.error(`Error in round ${round}:`, error);

              // Capture error in Sentry
              Sentry.captureException(error, {
                tags: { round, endpoint: 'optimize-prompt-llm/stream' },
                extra: { currentPrompt, optimizationRounds }
              });

              sendEvent('error', {
                round,
                message: error instanceof Error ? error.message : 'Unknown error',
                currentPrompt
              });
            }
          }

          // Send completion event
          sendEvent('complete', {
            finalPrompt: currentPrompt,
            totalRounds: optimizationRounds
          });

        } catch (error) {
          console.error('Stream error:', error);

          // Capture stream-level error in Sentry
          Sentry.captureException(error, {
            tags: { error_type: 'stream', endpoint: 'optimize-prompt-llm/stream' },
            extra: { optimizationRounds }
          });

          sendEvent('error', {
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Request error:', error);

    // Capture request-level error in Sentry
    Sentry.captureException(error, {
      tags: { error_type: 'request', endpoint: 'optimize-prompt-llm/stream' }
    });

    return new Response(
      JSON.stringify({
        error: 'Request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}