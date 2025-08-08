import { Metadata } from 'next'
import { PageContainer } from '@/components/layout'
import { BackButton } from '@/components/atoms'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - KI Tricks Platform',
  description: 'Datenschutzerklärung der KI Tricks Platform. Informationen zum Umgang mit personenbezogenen Daten.',
  robots: 'noindex, follow',
}

export default function DatenschutzPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Datenschutzerklärung</h1>
        
        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. 
              Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem 
              Text aufgeführten Datenschutzerklärung.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Datenerfassung auf dieser Website</h3>
            <p className="mb-2"><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
            <p className="mb-4">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen 
              Kontaktdaten können Sie dem Abschnitt &bdquo;Hinweis zur Verantwortlichen Stelle&ldquo; in dieser 
              Datenschutzerklärung entnehmen.
            </p>

            <p className="mb-2"><strong>Wie erfassen wir Ihre Daten?</strong></p>
            <p className="mb-4">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann 
              es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
            </p>
            <p className="mb-4">
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website 
              durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. 
              Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser 
              Daten erfolgt automatisch, sobald Sie diese Website betreten.
            </p>

            <p className="mb-2"><strong>Wofür nutzen wir Ihre Daten?</strong></p>
            <p className="mb-4">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu 
              gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>

            <p className="mb-2"><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong></p>
            <p className="mb-4">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck 
              Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, 
              die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur 
              Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft 
              widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung 
              der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein 
              Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Hosting</h2>
            <p className="mb-4">
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
            </p>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Vercel</h3>
            <p className="mb-4">
              Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA 
              (nachfolgend: &bdquo;Vercel&ldquo;) gehostet. Wenn Sie unsere Website besuchen, werden Ihre 
              personenbezogenen Daten (IP-Adresse, Browsertyp, Betriebssystem, Referrer-URL, 
              Hostname des zugreifenden Rechners sowie Zeitpunkt der Serveranfrage) an Server von 
              Vercel übertragen.
            </p>
            <p className="mb-4">
              Die Verwendung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir 
              haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer 
              Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die 
              Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 
              Abs. 1 TTDSG.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Datenschutz</h3>
            <p className="mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir 
              behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen 
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Hinweis zur verantwortlichen Stelle</h3>
            <p className="mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="mb-4">
              Lukas Zangerl<br />
              E-Mail: zangerl.luk@gmail.com
            </p>
            <p className="mb-4">
              Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder 
              gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen 
              Daten (z.B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Speicherdauer</h3>
            <p className="mb-4">
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt 
              wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die 
              Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder 
              eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern 
              wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen 
              Daten haben (z.B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im 
              letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
            <p className="mb-4">
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. 
              Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit 
              der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Recht auf Datenübertragbarkeit</h3>
            <p className="mb-4">
              Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung 
              eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem 
              gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte 
              Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, 
              soweit es technisch machbar ist.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Datenerfassung auf dieser Website</h2>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Server-Log-Dateien</h3>
            <p className="mb-4">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
              Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="list-disc pl-8 mb-4">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="mb-4">
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
            </p>
            <p className="mb-4">
              Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der 
              Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien 
              Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files 
              erfasst werden.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Kontaktformular</h3>
            <p className="mb-4">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
              Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks 
              Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese 
              Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            <p className="mb-4">
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, 
              sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur 
              Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen 
              beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven 
              Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf 
              Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Analyse-Tools und Werbung</h2>
            <p className="mb-4">
              Derzeit verwenden wir keine Analyse-Tools oder Werbung auf dieser Website. Sollten wir 
              in Zukunft solche Dienste einsetzen, werden wir diese Datenschutzerklärung 
              entsprechend aktualisieren und Sie darüber informieren.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Newsletter</h2>
            <p className="mb-4">
              Derzeit bieten wir keinen Newsletter-Service an. Sollten wir in Zukunft einen 
              Newsletter anbieten, werden wir diese Datenschutzerklärung entsprechend aktualisieren.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Plugins und Tools</h2>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Google Fonts (lokales Hosting)</h3>
            <p className="mb-4">
              Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Google 
              Fonts. Die Google Fonts sind lokal installiert. Eine Verbindung zu Servern von Google 
              findet dabei nicht statt.
            </p>
          </section>

          <section className="mb-8">
            <p className="text-sm text-neutral-600">
              Stand: Januar 2025
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  )
}