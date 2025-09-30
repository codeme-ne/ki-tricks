'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Loader2, Copy, Check, ChevronDown, ChevronRight, Brain, Download } from 'lucide-react';
import { exportToMarkdown, exportToJSON, type ExportData } from '@/lib/utils/export';

interface StreamEvent {
  type: 'round-start' | 'thinking' | 'answer' | 'round-complete' | 'complete' | 'error';
  data: {
    round?: number;
    total?: number;
    content?: string;
    accumulated?: string;
    analysis?: {
      clarity: number;
      specificity: number;
      context: number;
      structure: number;
      outputFormat: number;
    };
    weaknesses?: string[];
    improvements?: string[];
    optimizedPrompt?: string;
    overallScore?: number;
    thinkingProcess?: string;
    currentPrompt?: string;
    finalPrompt?: string;
    message?: string;
  };
}

interface RoundState {
  round: number;
  status: 'analyzing' | 'thinking' | 'complete' | 'error';
  thinkingContent: string;
  answerContent: string;
  analysis?: {
    clarity: number;
    specificity: number;
    context: number;
    structure: number;
    outputFormat: number;
  };
  weaknesses?: string[];
  improvements?: string[];
  optimizedPrompt?: string;
  overallScore?: number;
  expanded: boolean;
}

