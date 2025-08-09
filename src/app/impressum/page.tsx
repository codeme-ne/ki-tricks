import { Metadata } from 'next'
import { PageContainer } from '@/components/layout'
import { BackButton } from '@/components/atoms'

export const metadata: Metadata = {
  title: 'Impressum - KI Tricks Platform',
  description: 'Impressum und rechtliche Informationen der KI Tricks Platform.',
  robots: 'noindex, follow',
}

export default function ImpressumPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Impressum</h1>
        
        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
            <p className="mb-2">
              Lukas Zangerl<br />
              zangerl.luk@gmail.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Kontakt</h2>
            <p className="mb-2">
              E-Mail: zangerl.luk@gmail.com<br />
              GitHub: <a href="https://github.com/codeme-ne" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">codeme-ne</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="mb-2">
              Lukas Zangerl<br />
              zangerl.luk@gmail.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">EU-Streitschlichtung</h2>
            <p className="mb-4">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer"> https://ec.europa.eu/consumers/odr/</a>.
            </p>
            <p className="mb-2">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Haftungsausschluss</h2>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Haftung für Inhalte</h3>
            <p className="mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
              Tätigkeit hinweisen.
            </p>
            <p className="mb-4">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
              allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
              erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
              Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend 
              entfernen.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Haftung für Links</h3>
            <p className="mb-4">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
              Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf 
              mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der 
              Verlinkung nicht erkennbar.
            </p>
            <p className="mb-4">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete 
              Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von 
              Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Urheberrecht</h3>
            <p className="mb-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
              Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind 
              nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p>
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die 
              Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche 
              gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, 
              bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen 
              werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  )
}