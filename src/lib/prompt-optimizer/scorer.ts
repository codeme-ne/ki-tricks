/**
 * Rule-based Prompt Scorer
 * 
 * Scores prompts on 6 dimensions based on OpenAI, Anthropic, and Google best practices.
 * Target score: 9.2+/10 for high-quality prompts
 */

import { PromptScore, DimensionScore } from './types';

// Scoring weights based on importance (sum = 1.0)
const WEIGHTS = {
  roleDefinition: 0.15,    // Clear persona/role
  structureClarity: 0.20,  // Markdown, XML, lists
  examples: 0.15,          // Few-shot learning
  outputFormat: 0.15,      // Explicit format definition
  context: 0.15,           // Relevant context provided
  specificity: 0.20,       // Precise, actionable instructions
};

/**
 * Score a prompt across all dimensions
 */
export function scorePrompt(prompt: string): PromptScore {
  const dimensions = {
    roleDefinition: scoreRoleDefinition(prompt),
    structureClarity: scoreStructureClarity(prompt),
    examples: scoreExamples(prompt),
    outputFormat: scoreOutputFormat(prompt),
    context: scoreContext(prompt),
    specificity: scoreSpecificity(prompt),
  };

  // Calculate weighted overall score
  const overall = Object.entries(dimensions).reduce(
    (sum, [key, dimension]) => {
      const weight = WEIGHTS[key as keyof typeof WEIGHTS];
      return sum + dimension.score * weight;
    },
    0
  );

  return {
    overall: Math.round(overall * 10) / 10, // Round to 1 decimal
    dimensions,
  };
}

/**
 * Dimension 1: Role Definition (15%)
 * Checks if prompt defines the AI's role/persona
 */
function scoreRoleDefinition(prompt: string): DimensionScore {
  const rolePatterns = [
    /\b(?:du bist|you are|als|as a|acting as)\s+(?:ein|eine|an|a)\s+\w+/i,
    /\b(?:role|rolle):/i,
    /\b(?:expert|experte|spezialist|specialist|professional|assistant)/i,
  ];

  const hasRole = rolePatterns.some(pattern => pattern.test(prompt));
  const score = hasRole ? 10 : 0;

  const improvements: string[] = [];
  if (!hasRole) {
    improvements.push('Füge eine Rollendefinition hinzu (z.B. "Du bist ein Experte für...")');
  }

  return {
    score,
    weight: WEIGHTS.roleDefinition,
    feedback: hasRole 
      ? 'Rolle klar definiert ✓' 
      : 'Keine Rollendefinition gefunden',
    improvements,
  };
}

/**
 * Dimension 2: Structure & Clarity (20%)
 * Checks for markdown headers, lists, XML tags, sections
 */
function scoreStructureClarity(prompt: string): DimensionScore {
  let score = 0;
  const improvements: string[] = [];

  // Check for markdown headers (# , ## , ###)
  const hasHeaders = /^#{1,3}\s+\w+/m.test(prompt);
  if (hasHeaders) score += 3;
  else improvements.push('Verwende Markdown-Überschriften zur Strukturierung');

  // Check for lists (-, *, 1., 2., etc)
  const hasLists = /^[\s]*[-*•]\s+\w+|^\d+\.\s+\w+/m.test(prompt);
  if (hasLists) score += 3;
  else improvements.push('Nummeriere Schritte oder nutze Aufzählungen');

  // Check for XML/structured tags
  const hasXML = /<\w+>[\s\S]*?<\/\w+>/.test(prompt);
  if (hasXML) score += 2;
  
  // Check for clear sections (multiple paragraphs)
  const paragraphs = prompt.split(/\n\n+/).length;
  if (paragraphs >= 3) score += 2;
  else improvements.push('Gliedere den Prompt in klare Abschnitte');

  return {
    score: Math.min(score, 10),
    weight: WEIGHTS.structureClarity,
    feedback: score >= 7 ? 'Gut strukturiert ✓' : 'Struktur könnte verbessert werden',
    improvements,
  };
}

/**
 * Dimension 3: Examples (15%)
 * Checks for few-shot learning examples
 */
