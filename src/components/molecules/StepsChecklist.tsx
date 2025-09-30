"use client";

import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Step {
  step: string;
  description?: string;
  image_url?: string | null;
  code_snippet?: string | null;
  warning?: string | null;
}

interface StepsChecklistProps {
  steps: Step[];
  trickId?: string;
}

export function StepsChecklist({ steps, trickId }: StepsChecklistProps) {
  const storageKey = trickId ? `trick-progress-${trickId}` : 'trick-progress-default';
  const [checkedSteps, setCheckedSteps] = useLocalStorage<Record<number, boolean>>(storageKey, {});

  const handleCheckChange = (index: number, checked: boolean) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: checked }));
  };

  const completedCount = useMemo(() => {
    return Object.values(checkedSteps).filter(Boolean).length;
  }, [checkedSteps]);

  const progressPercentage = (completedCount / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-muted/30 p-4 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Fortschritt</p>
          <p className="text-sm text-muted-foreground">
            {completedCount} von {steps.length} Schritten
          </p>
        </div>
        <Progress value={progressPercentage} className="h-2" />

        {/* Completion celebration */}
        {progressPercentage === 100 && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 text-center">
              🎉 Glückwunsch! Du hast alle Schritte abgeschlossen!
            </p>
          </div>
        )}
      </div>

      {/* Steps list */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`border-l-4 pl-6 transition-all duration-300 ${
              checkedSteps[index]
                ? "border-green-500 opacity-60"
                : "border-primary"
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <Checkbox
                id={`step-${index}`}
                checked={checkedSteps[index] || false}
                onCheckedChange={(checked) =>
                  handleCheckChange(index, !!checked)
                }
                className="mt-1"
              />
              <label
                htmlFor={`step-${index}`}
                className={`flex-1 cursor-pointer ${
                  checkedSteps[index] ? "line-through" : ""
                }`}
              >
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {step.step}
                </h3>
                {step.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                )}
              </label>
            </div>

            {step.code_snippet && (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                <code>{step.code_snippet}</code>
              </pre>
            )}

            {step.warning && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>⚠️ Hinweis:</strong> {step.warning}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}