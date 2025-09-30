/**
 * Prompt Injection Protection
 *
 * Validates user prompts for potential injection attacks and malicious patterns
 */

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  sanitized?: string;
}

/**
 * Suspicious patterns that might indicate prompt injection attempts
 */
const INJECTION_PATTERNS = [
  // System prompt manipulation
  /system\s*:/gi,
  /\b(you are|act as|pretend|roleplay|simulate)\s+(a |an )?((ai|assistant|system|admin|developer))/gi,

  // Instruction override attempts
  /ignore\s+(previous|all|the|above|prior)\s+(instructions?|prompts?|rules?|directives?)/gi,
  /disregard\s+(previous|all|the|above|prior)/gi,
  /forget\s+(everything|all|previous|instructions?)/gi,

  // Role manipulation
  /\[SYSTEM\]/gi,
  /\[INST\]/gi,
  /\<\|im_start\|\>/gi,
  /\<\|im_end\|\>/gi,

  // Attempts to extract system prompts
  /(show|print|display|reveal|output|tell|share)\s+(your\s+)?(system|initial|original|full)\s+(prompt|instructions?|rules?)/gi,
  /what\s+(are|is)\s+your\s+(system\s+)?(prompt|instructions?|rules?)/gi,

  // Jailbreak attempts
  /jailbreak/gi,
  /DAN\s+mode/gi,
  /developer\s+mode/gi,

  // SQL-like injections (though not applicable here, good practice)
  /--\s*$/,
  /\/\*.*\*\//,

  // Encoding attempts to bypass filters
  /\\x[0-9a-f]{2}/gi,
  /\\u[0-9a-f]{4}/gi,
];

/**
 * Maximum allowed prompt length (characters)
 */
const MAX_PROMPT_LENGTH = 8000;

/**
 * Minimum allowed prompt length (characters)
 */
const MIN_PROMPT_LENGTH = 10;

/**
 * Maximum allowed ratio of special characters to total characters
 */
const MAX_SPECIAL_CHAR_RATIO = 0.3;

/**
 * Validates a user prompt for potential injection attacks
 *
 * @param prompt - The user's input prompt
 * @returns ValidationResult with isValid flag and optional reason/sanitized output
 */
export function validatePrompt(prompt: string): ValidationResult {
  // Check if prompt exists
  if (!prompt || typeof prompt !== 'string') {
    return {
      isValid: false,
      reason: 'Prompt must be a non-empty string'
    };
  }

  // Trim whitespace
  const trimmed = prompt.trim();

  // Check length constraints
  if (trimmed.length < MIN_PROMPT_LENGTH) {
    return {
      isValid: false,
      reason: `Prompt must be at least ${MIN_PROMPT_LENGTH} characters`
    };
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return {
      isValid: false,
      reason: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`
    };
  }

  // Check for suspicious patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        reason: 'Prompt contains potentially malicious patterns. Please rephrase your request.'
      };
    }
  }

  // Check special character ratio
  const specialChars = trimmed.match(/[^a-zA-Z0-9\s.,!?;:()\-'"]/g) || [];
  const specialCharRatio = specialChars.length / trimmed.length;

  if (specialCharRatio > MAX_SPECIAL_CHAR_RATIO) {
    return {
      isValid: false,
      reason: 'Prompt contains too many special characters. Please use standard text.'
    };
  }

  // Check for excessive repetition (possible DoS attempt)
  const words = trimmed.split(/\s+/);
  const uniqueWords = new Set(words);
  const repetitionRatio = uniqueWords.size / words.length;

  if (words.length > 50 && repetitionRatio < 0.3) {
    return {
      isValid: false,
      reason: 'Prompt contains excessive repetition. Please provide more varied text.'
    };
  }

  // Sanitize the prompt (remove potential control characters)
  const sanitized = trimmed
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' '); // Normalize whitespace

  return {
    isValid: true,
    sanitized
  };
}

/**
 * Rate-limited validation cache to prevent repeated validation overhead
 * Maps prompt hash to validation result
 */
const validationCache = new Map<string, { result: ValidationResult; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Simple hash function for caching
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Validates a prompt with caching to improve performance
 *
 * @param prompt - The user's input prompt
 * @returns ValidationResult
 */
export function validatePromptCached(prompt: string): ValidationResult {
  const hash = hashString(prompt);
  const cached = validationCache.get(hash);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const result = validatePrompt(prompt);
  validationCache.set(hash, { result, timestamp: Date.now() });

  // Cleanup old cache entries (simple LRU-like behavior)
  if (validationCache.size > 1000) {
    const now = Date.now();
    for (const [key, value] of validationCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        validationCache.delete(key);
      }
    }
  }

  return result;
}