function scoreExamples(prompt: string): DimensionScore {
  const improvements: string[] = [];
  
  // Count example blocks
  let exampleCount = 0;
  
  // Pattern 1: "**Beispiel X**" or "**Example X**"
  const numberedExamples = prompt.match(/\*\*(?:beispiel|example)\s+\d+/gi);
  if (numberedExamples) exampleCount += numberedExamples.length;
  
  // Pattern 2: "Beispiel:" or "Example:" headers
  const headerExamples = prompt.match(/^#+\s*(?:beispiel|example)/gim);
  if (headerExamples) exampleCount += headerExamples.length;
  
  // Pattern 3: Input/Output patterns
  const ioPatterns = prompt.match(/(?:eingabe|input|frage|question)[:\s]*[\s\S]*?(?:ausgabe|output|antwort|answer)/gi);
  if (ioPatterns) exampleCount += ioPatterns.length;
  
  // Pattern 4: Email examples (Betreff:)
  const emailExamples = prompt.match(/betreff:/gi);
  if (emailExamples) exampleCount += Math.floor(emailExamples.length / 2);
  
  // Pattern 5: Code examples
  const codeExamples = prompt.match(/```[\s\S]*?```/g);
  if (codeExamples) exampleCount += codeExamples.length;
  
  // Pattern 6: XML-tagged examples
  const xmlExamples = prompt.match(/<example[^>]*>/gi);
  if (xmlExamples) exampleCount += xmlExamples.length;

  // Check for QUALITY patterns (Gemini 2.5 Pro recommendations)
  const hasNegativeExample = /type="negative"|SCHLECHTES Beispiel|NICHT nachmachen|bad_output|reasoning_for_bad_output/i.test(prompt);
  const hasEdgeCase = /type="edge_case"|Edge Case|Grenzfall|unklare Anfrage|unklar formuliert/i.test(prompt);
  const hasCoTDemo = /type="chain_of_thought_demonstration"|<thought>|Denkprozess|Analyse:|Schritt für Schritt/i.test(prompt);
  const hasDetailedExamples = prompt.length > 500 && exampleCount > 0; // Examples with substantial content

  // Base score from quantity
  let score = 0;
  if (exampleCount === 0) {
    score = 0;
    improvements.push('Füge 2-3 Few-shot Beispiele hinzu');
  } else if (exampleCount === 1) {
    score = 4;
    improvements.push('Füge mindestens 2 weitere Beispiele hinzu');
  } else if (exampleCount === 2) {
    score = 6;
    improvements.push('Füge ein weiteres Beispiel hinzu für 3+ total');
  } else {
    score = 7; // 3+ examples base
  }

  // Quality bonuses (only if we have examples)
  if (exampleCount > 0) {
    if (hasNegativeExample) {
      score += 1;
    } else {
      improvements.push('Füge ein Negativbeispiel hinzu (zeigt was NICHT zu tun ist)');
    }
    
    if (hasEdgeCase) {
      score += 1;
    } else {
      improvements.push('Füge einen Edge Case hinzu (zeigt Umgang mit unklaren Inputs)');
    }
    
    if (hasCoTDemo) {
      score += 0.5;
    }
    
    if (hasDetailedExamples) {
      score += 0.5;
    } else {
      improvements.push('Mache Beispiele detaillierter und ausführlicher');
    }
  }

  // Cap at 10
  score = Math.min(score, 10);

  return {
    score,
    weight: WEIGHTS.examples,
    feedback: score >= 9
      ? `${exampleCount} hochwertige Beispiele mit Negativbeispiel/Edge Cases ✓` 
      : score >= 7
        ? `${exampleCount} Beispiele gefunden - Qualität verbesserbar`
        : score >= 5
          ? `${exampleCount} Beispiele - braucht mehr Qualität/Quantität`
          : exampleCount >= 1
            ? '1 Beispiel gefunden - zu wenig'
            : 'Keine Beispiele gefunden',
    improvements,
  };
}

/**
 * Dimension 4: Output Format (15%)
 * Checks if desired output format is explicitly defined
 */
function scoreOutputFormat(prompt: string): DimensionScore {
  const improvements: string[] = [];
  
  const formatPatterns = [
    /\b(?:format|formatiere):/i,
    /\b(?:antworte|respond|gib|return|output)\s+(?:in|as|im)\s+(?:folgendem|folgender|following)\s+(?:format|structure)/i,
    /\bJSON\b|\bHTML\b|\bMarkdown\b|\bCSV\b|\bXML\b/,
    /\b(?:struktur|structure|aufbau|layout):/i,
  ];

  const hasFormat = formatPatterns.some(pattern => pattern.test(prompt));
  const score = hasFormat ? 10 : 0;

  if (!hasFormat) {
    improvements.push('Definiere das gewünschte Output-Format explizit');
  }

  return {
    score,
    weight: WEIGHTS.outputFormat,
    feedback: hasFormat 
      ? 'Output-Format definiert ✓' 
      : 'Output-Format nicht spezifiziert',
    improvements,
  };
}

/**
 * Dimension 5: Context (15%)
 * Checks if relevant context/background information is provided
 */
function scoreContext(prompt: string): DimensionScore {
  const improvements: string[] = [];
  
  // Check for rich context elements (Gemini 2.5 Pro patterns)
  const hasPersona = /<persona>|Du bist ein|Du bist eine|Your role is|You are a/i.test(prompt);
  const hasTargetAudience = /<target_audience>|Zielgruppe|target audience|Empfänger|recipients/i.test(prompt);
  const hasPrimaryGoal = /<primary_goal>|Ziel dieser Aufgabe|primary goal|Hauptziel|objective/i.test(prompt);
  const hasConstraints = /<constraints>|DU MUSST|DU DARFST NICHT|MUST|MUST NOT|Rahmenbedingungen/i.test(prompt);
  const hasWorkflowStep = /<workflow_step>|Workflow|Pipeline|Schritt|step in the process/i.test(prompt);
  const hasContextSection = /<kontext>|# Kontext|# Context|Hintergrund/i.test(prompt);
  
  // Additional quality indicators
  const wordCount = prompt.split(/\s+/).length;
  const hasDetailedInfo = wordCount > 100; // Rich context needs substantial text
  
  // Score calculation (0-10 scale)
  let score = 0;
  
  // Basic context section: +2
  if (hasContextSection) score += 2;
  
  // Advanced context elements: +1.5 each (total possible: +7.5)
  if (hasPersona) score += 1.5;
  if (hasTargetAudience) score += 1.5;
  if (hasPrimaryGoal) score += 1.5;
  if (hasConstraints) score += 1.5;
  if (hasWorkflowStep) score += 1.5;
  
  // Bonus for substantial content: +0.5
  if (hasDetailedInfo) score += 0.5;
  
  // Cap at 10
  score = Math.min(score, 10);

  // Generate specific improvement suggestions
  if (!hasPersona) {
    improvements.push('Definiere eine klare Persona/Rolle für das LLM');
  }
  if (!hasTargetAudience) {
    improvements.push('Spezifiziere die Zielgruppe/Empfänger des Outputs');
  }
  if (!hasPrimaryGoal) {
    improvements.push('Erkläre das primäre Ziel und den gewünschten Erfolg');
  }
  if (!hasConstraints) {
    improvements.push('Füge explizite Constraints hinzu (was MUSS/DARF NICHT gemacht werden)');
  }
  if (!hasWorkflowStep) {
    improvements.push('Kläre die Position im Workflow (Entwurf vs. finaler Output)');
  }

  return {
    score,
    weight: WEIGHTS.context,
    feedback: score >= 9
      ? 'Exzellenter, umfassender Kontext mit Persona, Audience, Goal ✓' 
      : score >= 7
        ? 'Guter Kontext mit mehreren relevanten Elementen'
        : score >= 5
          ? 'Basis-Kontext vorhanden, aber ausbaufähig'
          : 'Wenig Kontext - braucht Persona, Audience, Goal, Constraints',
    improvements,
  };
}

/**
 * Dimension 6: Specificity (20%)
 * Checks for precise, actionable instructions (avoids vague language)
 */
function scoreSpecificity(prompt: string): DimensionScore {
  const improvements: string[] = [];
  
  // Vague words that reduce specificity
  const vagueWords = [
    'könnte', 'vielleicht', 'eventuell', 'möglicherweise',
    'might', 'maybe', 'perhaps', 'possibly', 'could',
    'irgendwie', 'somehow', 'ungefähr', 'approximately',
  ];

  const vagueWordCount = vagueWords.reduce(
    (count, word) => count + (prompt.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g'))?.length || 0),
    0
  );

  // Check for concrete action verbs
  const actionVerbs = [
    'erstelle', 'create', 'schreibe', 'write', 'analysiere', 'analyze',
    'liste', 'list', 'erkläre', 'explain', 'berechne', 'calculate',
    'generiere', 'generate', 'extrahiere', 'extract',
  ];

  const hasActionVerbs = actionVerbs.some(verb => 
    new RegExp(`\\b${verb}`, 'i').test(prompt)
  );

  let score = 10;
  score -= vagueWordCount * 2; // -2 points per vague word
  score = Math.max(0, score);
  
  if (!hasActionVerbs) {
    score = Math.min(score, 6);
    improvements.push('Nutze konkrete Aktionsverben (erstelle, analysiere, liste auf...)');
  }

  if (vagueWordCount > 0) {
    improvements.push('Ersetze vage Formulierungen durch spezifische Anweisungen');
  }

  return {
    score,
    weight: WEIGHTS.specificity,
    feedback: score >= 8 
      ? 'Anweisungen sind spezifisch ✓' 
      : score >= 6
        ? 'Anweisungen könnten präziser sein'
        : 'Anweisungen sind zu vage',
    improvements,
  };
}