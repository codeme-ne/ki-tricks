"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy } from "lucide-react";

interface InteractivePromptProps {
  template: string;
}

export function InteractivePrompt({ template }: InteractivePromptProps) {
  const [copied, setCopied] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  // Extract placeholders from template (e.g., [DEIN PRODUKT], [DEINE ZIELGRUPPE])
  const placeholders = Array.from(template.matchAll(/\[([^\]]+)\]/g)).map(
    (match) => match[1]
  );

  // Count filled placeholders
  const filledCount = Object.values(values).filter(value => value.trim() !== '').length;
  const totalCount = placeholders.length;
  const allFilled = filledCount === totalCount && totalCount > 0;

  // Generate final prompt by replacing placeholders
  const finalPrompt = placeholders.reduce((text, placeholder) => {
    const value = values[placeholder] || `[${placeholder}]`;
    return text.replaceAll(`[${placeholder}]`, value);
  }, template);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input fields for placeholders */}
      {placeholders.length > 0 && (
        <div className="grid gap-4 p-6 border border-border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              Fülle die Platzhalter aus:
            </p>
            <p className={`text-xs font-medium transition-colors ${allFilled ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
              {allFilled ? '✓ ' : ''}{filledCount} von {totalCount} ausgefüllt
            </p>
          </div>
          {placeholders.map((placeholder) => (
            <div key={placeholder} className="space-y-2">
              <Label htmlFor={placeholder} className="text-sm font-medium">
                {placeholder}
              </Label>
              <Input
                id={placeholder}
                value={values[placeholder] || ""}
                onChange={(e) =>
                  setValues({ ...values, [placeholder]: e.target.value })
                }
                placeholder={`z.B. ${placeholder.toLowerCase()}`}
                className="bg-background"
              />
            </div>
          ))}
        </div>
      )}

      {/* Generated prompt display */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Generierter Prompt:</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Kopiert!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Kopieren
              </>
            )}
          </Button>
        </div>
        <Textarea
          readOnly
          value={finalPrompt}
          className="min-h-[200px] bg-background font-mono text-sm"
        />
      </div>
    </div>
  );
}