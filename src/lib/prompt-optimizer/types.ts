/**
 * Prompt Optimizer Types
 * 
 * Rule-based prompt optimization system without LLM API costs
 */

export interface PromptScore {
  overall: number; // 0-10
  dimensions: {
    roleDefinition: DimensionScore;
    structureClarity: DimensionScore;
    examples: DimensionScore;
    outputFormat: DimensionScore;
    context: DimensionScore;
    specificity: DimensionScore;
  };
}

export interface DimensionScore {
  score: number; // 0-10
  weight: number; // 0-1
  feedback: string;
  improvements: string[];
}

export interface OptimizationResult {
  original: string;
  optimized: string;
  iterations: OptimizationIteration[];
  finalScore: PromptScore;
}

export interface OptimizationIteration {
  round: number;
  prompt: string;
  score: PromptScore;
  improvements: string[];
}

export interface ImprovementPattern {
  name: string;
  check: (prompt: string) => boolean;
  apply: (prompt: string, context?: string) => string;
  priority: number;
}