"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  TrendingUp, 
  Copy, 
  Check, 
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import type { LLMOptimizationRound } from "@/lib/prompt-optimizer/llm-types";

interface LLMPromptOptimizerProps {
  initialPrompt?: string;
  rounds?: number;
}

export function LLMPromptOptimizer({ 
  initialPrompt = "", 
  rounds = 3 
}: LLMPromptOptimizerProps) {
  const [userPrompt, setUserPrompt] = useState(initialPrompt);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<LLMOptimizationRound[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const handleOptimize = async () => {
    if (!userPrompt.trim()) return;

    setIsOptimizing(true);
    setError(null);
    setOptimizationResults([]);
    setExpandedRound(null);

    try {
      const response = await fetch('/api/optimize-prompt-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userPrompt,
          rounds 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Optimization failed');
      }

      setOptimizationResults(data.rounds || []);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finalResult = optimizationResults[optimizationResults.length - 1];
  const initialScore = optimizationResults[0]?.overallScore || 0;
  const finalScore = finalResult?.overallScore || 0;
  const improvement = finalScore - initialScore;

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <Label htmlFor="prompt-input" className="text-lg font-semibold">
            Dein Prompt
          </Label>
        </div>
        
        <Textarea
          id="prompt-input"
          placeholder="z.B. 'Schreibe einen Blogpost über KI'"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="min-h-[100px] text-base"
        />

        <div className="flex items-center gap-4">
          <Button
            onClick={handleOptimize}
            disabled={!userPrompt.trim() || isOptimizing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Optimiere ({optimizationResults.length}/{rounds})...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Prompt Optimieren
              </>
            )}
          </Button>

          <span className="text-sm text-gray-500">
            {rounds} Runden • Kostenlos mit Gemini
          </span>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Fehler bei der Optimization</p>
              <p className="text-red-700 mt-1">{error}</p>
              {error.includes('GEMINI_API_KEY') && (
                <p className="mt-2 text-red-600">
                  → Siehe <code className="bg-red-100 px-1 rounded">GEMINI_SETUP.md</code> für kostenlosen API Key
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {optimizationResults.length > 0 && (
        <div className="space-y-4">
          {/* Score Overview */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Optimization Abgeschlossen! 🎉
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Score:</span>
                <span className="text-2xl font-bold text-red-600">
                  {initialScore.toFixed(1)}
                </span>
                <span className="text-gray-400 mx-1">→</span>
                <span className="text-2xl font-bold text-green-600">
                  {finalScore.toFixed(1)}
                </span>
                <span className="text-sm font-medium text-green-600 ml-2">
                  (+{improvement.toFixed(1)})
                </span>
              </div>
            </div>

            <Progress 
              value={(finalScore / 10) * 100} 
              className="h-3"
            />
            <p className="text-sm text-gray-600 mt-2 text-center">
              {finalScore >= 8 ? "Exzellenter Prompt! 🚀" : 
               finalScore >= 6 ? "Guter Prompt ✅" : 
               "Noch Verbesserungspotenzial 💪"}
            </p>
          </div>

          {/* Final Optimized Prompt */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Finaler Optimierter Prompt
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(finalResult?.optimizedPrompt || '')}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Kopieren
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={finalResult?.optimizedPrompt || ''}
              readOnly
              className="min-h-[150px] font-mono text-sm bg-gray-50"
            />
          </div>

          {/* Round-by-Round Details */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
            <h3 className="text-base font-semibold mb-4">
              Optimization-Verlauf ({optimizationResults.length} Runden)
            </h3>

            <div className="space-y-3">
              {optimizationResults.map((round) => (
                <div 
                  key={round.round}
                  className="border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedRound(
                      expandedRound === round.round ? null : round.round
                    )}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                        {round.round}
                      </span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          Runde {round.round}
                        </p>
                        <p className="text-sm text-gray-600">
                          Score: {round.overallScore?.toFixed(1) || 'N/A'}/10
                        </p>
                      </div>
                    </div>
                    {expandedRound === round.round ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedRound === round.round && (
                    <div className="p-4 space-y-4 bg-white border-t">
                      {/* Analysis Scores */}
                      {round.analysis && (
                        <div>
                          <p className="text-sm font-semibold mb-2">Analyse:</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(round.analysis).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600 capitalize">{key}:</span>
                                <span className="font-medium">{value}/10</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Weaknesses */}
                      {round.weaknesses && round.weaknesses.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-2">Schwächen:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {round.weaknesses.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {round.improvements && round.improvements.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-2">Verbesserungen:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                            {round.improvements.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Prompt for this round */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Prompt nach Runde {round.round}:</p>
                        <Textarea
                          value={round.optimizedPrompt || round.currentPrompt}
                          readOnly
                          className="min-h-[100px] font-mono text-xs bg-gray-50"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}