"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Check, Copy, Sparkles, TrendingUp, Info } from "lucide-react";
import { optimizePrompt } from "@/lib/prompt-optimizer";
import type { OptimizationResult } from "@/lib/prompt-optimizer";

interface OptimizedPromptGeneratorProps {
  template?: string;
  trickTitle?: string;
  trickCategory?: string;
}

export function OptimizedPromptGenerator({
  template,
  trickTitle,
  trickCategory,
}: OptimizedPromptGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Extract single placeholder from template (optional - for standalone use without template)
  const placeholderMatch = template?.match(/\[([^\]]+)\]/);
  const placeholder = placeholderMatch ? placeholderMatch[1] : null;

  const handleOptimize = async () => {
    if (!userInput.trim()) return;

    setIsOptimizing(true);

    // Use template if provided, otherwise use raw user input
    let promptToOptimize = userInput;
    if (template && placeholder) {
      promptToOptimize = template.replace(`[${placeholder}]`, userInput);
    }

    // Simulate optimization process (visual feedback)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Run actual optimization
    const result = optimizePrompt(promptToOptimize, undefined, {
      trickTitle,
      trickCategory,
    });

    setOptimizationResult(result);
    setIsOptimizing(false);
  };

  const handleCopy = async () => {
    if (!optimizationResult) return;
    await navigator.clipboard.writeText(optimizationResult.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initialScore = optimizationResult?.iterations[0]?.score.overall || 0;
  const finalScore = optimizationResult?.finalScore.overall || 0;
  const improvement = finalScore - initialScore;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <Label htmlFor="user-input" className="text-lg font-semibold">
            {placeholder ? `Deine Eingabe für "${placeholder}"` : 'Dein Prompt'}
          </Label>
        </div>
        <Input
          id="user-input"
          placeholder={placeholder ? `z.B. "${placeholder}"` : "Gib deinen Prompt ein..."}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleOptimize()}
          className="text-base"
        />
      </div>

      <Button
        onClick={handleOptimize}
        disabled={!userInput.trim() || isOptimizing}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {isOptimizing ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Optimiere...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Prompt Optimieren
          </span>
        )}
      </Button>

      {optimizationResult && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <span className="text-gray-500">Score:</span>
                <span className="ml-2 text-2xl font-bold text-red-600">
                  {initialScore.toFixed(1)}
                </span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="text-2xl font-bold text-green-600">
                  {finalScore.toFixed(1)}
                </span>
                <span className="ml-2 text-sm text-green-600 font-medium">
                  (+{improvement.toFixed(1)})
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info className="w-4 h-4 mr-1" />
              {showDetails ? 'Verbergen' : 'Details'}
            </Button>
          </div>

          {showDetails && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg text-sm">
              <div className="font-semibold mb-2">Dimension Breakdown:</div>
              {Object.entries(optimizationResult.finalScore.dimensions).map(([key, dim]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{key}:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={dim.score * 10} className="w-24 h-2" />
                    <span className="font-medium w-12 text-right">{dim.score}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Optimierter Prompt:</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Kopieren
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={optimizationResult.optimized}
              readOnly
              className="min-h-[300px] font-mono text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}