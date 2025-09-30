import { LLMPromptOptimizerStream } from '@/components/molecules/LLMPromptOptimizerStream';

export default function PromptOptimizerStreamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧠 KI Prompt Optimizer (Live Streaming)
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sieh zu, wie Gemini 2.5 Pro deinen Prompt Schritt für Schritt verbessert.
            100% kostenlos mit sichtbarem Denkprozess!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Live Streaming
            </h3>
            <p className="text-sm text-gray-600">
              Sieh Geminis Denkprozess in Echtzeit - kein Warten auf Ergebnisse
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Thinking Mode
            </h3>
            <p className="text-sm text-gray-600">
              Gemini 2.5 Pro mit dynamischem Reasoning zeigt seine Überlegungen
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">💯</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Komplett Kostenlos
            </h3>
            <p className="text-sm text-gray-600">
              Nutzt Gemini Free Tier - 1M Tokens/Min, keine Kreditkarte nötig
            </p>
          </div>
        </div>

        {/* Main Component */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <LLMPromptOptimizerStream />
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Wie es funktioniert
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <p>
                <strong>Denkprozess sichtbar:</strong> Gemini zeigt live, wie es den Prompt analysiert
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <p>
                <strong>Iterative Verbesserung:</strong> Jede Runde baut auf der vorherigen auf
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <p>
                <strong>Strenge Bewertung:</strong> 9.8/10 ist nahezu unmöglich - ehrliches Feedback
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-blue-600">4.</span>
              <p>
                <strong>Meta-Prompting:</strong> KI optimiert ihren eigenen Prompt dynamisch
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>💡 Tipp:</strong> Starte mit einem einfachen Prompt wie &quot;Schreibe einen Blogpost über KI&quot;
              und sieh zu, wie er in 3 Runden professionell wird!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}