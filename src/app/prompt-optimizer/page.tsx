import { Suspense } from 'react';
import { LLMPromptOptimizer } from '@/components/molecules';

export const metadata = {
  title: 'KI Prompt Optimizer - Verbessere deine Prompts automatisch',
  description: 'Kostenloser KI-gestützter Prompt Optimizer. Verbessere deine Prompts iterativ mit Gemini 2.5 Flash - komplett kostenlos!',
};

export default function PromptOptimizerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 KI Prompt Optimizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verbessere deine Prompts automatisch mit KI. 
            <span className="font-semibold text-purple-600"> Komplett kostenlos</span> dank Gemini 2.5 Flash.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Wie funktioniert&apos;s?
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">1.</span>
              <span>Gib deinen simplen Prompt ein (z.B. &ldquo;Schreibe einen Blogpost über KI&rdquo;)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">2.</span>
              <span>Die KI analysiert deinen Prompt in 3-5 iterativen Runden</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">3.</span>
              <span>Jede Runde verbessert Clarity, Specificity, Context, Structure und Output Format</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">4.</span>
              <span>Du erhältst einen hochoptimierten, professionellen Prompt</span>
            </li>
          </ul>
        </div>

        {/* Main Component */}
        <Suspense fallback={
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Lade Optimizer...</p>
            </div>
          </div>
        }>
          <LLMPromptOptimizer rounds={3} />
        </Suspense>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">100% Kostenlos</h3>
            <p className="text-sm text-gray-600">
              Nutzt Gemini 2.5 Flash Free Tier - keine Kreditkarte nötig
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Dynamisch</h3>
            <p className="text-sm text-gray-600">
              Keine Templates - reagiert spezifisch auf deinen Kontext
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Transparent</h3>
            <p className="text-sm text-gray-600">
              Sieh jeden Verbesserungsschritt mit Erklärungen
            </p>
          </div>
        </div>

        {/* Setup Info */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Setup erforderlich:</span> Du benötigst einen kostenlosen Gemini API Key.
            <br />
            Siehe <code className="bg-yellow-100 px-1.5 py-0.5 rounded text-xs">GEMINI_SETUP.md</code> für eine Schritt-für-Schritt-Anleitung.
          </p>
        </div>
      </div>
    </div>
  );
}