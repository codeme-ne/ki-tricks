import { OptimizedPromptGenerator } from '@/components/molecules/OptimizedPromptGenerator';

export default function PromptTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Prompt Optimizer Live-Test
          </h1>
          <p className="text-gray-600 text-lg">
            Rule-based Prompt Optimization von 2/10 → 9.5+/10
          </p>
          <div className="mt-4 flex gap-4 justify-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">✓</span>
              Examples: 10/10
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">✓</span>
              Context: 6.5+/10
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">✓</span>
              Overall: 9.5+/10
            </div>
          </div>
        </div>

        <OptimizedPromptGenerator 
          trickTitle="Prompt Engineering Test"
          trickCategory="productivity"
        />

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">💡 Test-Prompts zum Ausprobieren:</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-mono">1.</span>
              <span><strong>Sehr schlecht:</strong> &ldquo;Mail schreiben&rdquo;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-mono">2.</span>
              <span><strong>Etwas besser:</strong> &ldquo;Schreibe eine E-Mail an das Team über das neue Update&rdquo;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-mono">3.</span>
              <span><strong>Code-Aufgabe:</strong> &ldquo;Erstelle eine TypeScript Funktion zur Email-Validierung&rdquo;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-mono">4.</span>
              <span><strong>Text-Aufgabe:</strong> &ldquo;Erkläre wie man produktiv mit KI arbeitet&rdquo;</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Patterns: CoT • ReAct • Self-Reflection • Constitutional AI • Negative Examples • Edge Cases
          </p>
        </div>
      </div>
    </div>
  );
}