export function LLMPromptOptimizerStream() {
  const [userPrompt, setUserPrompt] = useState('');
  const [rounds, setRounds] = useState(3);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [roundsState, setRoundsState] = useState<RoundState[]>([]);
  const [finalPrompt, setFinalPrompt] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  // Performance optimization: accumulate chunks without re-rendering
  const accumulatedAnswersRef = useRef<Map<number, string>>(new Map());
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Throttled state update (150ms) to prevent UI lag
  const scheduleStateUpdate = (roundNumber: number, content: string) => {
    accumulatedAnswersRef.current.set(roundNumber, content);

    if (throttleTimerRef.current) {
      return; // Update already scheduled
    }

    throttleTimerRef.current = setTimeout(() => {
      // Batch update all accumulated content
      setRoundsState((prev) => {
        const updated = [...prev];
        accumulatedAnswersRef.current.forEach((accumulated, round) => {
          const idx = updated.findIndex((r) => r.round === round);
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              answerContent: accumulated,
            };
          }
        });
        return updated;
      });
      throttleTimerRef.current = null;
    }, 150); // Update UI every 150ms max
  };

  // Cleanup throttle timer on unmount
  useEffect(() => {
    return () => {
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, []);

  const handleOptimize = async () => {
    if (!userPrompt.trim()) return;

    setIsOptimizing(true);
    setOriginalPrompt(userPrompt); // Store original for comparison
    setRoundsState([]);
    setFinalPrompt('');
    setCopied(false);
    accumulatedAnswersRef.current.clear();

    // Create abort controller for cancel functionality
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/optimize-prompt-llm/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, rounds }),
        signal: abortControllerRef.current.signal, // Pass abort signal
      });

      if (!response.ok) {
        throw new Error('Stream request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete message in buffer

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;

          try {
            const jsonStr = line.slice(6); // Remove "data: "
            const event: StreamEvent = JSON.parse(jsonStr);

            handleStreamEvent(event);
          } catch (e) {
            console.error('Failed to parse event:', e);
          }
        }
      }
    } catch (error) {
      // Handle abort separately (user cancelled)
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Optimization cancelled by user');
      } else {
        console.error('Optimization error:', error);
        alert('Optimization failed. Check console for details.');
      }
    } finally {
      setIsOptimizing(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsOptimizing(false);
    }
  };

  const handleStreamEvent = (event: StreamEvent) => {
    switch (event.type) {
      case 'round-start':
        setRoundsState((prev) => [
          ...prev,
          {
            round: event.data.round!,
            status: 'analyzing',
            thinkingContent: '',
            answerContent: '',
            expanded: true,
          },
        ]);
        break;

      case 'thinking':
        setRoundsState((prev) => {
          const updated = [...prev];
          const roundIdx = updated.findIndex((r) => r.round === event.data.round);
          if (roundIdx !== -1) {
            updated[roundIdx] = {
              ...updated[roundIdx],
              status: 'thinking',
              thinkingContent: event.data.accumulated || '',
            };
          }
          return updated;
        });
        break;

      case 'answer':
        // Use throttled update for performance (150ms batching)
        if (event.data.round && event.data.accumulated) {
          scheduleStateUpdate(event.data.round, event.data.accumulated);
        }
        break;

      case 'round-complete':
        setRoundsState((prev) => {
          const updated = [...prev];
          const roundIdx = updated.findIndex((r) => r.round === event.data.round);
          if (roundIdx !== -1) {
            updated[roundIdx] = {
              ...updated[roundIdx],
              status: 'complete',
              analysis: event.data.analysis,
              weaknesses: event.data.weaknesses,
              improvements: event.data.improvements,
              optimizedPrompt: event.data.optimizedPrompt,
              overallScore: event.data.overallScore,
            };
          }
          return updated;
        });
        break;

      case 'complete':
        setFinalPrompt(event.data.finalPrompt || '');
        break;

      case 'error':
        console.error('Stream error:', event.data.message);
        setRoundsState((prev) => {
          const updated = [...prev];
          const roundIdx = updated.findIndex((r) => r.round === event.data.round);
          if (roundIdx !== -1) {
            updated[roundIdx] = {
              ...updated[roundIdx],
              status: 'error',
            };
          }
          return updated;
        });
        break;
    }
  };

  const toggleRoundExpanded = (round: number) => {
    setRoundsState((prev) => {
      const updated = [...prev];
      const roundIdx = updated.findIndex((r) => r.round === round);
      if (roundIdx !== -1) {
        updated[roundIdx] = {
          ...updated[roundIdx],
          expanded: !updated[roundIdx].expanded,
        };
      }
      return updated;
    });
  };

  const copyToClipboard = async () => {
    if (finalPrompt) {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportMarkdown = () => {
    const finalScore = roundsState[roundsState.length - 1]?.overallScore;
    const exportData: ExportData = {
      original: originalPrompt,
      final: finalPrompt,
      rounds: roundsState,
      finalScore,
      timestamp: new Date().toISOString(),
      totalRounds: rounds,
    };
    exportToMarkdown(exportData);
  };

  const handleExportJSON = () => {
    const finalScore = roundsState[roundsState.length - 1]?.overallScore;
    const exportData: ExportData = {
      original: originalPrompt,
      final: finalPrompt,
      rounds: roundsState,
      finalScore,
      timestamp: new Date().toISOString(),
      totalRounds: rounds,
    };
    exportToJSON(exportData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Dein Prompt
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="z.B. Schreibe einen Blogpost über KI"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isOptimizing}
          />
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="rounds" className="block text-sm font-medium text-gray-700 mb-1">
              Optimierungs-Runden
            </label>
            <select
              id="rounds"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md"
              disabled={isOptimizing}
            >
              <option value={1}>1 Runde (schnell)</option>
              <option value={2}>2 Runden</option>
              <option value={3}>3 Runden (empfohlen)</option>
              <option value={4}>4 Runden</option>
              <option value={5}>5 Runden (intensiv)</option>
            </select>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={handleOptimize}
              disabled={!userPrompt.trim() || isOptimizing}
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Optimiere...
                </>
              ) : (
                'Prompt optimieren (kostenlos)'
              )}
            </Button>

            {isOptimizing && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              >
                Abbrechen
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Rounds Display */}
      {roundsState.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Optimierung läuft...</h3>

          {roundsState.map((roundState) => (
            <div
              key={roundState.round}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Round Header */}
              <button
                onClick={() => toggleRoundExpanded(roundState.round)}
                className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {roundState.expanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <span className="font-semibold">Runde {roundState.round}</span>
                  {roundState.status === 'complete' && roundState.overallScore && (
                    <span className="text-sm text-gray-600">
                      Score: {roundState.overallScore.toFixed(1)}/10
                    </span>
                  )}
                  {roundState.status === 'thinking' && (
                    <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
                  )}
                </div>
                <span className="text-sm text-gray-500 capitalize">{roundState.status}</span>
              </button>

              {/* Round Content */}
              {roundState.expanded && (
                <div className="p-4 space-y-4">
                  {/* Thinking Process */}
                  {roundState.thinkingContent && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-900">
                          Denkprozess
                        </span>
                      </div>
                      <pre className="text-xs text-purple-800 whitespace-pre-wrap font-mono">
                        {roundState.thinkingContent}
                      </pre>
                    </div>
                  )}

                  {/* Analysis */}
                  {roundState.analysis && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Bewertung:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {Object.entries(roundState.analysis).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{value}</div>
                            <div className="text-xs text-gray-600">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {roundState.weaknesses && roundState.weaknesses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-700 mb-1">
                        Schwächen:
                      </h4>
                      <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        {roundState.weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {roundState.improvements && roundState.improvements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-700 mb-1">
                        Verbesserungen:
                      </h4>
                      <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        {roundState.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optimized Prompt */}
                  {roundState.optimizedPrompt && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Optimierter Prompt:</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm">
                        {roundState.optimizedPrompt}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Final Result - Comparison View */}
      {finalPrompt && !isOptimizing && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-900">
              ✅ Optimierung abgeschlossen!
            </h3>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Kopieren
                  </>
                )}
              </Button>
              <Button onClick={handleExportMarkdown} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Markdown
              </Button>
              <Button onClick={handleExportJSON} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Original Prompt</h4>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{originalPrompt}</pre>
              </div>
              <p className="text-xs text-gray-500">{originalPrompt.length} Zeichen</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">Optimierter Prompt</h4>
              <div className="bg-white border border-green-300 rounded-lg p-4 h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{finalPrompt}</pre>
              </div>
              <p className="text-xs text-green-600">
                {finalPrompt.length} Zeichen
                {finalPrompt.length !== originalPrompt.length && (
                  <span> ({finalPrompt.length > originalPrompt.length ? '+' : ''}{finalPrompt.length - originalPrompt.length})</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}