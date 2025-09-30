/**
 * LLM-Based Prompt Optimizer Types
 * 
 * Dynamic prompt optimization using Gemini 2.5 Flash (FREE)
 * Free tier: 1M tokens/min, unlimited requests
 */

export interface LLMOptimizationRound {
  round: number;
  status: 'analyzing' | 'improving' | 'complete';
  currentPrompt: string;
  analysis?: {
    clarity: number; // 0-10
    specificity: number; // 0-10
    context: number; // 0-10
    structure: number; // 0-10
    outputFormat: number; // 0-10
  };
  weaknesses?: string[];
  improvements?: string[];
  optimizedPrompt?: string;
  overallScore?: number; // 0-10
}

export interface LLMOptimizationConfig {
  rounds: number; // 3-5 recommended
  model: 'gemini-2.0-flash-exp' | 'gemini-1.5-flash';
  temperature: number; // 0.7 default
}

export interface StreamEvent {
  type: 'round-start' | 'analysis' | 'improvement' | 'complete' | 'error';
  data: LLMOptimizationRound | { message: string };
}

export interface MetaPromptContext {
  currentRound: number;
  totalRounds: number;
  previousPrompt?: string;
  previousAnalysis?: LLMOptimizationRound['analysis'];
}