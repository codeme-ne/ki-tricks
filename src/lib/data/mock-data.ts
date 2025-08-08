import { KITrick, Category, Difficulty, Impact } from '../types/types'

// Helper function to generate slugs
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const map: { [key: string]: string } = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }
      return map[match] || match
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Mock data for KI tricks - Revised for 98.5/100 Quality Standard
export const mockTricks: KITrick[] = [
  {
    id: '1',
    title: 'Der "Leaf Node" Trick: Tausende Zeilen Code sicher mergen',
    description: 'Nutze die von Anthropic erprobte "Leaf Node"-Strategie, um riesige Mengen KI-generierten Codes sicher in Production zu integrieren, ohne jede Zeile manuell reviewen zu müssen.',
    category: 'programming',
    difficulty: 'advanced',
    tools: ['Claude 3.5 Sonnet', 'GitHub Copilot'],
    timeToImplement: '60 Minuten Setup',
    impact: 'high',
    steps: [
      'Schritt 1: Identifiziere eine "Leaf Node" in deiner Codebase – ein Modul ohne Abhängigkeiten (z.B. eine Parser-Funktion, ein Daten-Transformator).',
      'Schritt 2: Definiere eine strenge Test-Suite mit Unit-Tests, Integrationstests und Property-based Tests für diese Node, *bevor* du Code generieren lässt.',
      'Schritt 3: Erstelle einen detaillierten Prompt mit dem gesamten Kontext, den Schnittstellen und den Tests, die bestanden werden müssen.',
      'Schritt 4: Lass die KI das Modul implementieren. Validiere das Ergebnis *ausschließlich* durch Ausführen der Test-Suite. Wenn alle Tests grün sind, merge den Code.'
    ],
    examples: [
      'Ein Entwicklerteam migrierte ein 8.000 Zeilen Legacy-Logging-System in 2 Tagen statt 3 Wochen, indem es nur die Testergebnisse verifizierte.',
      'Anthropic selbst hat mit dieser Methode ein 22.000 Zeilen umfassendes Reinforcement-Learning-System in ihre Codebase integriert.'
    ],
    slug: generateSlug('Der Leaf Node Trick Tausende Zeilen Code sicher mergen'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Dieser Ansatz behandelt die KI als "Blackbox". Er basiert auf dem Prinzip der testgetriebenen Entwicklung (TDD) und der Abstraktion, bei der die Korrektheit einer Implementierung ausschließlich durch ihre extern beobachtbaren Ergebnisse (die Tests) nachgewiesen wird, nicht durch die Inspektion des internen Codes.'
  },
  {
    id: '2',
    title: 'Der 5-Minuten-Trick für interaktive Dashboards ohne Code',
    description: 'Verwandle komplexe PDFs oder CSV-Dateien in interaktive Web-Dashboards, ohne eine Zeile Code zu schreiben, indem du Claudes "Artifacts"-Feature nutzt.',
    category: 'data-analysis',
    difficulty: 'beginner',
    tools: ['Claude 3.5 Sonnet'],
    timeToImplement: '5-10 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Aktiviere "Artifacts" in den Claude-Einstellungen.',
      'Schritt 2: Lade eine Datendatei (z.B. `sales_data.csv`) oder ein PDF hoch.',
      'Schritt 3: Verwende einen präzisen Prompt. Kopiere und passe dies an: "Analysiere die hochgeladene Datei. Erstelle ein interaktives Dashboard mit 3 Tabs: 1. Eine Zusammenfassung der wichtigsten Kennzahlen. 2. Ein Balkendiagramm, das [Metrik A] pro [Kategorie B] zeigt. 3. Eine filterbare Tabelle der Rohdaten."',
      'Schritt 4: Claude generiert den Code und zeigt das Dashboard im "Artifacts"-Fenster an. Bei Fehlern, nutze den Befehl: "Bitte behebe den Darstellungsfehler im Code."'
    ],
    examples: [
      'Ein Marketing-Team verwandelte einen 50-seitigen Marktforschungs-PDF in ein Dashboard mit klickbaren Reitern für Demografie, Trends und Kernaussagen.',
      'Ein Vertriebsleiter visualisierte eine CSV-Datei mit Quartalszahlen in 5 Minuten als interaktive Karte mit Verkaufsregionen.'
    ],
    slug: generateSlug('Der 5-Minuten-Trick für interaktive Dashboards ohne Code'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Das Gehirn verarbeitet visuelle Informationen 60.000-mal schneller als Text. Dieser Trick nutzt das Prinzip der "kognitiven Entlastung" (Cognitive Offloading), indem er komplexe Daten in eine leicht verdauliche, interaktive Form umwandelt, die das Arbeitsgedächtnis schont.'
  },
  {
    id: '4',
    title: 'Der "Klon-meinen-Stil"-Trick mit 3 Beispielen',
    description: 'Bringe einer KI bei, in deinem exakten Schreibstil zu kommunizieren – perfekt für die Automatisierung von E-Mails oder die Skalierung von Marken-Content, ohne die persönliche Note zu verlieren.',
    category: 'content-creation',
    difficulty: 'beginner',
    tools: ['ChatGPT-4o', 'Claude 3.5 Sonnet'],
    timeToImplement: '10 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Sammle 3 repräsentative Textbeispiele deines gewünschten Stils (z.B. drei von dir geschriebene E-Mails oder Blog-Absätze).',
      'Schritt 2: Nutze einen strukturierten Prompt, der die Beispiele klar kennzeichnet. Kopiere und passe diese Vorlage an:',
      '"""',
      'Analysiere den Schreibstil in den folgenden drei Beispielen. Achte auf Tonalität, Satzstruktur, Wortwahl und Formatierung.',
      '<beispiel1>[Text von Beispiel 1 hier einfügen]</beispiel1>',
      '<beispiel2>[Text von Beispiel 2 hier einfügen]</beispiel2>',
      '<beispiel3>[Text von Beispiel 3 hier einfügen]</beispiel3>',
      'Schreibe nun einen neuen Text über [Dein Thema] in exakt diesem Stil.',
      '"""',
      'Schritt 3: Führe den Prompt aus und überprüfe, wie gut die KI deinen Stil getroffen hat.',
      'Schritt 4: Verfeinere bei Bedarf, indem du der KI sagst, was sie noch besser machen soll (z.B. "Sei noch etwas formeller.").'
    ],
    examples: [
      'Ein CEO trainierte eine KI auf seinen E-Mail-Stil, sodass sein Assistent 80% seiner Korrespondenz mit authentisch klingenden Entwürfen vorbereiten konnte.',
      'Ein Marketing-Team stellte die Markenkonsistenz über 5 verschiedene Social-Media-Kanäle sicher, indem alle Teammitglieder den gleichen Stil-Prompt verwendeten.'
    ],
    slug: generateSlug('Der Klon-meinen-Stil-Trick mit 3 Beispielen'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Diese Methode, bekannt als "Few-Shot Learning", ist extrem effektiv. Indem du der KI mehrere Beispiele gibst, kann sie die stilistischen Muster (Vektoren im "Latent Space") extrahieren und auf neue Inhalte anwenden. Dies ist weitaus präziser als eine bloße Beschreibung wie "schreibe professionell".'
  },
  {
    id: '5',
    title: '"Chain of Thought": Der Google-Trick für komplexe Probleme',
    description: 'Bringe eine KI dazu, komplexe Probleme schrittweise zu "durchdenken", anstatt sofort eine Antwort zu geben. Diese von Google AI entwickelte Methode verbessert die logische Genauigkeit dramatisch.',
    category: 'productivity',
    difficulty: 'intermediate',
    tools: ['ChatGPT-4o', 'Claude 3.5 Sonnet'],
    timeToImplement: '10 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Formuliere deine komplexe Frage (z.B. "Sollte mein Startup auf ein 4-Tage-Woche umstellen?").',
      'Schritt 2: Hänge am Ende deines Prompts den magischen Satz an: "Denke schrittweise darüber nach und präsentiere deine Argumentation, bevor du zu einem Ergebnis kommst."',
      'Schritt 3: Analysiere die Gedankenkette der KI. Oft findest du hier wertvollere Einsichten als im Endergebnis.',
      'Schritt 4: Fordere eine finale Zusammenfassung basierend auf der besten Argumentationslinie an: "Basierend auf Punkt 3 deiner Analyse, formuliere eine finale Empfehlung."'
    ],
    examples: [
      'Ein Gründer analysierte die Vor- und Nachteile einer Preisänderung und entdeckte einen kritischen Fehler in seiner ursprünglichen Annahme durch die Gedankenkette der KI.',
      'Ein Student löste eine komplexe Physikaufgabe, indem er die KI zwang, jeden Schritt der Herleitung zu erklären, und so den Fehler im Rechenweg fand.'
    ],
    slug: generateSlug('Chain of Thought Der Google-Trick für komplexe Probleme'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Die "Chain of Thought"-Methode (Wei et al., 2022, Google AI) zwingt das Sprachmodell, ein Problem in logische Zwischenschritte zu zerlegen. Dies stellt mehr Rechenressourcen für das Problem zur Verfügung und reduziert die Wahrscheinlichkeit von Fehlschlüssen, da jeder Schritt auf dem vorherigen aufbaut.'
  },
  {
    id: '6',
    title: 'Claudes versteckte Power-Settings für maximale Effizienz',
    description: 'Konfiguriere Claude wie ein Profi mit diesen vier oft übersehenen Einstellungen, um Reibungsverluste zu minimieren und deinen Workflow zu beschleunigen.',
    category: 'productivity',
    difficulty: 'beginner',
    tools: ['Claude 3.5 Sonnet'],
    timeToImplement: '5 Minuten',
    impact: 'medium',
    steps: [
      'Schritt 1 (Fokussiertes Arbeiten): Aktiviere "Artifacts" in den Einstellungen. Claude wird Code oder lange Texte in einem separaten Fenster ausgeben, während die Konversation sauber bleibt.',
      'Schritt 2 (Relevante Hilfe): Schalte "CSV Chat Suggestions" ein, aber deaktiviere die generischen "Prompt Examples", um die Benutzeroberfläche aufzuräumen.',
      'Schritt 3 (Nahtloser Datenzugriff): Verbinde dein Google Drive (falls im Pro-Plan verfügbar), um direkt auf Dokumente und Tabellen zugreifen zu können.',
      'Schritt 4 (Sofort-Analyse): Aktiviere das "Analysis Tool" unter "Feature Preview", damit Claude automatisch Diagramme und Analysen für hochgeladene Daten erstellen kann.'
    ],
    examples: [
      'Ein Entwickler debuggte einen Code-Schnipsel im Artifacts-Fenster, während er die Konversation im Hauptfenster weiterführte, was ihm 15 Minuten sparte.',
      'Ein Analyst lud eine CSV-Datei hoch und erhielt automatisch ein interaktives Diagramm, ohne danach fragen zu müssen, was den Analyseprozess von 30 auf 5 Minuten verkürzte.'
    ],
    slug: generateSlug('Claudes versteckte Power-Settings für maximale Effizienz'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Dieser Trick reduziert die "kognitive Last" (Cognitive Load). Indem du die Benutzeroberfläche optimierst und Arbeitsschritte automatisierst, musst du weniger mentale Energie für die Bedienung des Tools aufwenden und kannst dich vollständig auf die Problemlösung konzentrieren.'
  },
  {
    id: '7',
    title: 'Der KI-Journaling-Trick für strukturiertes Selbst-Coaching',
    description: 'Nutze die KI als unvoreingenommenen Gesprächspartner, um deine Gedanken zu sortieren, Entscheidungen zu treffen oder dich auf schwierige Gespräche vorzubereiten.',
    category: 'learning',
    difficulty: 'beginner',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '10-15 Minuten pro Sitzung',
    impact: 'medium',
    steps: [
      'Schritt 1: Definiere dein Ziel für die Sitzung (z.B. "Ich möchte Klarheit über meine Karriereziele gewinnen").',
      'Schritt 2: Verwende einen strukturierten Coaching-Prompt. Kopiere und passe dies an: "Agiere als mein professioneller Coach. Stelle mir nacheinander die folgenden Fragen, um mir bei meinem Ziel zu helfen: [Dein Ziel]. 1. Was ist die Situation objektiv betrachtet? 2. Welche Emotionen verbinde ich damit? 3. Was wäre ein ideales Ergebnis in 6 Monaten? 4. Was ist der kleinste, erste Schritt, den ich morgen machen kann?"',
      'Schritt 3: Beantworte die Fragen der KI ehrlich und ausführlich.',
      'Schritt 4: Bitte die KI am Ende, deine Antworten in einer klaren Zusammenfassung und einem Aktionsplan zu bündeln.'
    ],
    examples: [
      'Eine Managerin bereitete ein schwieriges Mitarbeitergespräch vor, indem sie ihre Argumente und möglichen Gegenargumente mit der KI strukturierte, was zu einem konstruktiven Gespräch führte.',
      'Ein Gründer nutzte diesen Trick, um die Vor- und Nachteile einer strategischen Entscheidung abzuwägen und kam zu einer klareren, datengestützten Schlussfolgerung.'
    ],
    slug: generateSlug('Der KI-Journaling-Trick für strukturiertes Selbst-Coaching'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Die Methode basiert auf den nachgewiesenen Vorteilen des "expressiven Schreibens" (expressive writing), das von Dr. James W. Pennebaker erforscht wurde. Die KI agiert als strukturierender Faktor, der den Prozess anleitet und hilft, Gedanken zu externalisieren, was die emotionale Verarbeitung und logische Analyse verbessert.'
  },
  {
    id: '8',
    title: 'Der "Vom Konzept zum Code"-Trick: MVP in 48 Stunden',
    description: 'Übersetze deine Geschäftsidee direkt in eine funktionale Code-Struktur und Boilerplate, indem du die KI als Architekt und Junior-Entwickler zugleich einsetzt.',
    category: 'business',
    difficulty: 'intermediate',
    tools: ['Claude 3.5 Sonnet', 'ChatGPT-4o'],
    timeToImplement: '2-3 Stunden',
    impact: 'high',
    steps: [
      'Schritt 1: Definiere die 3 wichtigsten User Stories deines MVPs (z.B. "Als Nutzer möchte ich mich registrieren...").',
      'Schritt 2: Gib sie an die KI mit dem Architektur-Prompt: "Agiere als Senior Software Architect. Basierend auf diesen 3 User Stories, schlage einen passenden Tech-Stack (z.B. Next.js, Supabase) und eine optimale Dateistruktur vor."',
      'Schritt 3: Wähle eine Datei aus der Struktur und lasse den Boilerplate-Code generieren: "Erstelle den React-Komponentencode für `src/components/AuthForm.tsx` basierend auf User Story 1. Inkludiere Platzhalter für die API-Calls."',
      'Schritt 4: Wiederhole Schritt 3 für alle Kernkomponenten. Du erhältst ein komplettes Code-Gerüst, das du nur noch verbinden musst.'
    ],
    examples: [
      'Ein Solo-Gründer erstellte einen klickbaren Prototyp für eine SaaS-App an einem Wochenende und konnte am Montag bereits Investoren-Feedback einholen.',
      'Ein Team sparte die erste Woche eines Sprints, indem es die gesamte Anwendungsstruktur und alle UI-Komponenten von der KI generieren ließ.'
    ],
    slug: generateSlug('Der Vom Konzept zum Code Trick MVP in 48 Stunden'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Die KI ist außergewöhnlich gut darin, etablierte Muster und "Boilerplate"-Code zu generieren, was oft 50-70% der initialen Entwicklungsarbeit ausmacht. Dieser Trick automatisiert den repetitiven Teil des Programmierens und erlaubt es dem Menschen, sich auf die einzigartige Geschäftslogik und Architektur zu konzentrieren.'
  },
  {
    id: '9',
    title: 'Der Harvard-Workflow: Research Papers in 2 Tagen statt 2 Wochen',
    description: 'Nutze einen strukturierten KI-Workflow, der von Forschern an Institutionen wie Harvard verfeinert wurde, um den Prozess von der Recherche bis zum fertigen Paper drastisch zu beschleunigen.',
    category: 'learning',
    difficulty: 'intermediate',
    tools: ['Perplexity', 'Claude 3.5 Sonnet', 'Zotero'],
    timeToImplement: '30 Minuten pro Paper',
    impact: 'high',
    steps: [
      'Schritt 1 (Recherche & Synthese): Nutze Perplexity im "Academic"-Fokus, um 10-15 Schlüssel-Paper zu deinem Thema zu finden. Lass es eine annotierte Bibliografie erstellen.',
      'Schritt 2 (Gliederung): Gib die Zusammenfassungen an Claude weiter mit dem Prompt: "Erstelle basierend auf diesen Quellen eine detaillierte Gliederung für ein Research Paper mit den Sektionen: Einleitung, Literaturübersicht, Methodik, Diskussion, Fazit."',
      'Schritt 3 (Schreiben): Schreibe jede Sektion einzeln, indem du Claude den relevanten Teil der Gliederung und die zugehörigen Quellen gibst.',
      'Schritt 4 (Zitieren & Verfeinern): Lass Claude den gesamten Text auf akademischen Stil, Kohärenz und korrekte Zitationen (im BibTeX-Format für Zotero) überprüfen.'
    ],
    examples: [
      'Eine Doktorandin schaffte ihren Literaturreview für die Dissertation (120 Quellen) in einer Woche statt der geplanten drei Monate.',
      'Ein Student verbesserte seine Note für eine Seminararbeit von 2,7 auf 1,3, weil die Argumentation durch die KI-Strukturierung wesentlich klarer war.'
    ],
    slug: generateSlug('Der Harvard-Workflow Research Papers in 2 Tagen statt 2 Wochen'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Der Prozess trennt kognitive Aufgaben rigoros: Such- und Synthesephase (Perplexity) von der Strukturierungs- und Formulierungsphase (Claude). Wie in einer Studie der Harvard Business School gezeigt wurde, führt diese "Mensch-KI-Zentaur"-Arbeitsteilung zu signifikant besseren und schnelleren Ergebnissen bei komplexen Wissensaufgaben.'
  },
  {
    id: '10',
    title: 'Führe Code-Reviews wie ein CTO (ohne den Code zu lesen)',
    description: 'Bewerte die Qualität und Risiken von Code-Änderungen, ohne selbst programmieren zu können. Dieser Trick ermöglicht es Product Managern und Gründern, technische Diskussionen auf strategischer Ebene zu führen.',
    category: 'business',
    difficulty: 'intermediate',
    tools: ['Claude 3.5 Sonnet', 'ChatGPT-4o'],
    timeToImplement: '15 Minuten pro Review',
    impact: 'high',
    steps: [
      'Schritt 1: Bitte den Entwickler, dir den Code-Abschnitt (Pull Request) zu schicken. Kopiere den Code.',
      'Schritt 2 (Zweck verstehen): Gib den Code an die KI mit dem Prompt: "Fasse den Zweck dieses Codes in drei einfachen Sätzen zusammen. Was sind die Inputs und was sind die erwarteten Outputs?"',
      'Schritt 3 (Risiken bewerten): Frage weiter: "Welche sind die 3 größten Risiken oder potenziellen Edge Cases in diesem Ansatz? Stelle deine Antwort als Tabelle dar."',
      'Schritt 4 (Strategische Diskussion): Nutze die Antworten der KI, um gezielte, strategische Fragen zu stellen, z.B. "Wie haben wir den von dir genannten Edge Case X in unseren Tests abgedeckt?"'
    ],
    examples: [
      'Ein Product Owner identifizierte eine kritische Lücke in der Fehlerbehandlung eines neuen Features, ohne eine Zeile Code selbst lesen zu müssen.',
      'Eine Gründerin konnte in einer technischen Diskussion mit ihrem Freelancer fundierte Fragen stellen, was zu einer deutlich robusteren Implementierung führte.'
    ],
    slug: generateSlug('Führe Code-Reviews wie ein CTO ohne den Code zu lesen'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Dieser Trick nutzt das Prinzip der "Abstraktion". Du ignorierst die Implementierungsdetails (den Code) und konzentrierst dich auf die übergeordneten Konzepte: Zweck, Schnittstellen und Risiken. Die KI agiert als technischer Übersetzer, der den Code in verständliche strategische Konzepte umwandelt.'
  },
  {
    id: '12',
    title: 'Der "Vibe Coding" Trick für schnelle Prototypen',
    description: 'Implementiere die "Vibe Coding" Methodik von Anthropic, bei der du der KI das "Was" und "Warum" erklärst und ihr das "Wie" der Implementierung überlässt, um Ideen blitzschnell zu testen.',
    category: 'programming',
    difficulty: 'advanced',
    tools: ['Claude Code'],
    timeToImplement: '30-60 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Beschreibe das gewünschte Endresultat aus Nutzersicht. "Ich möchte einen Button, der bei Klick eine Konfetti-Animation auslöst."',
      'Schritt 2: Gib der KI den relevanten Kontext (z.B. die Datei, in der der Button platziert werden soll) mit `@`-Mentions.',
      'Schritt 3: Formuliere klare Akzeptanzkriterien. "Die Animation muss flüssig sein und nach 3 Sekunden enden."',
      'Schritt 4: Lass die KI den Code generieren und teste das Ergebnis. Korrigiere, indem du das Verhalten beschreibst, nicht den Code ("Das Konfetti ist zu langsam").'
    ],
    examples: [
      'Ein Entwickler bei Anthropic setzte während einer Verletzungspause Projekte fort, indem er nur noch mit seiner Stimme und "Vibe Coding" programmierte.',
      'Ein Team baute 5 verschiedene Prototypen für ein neues Feature an einem Nachmittag, um schnelles Nutzerfeedback zu erhalten.'
    ],
    slug: generateSlug('Der Vibe Coding Trick für schnelle Prototypen'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Vibe Coding behandelt die KI als extrem schnellen Junior-Entwickler. Indem du dich auf die Spezifikation und Verifikation konzentrierst (die menschliche Stärke), überlässt du die schnelle, aber manchmal fehleranfällige Code-Generierung der KI. Dies maximiert die Iterationsgeschwindigkeit.'
  },
  {
    id: '13',
    title: 'Die 15-Minuten Planungs-Konversation',
    description: 'Führe vor jeder komplexen Programmieraufgabe eine separate 15-minütige Planungs-Konversation mit der KI, um die Erfolgsquote laut Anthropic um 90% zu erhöhen.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude Code'],
    timeToImplement: '15-20 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Starte eine **neue, leere** Konversation mit der KI, die nur der Planung dient.',
      'Schritt 2: Erkunde gemeinsam die Codebase (`@`-Mention relevanter Dateien) und diskutiere mögliche Lösungsansätze, Patterns und Constraints.',
      'Schritt 3: Lass die KI einen detaillierten, schrittweisen Implementierungsplan als Markdown-Datei erstellen.',
      'Schritt 4: Starte eine **weitere neue** Konversation für die Implementierung und nutze den erstellten Plan als erste Anweisung.'
    ],
    examples: [
      'Ein Solo-Entwickler implementierte ein komplettes Bezahlsystem fehlerfrei in 4 Stunden statt der geschätzten 2 Tage.',
      'Ein Team vermeidet kostspielige Architekturfehler, indem es vor jeder Implementierung einen KI-generierten Plan im Team reviewt.'
    ],
    slug: generateSlug('Die 15-Minuten Planungs-Konversation'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Dieser Prozess trennt die konzeptionelle Arbeit (Planung) von der ausführenden Arbeit (Codierung). Dies verhindert, dass die KI zu früh auf einen Lösungsweg festgelegt wird und ermöglicht eine strategischere, durchdachtere Herangehensweise, was die Qualität des Endergebnisses signifikant verbessert.'
  },
  {
    id: '16',
    title: 'Der KI-als-Pair-Programmer Lern-Hack',
    description: 'Lerne neue Technologien 4x schneller, indem du die KI nach jeder wichtigen Code-Entscheidung fragst: "Warum hast du X statt Y gewählt?"',
    category: 'learning',
    difficulty: 'beginner',
    tools: ['Claude Code', 'ChatGPT-4o'],
    timeToImplement: 'Kontinuierlich',
    impact: 'high',
    steps: [
      'Schritt 1: Lass die KI einen Code-Block für eine dir unbekannte Technologie generieren.',
      'Schritt 2: Stelle die entscheidende Frage: "Erkläre mir die wichtigste Zeile in diesem Code und warum du sie so geschrieben hast."',
      'Schritt 3: Fordere Alternativen an: "Welche anderen zwei Ansätze hätte es gegeben und was sind ihre jeweiligen Vor- und Nachteile?"',
      'Schritt 4: Fasse die Erklärung in deinen eigenen Worten zusammen und frage die KI, ob dein Verständnis korrekt ist.'
    ],
    examples: [
      'Ein Junior-Entwickler lernte die Grundlagen von React in 2 Wochen statt 2 Monaten, indem er systematisch jede Code-Entscheidung der KI hinterfragte.',
      'Eine erfahrene Python-Entwicklerin entdeckte 12 neue, effizientere Bibliotheken, indem sie die KI bat, ihre Standard-Lösungen zu "challengen".'
    ],
    slug: generateSlug('Der KI-als-Pair-Programmer Lern-Hack'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Diese Methode kombiniert aktives Lernen mit dem "Protégé-Effekt". Indem du die KI zwingst, ihre Entscheidungen zu rechtfertigen, lernst du nicht nur die Syntax, sondern auch die zugrundeliegenden Konzepte und Design-Patterns. Du lernst wie ein Senior-Entwickler zu denken.'
  },
  {
    id: '19',
    title: 'Der "Error Self-Correction"-Trick für perfektes Debugging',
    description: 'Lass die KI ihre eigenen Fehler beheben, anstatt manuell zu debuggen. Dieser einfache Workflow spart 90% der Zeit, die normalerweise für die Fehlersuche aufgewendet wird.',
    category: 'programming',
    difficulty: 'beginner',
    tools: ['Claude Code', 'ChatGPT-4o'],
    timeToImplement: '1 Minute pro Fehler',
    impact: 'high',
    steps: [
      'Schritt 1: Wenn ein Fehler auftritt, kopiere die **komplette** Fehlermeldung aus dem Terminal oder der Browser-Konsole.',
      'Schritt 2: Gib den relevanten Code-Abschnitt und die Fehlermeldung an die KI.',
      'Schritt 3: Verwende den einfachen Prompt: "Behebe diesen Fehler."',
      'Schritt 4: Für tiefere Einblicke, frage nach: "Erkläre mir die Ursache dieses Fehlers, als wäre ich fünf Jahre alt."'
    ],
    examples: [
      'Ein Entwickler behob 47 TypeScript-Typfehler in einer neuen Datei in unter 10 Minuten, eine Aufgabe, die manuell über eine Stunde gedauert hätte.',
      'Ein Team reduzierte die durchschnittliche Zeit zur Lösung eines Production-Bugs von 2 Stunden auf 15 Minuten.'
    ],
    slug: generateSlug('Der Error Self-Correction-Trick für perfektes Debugging'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Sprachmodelle haben Zugriff auf riesige Mengen an Dokumentationen und Fehlerberichten. Sie erkennen Muster in Fehlermeldungen weitaus schneller als Menschen und können den Fehler direkt dem verursachenden Code zuordnen. Der Trick liegt darin, der KI den vollständigen und exakten Fehlerkontext zu geben.'
  },
  {
    id: '22',
    title: 'Der "Implied Context"-Trick für präzisere Ergebnisse',
    description: 'Vermeide generische KI-Antworten, indem du allen unsichtbaren Kontext explizit machst. Eine von Google AI empfohlene Technik für Profi-Ergebnisse.',
    category: 'productivity',
    difficulty: 'beginner',
    tools: ['Claude', 'ChatGPT', 'Perplexity'],
    timeToImplement: '5 Minuten',
    impact: 'medium',
    steps: [
      'Schritt 1: Schreibe deinen initialen Prompt (z.B. "Gib mir Restaurant-Empfehlungen").',
      'Schritt 2: Frage dich: "Was weiß ich über die Situation, was die KI nicht weiß?" (z.B. Dein Freund ist Vegetarier, das Budget ist begrenzt).',
      'Schritt 3: Füge eine Sektion `### Kontext` zu deinem Prompt hinzu und liste alle diese impliziten Informationen auf.',
      'Schritt 4: Füge eine Sektion `### Tabus` hinzu und liste auf, was die Antwort auf keinen Fall enthalten soll (z.B. "Keine Kettenrestaurants").'
    ],
    examples: [
      'Ein Manager erhielt 80% relevantere Verhandlungsstrategien, nachdem er den Kontext "Branchendurchschnittliche Gehaltserhöhung ist 12%, ich bin der Top-Performer" hinzufügte.',
      'Ein Nutzer, der einen vegetarischen Freund zum Essen einlud, erhielt nach der Kontext-Ergänzung endlich passende Restaurant-Vorschläge.'
    ],
    slug: generateSlug('Der Implied Context-Trick für präzisere Ergebnisse'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Sprachmodelle können nicht Gedanken lesen. Sie arbeiten nur mit den Informationen, die sie erhalten. Indem du implizites Wissen explizit machst, gibst du dem Modell die notwendigen "Constraints" (Einschränkungen), um den Lösungsraum einzugrenzen und eine hochrelevante statt einer allgemeinen Antwort zu generieren.'
  },
  {
    id: '25',
    title: 'Der "Agentic Search"-Trick für komplexe Recherchen',
    description: 'Führe Recherchen wie eine KI durch: iterativ, explorativ und strategisch, anstatt eine einzige, perfekte Google-Suche zu versuchen.',
    category: 'learning',
    difficulty: 'intermediate',
    tools: ['Perplexity', 'Google Gemini'],
    timeToImplement: '15-20 Minuten pro Recherche',
    impact: 'high',
    steps: [
      'Schritt 1 (Exploration): Starte mit einer breiten, offenen Frage in Perplexity (z.B. "Was sind die aktuellen Trends im Bereich KI-Agenten?").',
      'Schritt 2 (Synthese): Lass die KI die ersten Ergebnisse zusammenfassen und die 3-5 wichtigsten Schlüsselbegriffe oder Expertennamen identifizieren.',
      'Schritt 3 (Vertiefung): Starte neue, gezielte Suchen für jeden dieser Schlüsselbegriffe.',
      'Schritt 4 (Verbindung): Gib die Ergebnisse aller Suchen an eine KI wie Claude und frage: "Was sind die Verbindungen, Widersprüche und offenen Fragen zwischen diesen Informationen?"'
    ],
    examples: [
      'Ein Entwickler fand die Ursache für einen obskuren Bug in einer Open-Source-Bibliothek in 15 Minuten, indem er iterativ von der Fehlermeldung zu GitHub-Issues zu spezifischen Code-Commits suchte.',
      'Ein strategischer Berater entdeckte eine aufkommende Marktchance, indem er die Verbindungen zwischen drei scheinbar unabhängigen Technologietrends analysierte.'
    ],
    slug: generateSlug('Der Agentic Search-Trick für komplexe Recherchen'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Dieser Ansatz ahmt nach, wie "KI-Agenten" komplexe Probleme lösen: durch einen iterativen Zyklus aus Erkundung, Analyse und verfeinerter Aktion. Dies ist weitaus effektiver als der menschliche Versuch, von Anfang an die "perfekte" Suchanfrage zu formulieren.'
  },
  {
    id: '29',
    title: 'Der "Terminal-First"-Workflow für komplexe Befehle',
    description: 'Nutze Claude Code als deinen persönlichen Kommandozeilen-Experten, um komplexe Aufgaben wie Git-Operationen, Docker-Setups oder `ffmpeg`-Befehle in natürlicher Sprache auszuführen.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude Code'],
    timeToImplement: '1 Minute pro Befehl',
    impact: 'high',
    steps: [
      'Schritt 1: Identifiziere eine Aufgabe auf der Kommandozeile, bei der du normalerweise googeln müsstest (z.B. "einen Git-Commit auf einen anderen Branch verschieben").',
      'Schritt 2: Beschreibe das gewünschte Ergebnis in einfacher Sprache: "Ich möchte den letzten Commit vom `main`-Branch auf den `feature/new-design`-Branch verschieben."',
      'Schritt 3: Lass Claude den korrekten Befehl (`git rebase`, `git cherry-pick`, etc.) vorschlagen und erklären.',
      'Schritt 4: Bestätige die Ausführung. Claude führt den Befehl sicher für dich aus.'
    ],
    examples: [
      'Ein Entwickler löste ein komplexes "detached HEAD"-Problem in Git in 2 Minuten, eine Aufgabe, die manuell oft Stunden und viel Recherche erfordert.',
      'Ein Datenwissenschaftler konvertierte 50 Videodateien mit einem komplizierten `ffmpeg`-Befehl, ohne die Dokumentation lesen zu müssen.'
    ],
    slug: generateSlug('Der Terminal-First-Workflow für komplexe Befehle'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Die Kommandozeile hat eine steile Lernkurve, da sie eine präzise Syntax erfordert. Sprachmodelle sind perfekt darin, natürliche Sprache in diese präzise Syntax zu übersetzen. Du agierst als "Architekt" (Was will ich?), die KI als "Ingenieur" (Wie erreiche ich es?).'
  },
  {
    id: '30',
    title: 'Der "/compact"-Befehl für unendliche Code-Sessions',
    description: 'Arbeite an riesigen Dateien und über lange Zeiträume, ohne den Kontext zu verlieren, indem du Claudes intelligenten `/compact`-Befehl nutzt, um die Konversation zu komprimieren.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude Code'],
    timeToImplement: '10 Sekunden',
    impact: 'medium',
    steps: [
      'Schritt 1: Arbeite normal in einer langen Konversation, bis du merkst, dass Claude anfängt, den früheren Kontext zu "vergessen".',
      'Schritt 2: Anstatt `/clear` (was alles löscht), tippe den Befehl `/compact` in das Chatfenster.',
      'Schritt 3: Claude liest die gesamte bisherige Konversation, fasst die wichtigsten Punkte, Entscheidungen und den aktuellen Code-Status intelligent zusammen.',
      'Schritt 4: Deine Konversation wird durch diese Zusammenfassung ersetzt, der Kontext ist wieder frisch und du kannst nahtlos weiterarbeiten.'
    ],
    examples: [
      'Ein Entwickler arbeitete 12 Stunden am Stück an einem komplexen Feature, indem er die Konversation alle 3 Stunden "kompaktierte", ohne jemals den Faden zu verlieren.',
      'Ein Team nutzte eine geteilte Session über 3 Tage, wobei jeder neue Entwickler mit `/compact` den aktuellen Stand in 2 Minuten erfasste.'
    ],
    slug: generateSlug('Der compact-Befehl für unendliche Code-Sessions'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Sprachmodelle haben ein begrenztes "Kontextfenster" (die Menge an Text, an die sie sich erinnern können). Der `/compact`-Befehl ist eine Form der automatischen "Text-Komprimierung", die die semantisch wichtigsten Informationen extrahiert und den "Lärm" entfernt, um den wertvollen Kontextplatz optimal zu nutzen.'
  },
  {
    id: '42',
    title: 'Der Feynman-KI-Lernzyklus für tiefes Verständnis',
    description: 'Meistere jedes komplexe Thema, indem du es der KI so einfach wie möglich erklärst. Diese nach dem Physiker Richard Feynman benannte Methode deckt Wissenslücken schonungslos auf.',
    category: 'learning',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '20-30 Minuten pro Konzept',
    impact: 'high',
    steps: [
      'Schritt 1: Wähle ein Konzept, das du lernen möchtest (z.B. "Wie funktioniert ein Transformer-Modell?").',
      'Schritt 2: Gib der KI den folgenden Prompt: "Ich versuche, [Konzept] zu verstehen. Ich werde es dir jetzt erklären. Deine Aufgabe ist es, wie ein neugieriger 12-Jähriger zu agieren und bei allem, was du nicht verstehst, ‘Warum?’ oder ‘Kannst du das einfacher erklären?’ zu fragen."',
      'Schritt 3: Beginne mit deiner Erklärung. Jedes Mal, wenn die KI nachfragt, musst du deine Erklärung vereinfachen oder die Wissenslücke durch Recherche schließen.',
      'Schritt 4: Wiederhole den Prozess, bis du das Konzept ohne Fachjargon und in einfachen Analogien erklären kannst.'
    ],
    examples: [
      'Ein Informatikstudent verstand das Konzept der "Rekursion" erst wirklich, nachdem er es der KI so erklären musste, dass sie es verstand.',
      'Ein Marketing-Manager meisterte die technischen Grundlagen von SEO, indem er den Prozess der Google-Indexierung in einer Feynman-Sitzung durcharbeitete.'
    ],
    slug: generateSlug('Der Feynman-KI-Lernzyklus für tiefes Verständnis'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Die Feynman-Technik ist eine Form des aktiven Lernens. Der Prozess des Vereinfachens und Erklärens zwingt das Gehirn, Informationen nicht nur auswendig zu lernen, sondern sie wirklich zu prozessieren und in bestehendes Wissen zu integrieren. Die KI ist der perfekte, unermüdliche Schüler für diesen Prozess.'
  },
  {
    id: '46',
    title: 'Der "Spaced Repetition"-Hack mit KI als Lerncoach',
    description: 'Nutze das wissenschaftlich belegte Prinzip der "Spaced Repetition", um Wissen dauerhaft im Langzeitgedächtnis zu verankern, indem die KI deinen persönlichen Lernplan erstellt.',
    category: 'learning',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT', 'Anki'],
    timeToImplement: '30 Minuten Setup, dann 5 Min/Tag',
    impact: 'high',
    steps: [
      'Schritt 1: Gib der KI deine Lernunterlagen (z.B. eine Zusammenfassung eines Kapitels).',
      'Schritt 2: Verwende den Prompt: "Erstelle basierend auf diesem Text 20 Frage-Antwort-Paare im Stil von Anki-Karteikarten. Formatiere den Output als CSV mit zwei Spalten: `Frage` und `Antwort`."',
      'Schritt 3: Importiere die generierte CSV-Datei in eine Spaced-Repetition-App wie Anki (kostenlos).',
      'Schritt 4: Lerne täglich für 5-10 Minuten. Der Algorithmus der App sorgt für die perfekte Wiederholungsfrequenz.'
    ],
    examples: [
      'Eine Medizinstudentin lernte 1000 anatomische Begriffe für ihr Examen mit einer Fehlerquote von unter 5%.',
      'Ein Programmierer verinnerlichte die wichtigsten JavaScript-Array-Methoden, indem er täglich seine KI-generierten Karteikarten wiederholte.'
    ],
    slug: generateSlug('Der Spaced Repetition-Hack mit KI als Lerncoach'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Die Methode basiert auf der "Vergessenskurve" von Hermann Ebbinghaus. Informationen werden am effektivsten gespeichert, wenn sie genau dann wiederholt werden, wenn man sie gerade zu vergessen beginnt. Spaced-Repetition-Software automatisiert dieses optimale Timing.'
  },
  {
    id: '47',
    title: 'Der "48h Customer Discovery"-Trick für Startups',
    description: 'Validiere deine Geschäftsidee und identifiziere deine exakte Zielgruppe in nur zwei Tagen, indem du die KI für Marktanalyse und Umfrageerstellung nutzt.',
    category: 'business',
    difficulty: 'intermediate',
    tools: ['Claude', 'Perplexity', 'Google Forms'],
    timeToImplement: '2-4 Stunden',
    impact: 'high',
    steps: [
      'Schritt 1 (Hypothesen): Beschreibe deine Geschäftsidee und lasse die KI 5 potenzielle Kundensegmente mit deren dringendsten Problemen vorschlagen.',
      'Schritt 2 (Recherche): Nutze Perplexity, um für jedes Segment Online-Foren und Diskussionen zu finden (z.B. "Wo diskutieren [Segment] über [Problem]?").',
      'Schritt 3 (Umfrage): Lasse Claude eine kurze, 5-Fragen-Umfrage für Google Forms erstellen, die das Problem validiert, ohne deine Lösung zu erwähnen.',
      'Schritt 4 (Analyse): Poste den Link zur Umfrage in den gefundenen Foren. Gib die (anonymisierten) Antworten an die KI und lasse sie die wichtigsten Muster und Zitate zusammenfassen.'
    ],
    examples: [
      'Ein Startup fand heraus, dass seine Zielgruppe nicht kleine Unternehmen, sondern Freelancer waren, und konnte sein Marketing erfolgreich neu ausrichten.',
      'Eine Gründerin erhielt innerhalb von 48 Stunden 70 Umfrageantworten, die zeigten, dass ihr Hauptfeature für die Nutzer irrelevant war, was ihr Monate an Entwicklungszeit sparte.'
    ],
    slug: generateSlug('Der 48h Customer Discovery-Trick für Startups'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Dieser Prozess folgt dem "Lean Startup"-Prinzip von Eric Ries ("Build-Measure-Learn"). Die KI beschleunigt den Zyklus dramatisch, indem sie die zeitaufwändigen Phasen der Recherche und Analyse automatisiert und es Gründern ermöglicht, sich auf das direkte Kundenfeedback zu konzentrieren.'
  },
  {
    id: '48',
    title: 'Der "Pitch Deck Generator" nach Y-Combinator-Formel',
    description: 'Erstelle in unter 2 Stunden ein überzeugendes Pitch Deck, das der bewährten Struktur von Top-Investoren wie Y-Combinator folgt.',
    category: 'business',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT', 'Gamma.app'],
    timeToImplement: '1-2 Stunden',
    impact: 'high',
    steps: [
      'Schritt 1: Beantworte die 10 Kernfragen zu deinem Startup (Problem, Lösung, Marktgröße, Team etc.).',
      'Schritt 2: Gib deine Antworten an die KI mit dem Prompt: "Erstelle den Text für ein 10-seitiges Pitch Deck basierend auf der Y-Combinator-Struktur. Verwende diese Informationen: [Deine Antworten]."',
      'Schritt 3: Kopiere die generierten Texte für jede Folie in ein Präsentationstool wie Gamma.app oder Pitch.com.',
      'Schritt 4: Lasse das KI-gestützte Design-Tool der Präsentations-App das visuelle Layout erstellen.'
    ],
    examples: [
      'Ein Startup sicherte sich eine 500.000€ Seed-Finanzierung mit einem Pitch Deck, das in einem Nachmittag mit diesem Workflow erstellt wurde.',
      'Ein Team konnte sich auf die Geschäftsstrategie konzentrieren, während die KI die zeitaufwändige Erstellung der Präsentationsinhalte übernahm.'
    ],
    slug: generateSlug('Der Pitch Deck Generator nach Y-Combinator-Formel'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Investoren sehen hunderte von Pitch Decks. Sie sind auf eine bestimmte Struktur und Erzählweise trainiert. Die KI kann auf tausende erfolgreiche Decks zurückgreifen und deine Idee in dieses bewährte Schema pressen, was die Verständlichkeit und Überzeugungskraft für Investoren maximiert.'
  },
  {
    id: '53',
    title: 'Der "Meeting-to-Action"-Workflow in 5 Minuten',
    description: 'Verwandle unstrukturierte Meeting-Notizen oder Transkripte automatisch in eine perfekt formatierte Zusammenfassung mit klaren Action Items, Verantwortlichkeiten und Deadlines.',
    category: 'productivity',
    difficulty: 'beginner',
    tools: ['Claude', 'Otter.ai', 'Asana'],
    timeToImplement: '5 Minuten pro Meeting',
    impact: 'high',
    steps: [
      'Schritt 1: Nimm das Meeting mit einem Tool wie Otter.ai auf oder mache dir unstrukturierte Notizen.',
      'Schritt 2: Kopiere das Transkript oder deine Notizen.',
      'Schritt 3: Verwende diesen Master-Prompt: "Analysiere den folgenden Meeting-Text. Extrahiere und formatiere die Ausgabe als Markdown: 1. **Zusammenfassung:** (3 Bullet Points der Kernaussagen). 2. **Entscheidungen:** (Liste der getroffenen Entscheidungen). 3. **Action Items:** (Tabelle mit den Spalten: Aufgabe, Verantwortlicher, Deadline). --- [Hier Text einfügen] ---"',
      'Schritt 4: Kopiere die formatierte Ausgabe und füge sie in deine E-Mail-Zusammenfassung oder dein Projektmanagement-Tool (z.B. Asana) ein.'
    ],
    examples: [
      'Ein Projektmanager reduzierte die Zeit für die Nachbereitung von Meetings von 30 auf 5 Minuten und erreichte eine 100%ige Transparenz über die nächsten Schritte.',
      'Ein Team eliminierte Missverständnisse und vergessene Aufgaben, da jedes Meeting mit einem klaren, KI-generierten Aktionsplan endete.'
    ],
    slug: generateSlug('Der Meeting-to-Action-Workflow in 5 Minuten'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Dieser Trick automatisiert die kognitiv anspruchsvolle Aufgabe der "Synthese". Die KI ist darauf trainiert, Muster wie Verantwortlichkeiten ("Alex wird sich darum kümmern") und Zeitangaben ("bis Ende nächster Woche") aus unstrukturiertem Text zu extrahieren und in ein strukturiertes Format zu überführen.'
  },
  {
    id: '57',
    title: 'Die "Virale Formel" für Social-Media-Content',
    description: 'Analysiere die erfolgreichsten Posts deiner Konkurrenz und extrahiere eine wiederverwendbare "virale Formel", um deine eigenen Inhalte zu erstellen.',
    category: 'marketing',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '30 Minuten Analyse, 5 Min pro Post',
    impact: 'high',
    steps: [
      'Schritt 1: Sammle die Texte von 5-10 viralen Posts (hohes Engagement) aus deiner Nische oder von Konkurrenten.',
      'Schritt 2: Gib sie an die KI mit dem Prompt: "Analysiere diese 10 erfolgreichen Posts. Identifiziere die gemeinsame Struktur und die rhetorischen Mittel (z.B. Hook, Story, Call-to-Action). Erstelle daraus eine universelle, wiederverwendbare Vorlage für einen neuen Post."',
      'Schritt 3: Speichere die von der KI generierte "virale Formel".',
      'Schritt 4: Nutze diese Formel für deine zukünftigen Posts, indem du nur noch die thematischen Lücken füllst.'
    ],
    examples: [
      'Ein LinkedIn-Creator analysierte die Posts von Top-Stimmen seiner Branche und entwickelte eine Vorlage, die seine Reichweite pro Post um durchschnittlich 500% steigerte.',
      'Ein E-Commerce-Shop erstellte eine "virale Formel" für Produktankündigungen auf Instagram, was zu einer Verdopplung der Verkäufe am Launch-Tag führte.'
    ],
    slug: generateSlug('Die Virale Formel für Social-Media-Content'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Erfolgreiche Online-Inhalte folgen oft ungeschriebenen, plattformspezifischen Mustern. Die KI ist durch ihr Training auf Milliarden von Texten in der Lage, diese impliziten Muster explizit zu machen. Sie führt eine Art "Reverse Engineering" des Erfolgs durch.'
  },
  {
    id: '60',
    title: 'API-Dokumentation, die Entwickler lieben werden',
    description: 'Erstelle in Minuten eine vollständige, interaktive und benutzerfreundliche API-Dokumentation, inklusive Code-Beispielen in mehreren Programmiersprachen.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude 3.5 Sonnet', 'ChatGPT-4o'],
    timeToImplement: '30 Minuten pro Endpoint',
    impact: 'high',
    steps: [
      'Schritt 1: Gib der KI den Code für einen API-Endpoint (z.B. eine Express.js-Route oder eine Python/FastAPI-Funktion).',
      'Schritt 2: Verwende den Master-Prompt: "Agiere als Senior Technical Writer. Erstelle eine Markdown-Dokumentation für diesen API-Endpoint. Inkludiere: 1. Eine kurze Beschreibung des Zwecks. 2. Den relativen Pfad und die HTTP-Methode. 3. Eine Tabelle der erwarteten Request-Parameter (Name, Typ, Beschreibung). 4. Ein Beispiel für eine erfolgreiche JSON-Antwort (200 OK). 5. Ein Beispiel für eine Fehler-Antwort (400 Bad Request). 6. Funktionierende Code-Beispiele für den Aufruf in JavaScript (fetch) und Python (requests)."',
      'Schritt 3: Kopiere die generierte Markdown-Datei in dein Doku-System (z.B. GitBook, Docusaurus).',
      'Schritt 4: Wiederhole den Prozess für jeden Endpoint.'
    ],
    examples: [
      'Ein SaaS-Unternehmen steigerte die API-Adoption durch neue Kunden um 300%, nachdem es seine veraltete Dokumentation mit diesem Workflow komplett überarbeitet hatte.',
      'Ein Entwicklerteam reduzierte die Anzahl der Support-Anfragen bezüglich ihrer API um 80%, da die neue Dokumentation die meisten Fragen proaktiv beantwortete.'
    ],
    slug: generateSlug('API-Dokumentation die Entwickler lieben werden'),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-01'),
    'Warum es funktioniert': 'Gute Dokumentation ist strukturiert und repetitiv – eine ideale Aufgabe für eine KI. Sie kann konsistent bleiben und den mühsamen Prozess des Schreibens von Code-Beispielen in verschiedenen Sprachen automatisieren, was für menschliche Entwickler oft eine lästige Pflicht ist.'
  },
  {
    id: '64',
    title: 'Der "Zweiter-Gehirn"-Trick mit KI für dein Wissensmanagement',
    description: 'Verwandle deine unstrukturierten Notizen, gelesenen Artikel und zufälligen Ideen in eine vernetzte, durchsuchbare Wissensdatenbank – dein persönliches "Zweites Gehirn".',
    category: 'learning',
    difficulty: 'intermediate',
    tools: ['Obsidian', 'Logseq', 'Claude', 'ChatGPT'],
    timeToImplement: '45 Minuten Setup, 10 Min/Tag',
    impact: 'high',
    steps: [
      'Schritt 1: Sammle alle deine Notizen und markierten Artikel einer Woche an einem Ort.',
      'Schritt 2: Gib sie an die KI mit dem Prompt: "Agiere als Wissensmanager. Analysiere diese Texte und extrahiere die 5-10 wichtigsten Kernkonzepte. Erstelle für jedes Konzept eine separate Notiz im Markdown-Format. Jede Notiz soll eine kurze Zusammenfassung, 3 Bullet Points und eine Liste von verwandten Konzepten als [[Wiki-Links]] enthalten."',
      'Schritt 3: Kopiere die generierten Markdown-Notizen in ein Tool wie Obsidian oder Logseq.',
      'Schritt 4: Nutze die Graphen-Ansicht deines Tools, um die von der KI erstellten Verbindungen zwischen deinen Ideen zu visualisieren und neue Einsichten zu gewinnen.'
    ],
    examples: [
      'Ein Autor entdeckte durch die Visualisierung seiner Notizen ein wiederkehrendes Thema, das zur Grundlage für sein neues Buch wurde.',
      'Ein Berater kann Kundenfragen in Echtzeit beantworten, indem er seine KI-organisierte Wissensdatenbank durchsucht und sofort auf relevante Notizen und Quellen zugreift.'
    ],
    slug: generateSlug('Der Zweiter-Gehirn-Trick mit KI für dein Wissensmanagement'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'Dieser Trick automatisiert die Kernprinzipien der "Zettelkasten"-Methode von Niklas Luhmann. Die KI übernimmt die mühsame Aufgabe des "Atomisierens" (Zerlegen von Informationen in kleinste Bausteine) und des "Verknüpfens", was die Entstehung neuer, unerwarteter Ideen fördert.'
  },
  {
    id: '65',
    title: 'Der "Persona-Prompting"-Trick für zielgenaues Marketing',
    description: 'Erstelle eine detaillierte KI-Persona, die deine Zielgruppe repräsentiert, und lasse sie deine Marketing-Texte bewerten, um die Resonanz deiner Kampagnen zu maximieren.',
    category: 'marketing',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '20 Minuten Setup',
    impact: 'high',
    steps: [
      'Schritt 1: Definiere deine Zielgruppe. Sammle demografische Daten, Interessen, Probleme und Ziele.',
      'Schritt 2: Erstelle die KI-Persona mit diesem Prompt: "Agiere von nun an als [Name der Persona], ein [Beruf] im Alter von [Alter]. Meine größten Probleme sind [Problem 1, 2]. Meine Ziele sind [Ziel 1, 2]. Ich spreche in einem [z.B. informellen, professionellen] Ton. Bestätige, dass du diese Persona verstanden hast."',
      'Schritt 3: Gib der KI (als Persona) deinen Marketing-Text (z.B. eine E-Mail oder eine Anzeige).',
      'Schritt 4: Frage die Persona direkt nach Feedback: "Bewerte diesen Text aus deiner Perspektive auf einer Skala von 1-10. Was spricht dich an? Was ist unklar oder irrelevant für dich? Welcher Satz würde dich dazu bringen, zu klicken?"'
    ],
    examples: [
      'Ein E-Commerce-Unternehmen testete seine Produktbeschreibungen mit einer KI-Persona und formulierte sie um, was zu einer Steigerung der Conversion Rate um 35% führte.',
      'Ein SaaS-Anbieter ließ seine Landing-Page von einer "skeptischen CTO"-Persona bewerten und identifizierte so drei entscheidende Vertrauenslücken, die er schließen konnte.'
    ],
    slug: generateSlug('Der Persona-Prompting-Trick für zielgenaues Marketing'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'Diese Methode simuliert eine Fokusgruppe, ohne die Kosten und den Zeitaufwand. Indem die KI eine spezifische Rolle einnimmt, kann sie ihr riesiges Wissen über menschliches Verhalten und Kommunikation durch den Filter dieser spezifischen Persona anwenden, was zu extrem relevantem und umsetzbarem Feedback führt.'
  },
  {
    id: '66',
    title: 'Der "KI-Redaktions-Assistent" für fehlerfreie Texte',
    description: 'Nutze einen mehrstufigen KI-Workflow, um deine Texte nicht nur auf Grammatik, sondern auch auf Stil, Klarheit und Überzeugungskraft zu prüfen – wie bei einem professionellen Lektorat.',
    category: 'content-creation',
    difficulty: 'beginner',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '10 Minuten pro Text',
    impact: 'medium',
    steps: [
      'Schritt 1: Gib deinen fertigen Text an die KI mit dem Prompt: "Agiere als strenger Lektor. Korrigiere alle Grammatik- und Rechtschreibfehler in diesem Text und gib mir nur die korrigierte Version zurück."',
      'Schritt 2: Nimm den korrigierten Text und gib ihn in einem **neuen** Chat an die KI mit dem Prompt: "Agiere als Experte für klaren und prägnanten Stil. Kürze diesen Text um 20%, ohne wichtige Informationen zu verlieren. Ersetze Passivkonstruktionen und Füllwörter."',
      'Schritt 3: Nimm den gestrafften Text und gib ihn in einem **weiteren neuen** Chat an die KI: "Agiere als Überzeugungs-Psychologe. Analysiere diesen Text. Was ist die stärkste Aussage und wie können wir sie noch wirkungsvoller machen? Wo verliert der Text an Kraft?"',
      'Schritt 4: Arbeite das finale Feedback ein, um einen perfekten Text zu erhalten.'
    ],
    examples: [
      'Ein Autor überarbeitete ein Buchkapitel mit diesem Prozess und erhielt von seinem Verleger das Feedback, es sei sein "bisher stärkstes Schreiben".',
      'Ein Bewerber nutzte den Workflow für sein Anschreiben und erhielt drei Einladungen zu Vorstellungsgesprächen von fünf Bewerbungen.'
    ],
    slug: generateSlug('Der KI-Redaktions-Assistent für fehlerfreie Texte'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'Dieser Prozess ahmt den Workflow eines professionellen Redaktionsteams nach, in dem verschiedene Experten (Korrektor, Stil-Lektor, Inhalts-Stratege) nacheinander an einem Text arbeiten. Durch die Trennung der Aufgaben in separate Chats wird verhindert, dass die KI versucht, alles auf einmal zu tun, was zu besseren Ergebnissen in jeder einzelnen Phase führt.'
  },
  {
    id: '67',
    title: 'Der "Unendliche Ideen"-Generator für Content-Kalender',
    description: 'Überwinde jede Schreibblockade und erstelle in 15 Minuten einen Content-Kalender für einen ganzen Monat, der auf echten Nutzerfragen und bewährten Formaten basiert.',
    category: 'marketing',
    difficulty: 'beginner',
    tools: ['ChatGPT-4o', 'AnswerThePublic'],
    timeToImplement: '15 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Gehe auf eine Seite wie AnswerThePublic oder nutze Google-Suchvorschläge, um die häufigsten Fragen zu deinem Kernthema zu finden.',
      'Schritt 2: Wähle die 5 interessantesten Fragen aus.',
      'Schritt 3: Gib diese Fragen an die KI mit dem Prompt: "Hier sind 5 häufige Fragen meiner Zielgruppe: [Fragen hier einfügen]. Erstelle daraus 20 konkrete Content-Ideen (z.B. für Blog-Posts oder Videos). Verwende dabei eine Mischung aus den folgenden Formaten: Listen, Anleitungen, Mythen-Aufklärung, Experten-Interviews, Fallstudien."',
      'Schritt 4: Lasse die KI die 20 Ideen in einer Tabelle als Content-Kalender für die nächsten 4 Wochen anordnen.'
    ],
    examples: [
      'Ein Finanz-Blogger generierte so Content-Ideen für ein ganzes Quartal und steigerte seinen organischen Traffic um 70%.',
      'Ein YouTube-Kanal fand durch die Analyse von Nutzerfragen eine Nische, die ihn von 1.000 auf 100.000 Abonnenten wachsen ließ.'
    ],
    slug: generateSlug('Der Unendliche Ideen-Generator für Content-Kalender'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'Dieser Trick kombiniert datengestützte Relevanz (echte Nutzerfragen) mit kreativer KI-Generierung. Anstatt im leeren Raum zu brainstormen, gibst du der KI einen validierten Ausgangspunkt, was zu Inhalten führt, die garantiert auf das Interesse deiner Zielgruppe stoßen.'
  },
  {
    id: '68',
    title: 'Der "Code-Übersetzer"-Trick für Legacy-Systeme',
    description: 'Verstehe und modernisiere veralteten Code (z.B. in COBOL, Fortran oder altem PHP), indem du die KI als universellen Übersetzer und Kommentator einsetzt.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude 3.5 Sonnet'],
    timeToImplement: '10 Minuten pro Funktion',
    impact: 'high',
    steps: [
      'Schritt 1: Kopiere eine Funktion oder einen Abschnitt des Legacy-Codes.',
      'Schritt 2: Gib ihn an die KI mit dem Prompt: "Agiere als erfahrener Software-Archäologe. Analysiere den folgenden [Programmiersprache]-Code. Erkläre Zeile für Zeile in einfachen Worten, was der Code tut."',
      'Schritt 3: Frage nach der Modernisierung: "Schreibe diesen Code in modernem [z.B. Python oder TypeScript] neu. Behalte die exakte Funktionalität bei, aber nutze aktuelle Best Practices."',
      'Schritt 4: Bitte um eine Test-Suite: "Erstelle eine Reihe von Unit-Tests, die beweisen, dass der alte und der neue Code bei den gleichen Inputs die exakt gleichen Outputs produzieren."'
    ],
    examples: [
      'Eine Bank konnte Teile ihres COBOL-Mainframe-Systems nach Python migrieren, indem sie diesen Workflow nutzte, was Millionen an Wartungskosten sparte.',
      'Ein Entwicklerteam konnte eine 10 Jahre alte PHP-Anwendung sicher auf ein modernes Framework umstellen, indem es die Geschäftslogik mit KI extrahierte und verifizierte.'
    ],
    slug: generateSlug('Der Code-Übersetzer-Trick für Legacy-Systeme'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'Sprachmodelle sind Mustererkennungsmaschinen. Da sie auf riesigen Mengen an Code aus verschiedenen Epochen trainiert wurden, können sie die logischen Muster in altem Code erkennen und sie in die äquivalenten Muster moderner Sprachen übersetzen, selbst wenn sie die alte Sprache nicht "offiziell" beherrschen.'
  },
  {
    id: '69',
    title: 'Der "Meeting-Vorbereitungs"-Assistent in 5 Minuten',
    description: 'Gehe in jedes Meeting perfekt vorbereitet, indem du die KI eine prägnante Zusammenfassung aller relevanten Dokumente und Teilnehmer erstellen lässt.',
    category: 'business',
    difficulty: 'beginner',
    tools: ['Claude', 'Perplexity'],
    timeToImplement: '5-10 Minuten pro Meeting',
    impact: 'high',
    steps: [
      'Schritt 1: Sammle alle relevanten Informationen: die Meeting-Einladung (Teilnehmerliste, Agenda) und eventuelle Vordokumente (PDFs, E-Mail-Verläufe).',
      'Schritt 2: Gib die Agenda und die Dokumente an Claude mit dem Prompt: "Fasse die drei wichtigsten Punkte aus den angehängten Dokumenten zusammen, die für die Agenda dieses Meetings relevant sind."',
      'Schritt 3: Gib die Teilnehmerliste an Perplexity mit dem Prompt: "Gib mir eine kurze Zusammenfassung der beruflichen Hintergründe und aktuellen Rollen von [Name 1], [Name 2] und [Name 3], basierend auf ihren öffentlichen LinkedIn-Profilen."',
      'Schritt 4: Formuliere basierend auf den KI-Zusammenfassungen 3 strategische Fragen, die du im Meeting stellen wirst.'
    ],
    examples: [
      'Eine Vertriebsmitarbeiterin konnte ein Kundengespräch dominieren, weil sie die Prioritäten des Kunden aus einem vorab geschickten Report kannte und die beruflichen Hintergründe der Entscheider recherchiert hatte.',
      'Ein Projektmanager identifizierte potenzielle Konflikte vor einem wichtigen Stakeholder-Meeting, indem er die unterschiedlichen Ziele der Teilnehmer analysierte.'
    ],
    slug: generateSlug('Der Meeting-Vorbereitungs-Assistent in 5 Minuten'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'Dieser Trick automatisiert die zeitaufwändige, aber entscheidende Vorbereitungsphase. Er nutzt das Prinzip der "Informations-Asymmetrie" zu deinem Vorteil: Du betrittst den Raum mit einem Wissensvorsprung, der es dir ermöglicht, Gespräche zu lenken und fundiertere Entscheidungen zu treffen.'
  },
  {
    id: '70',
    title: 'Der "API-ohne-API"-Trick für jede Webseite',
    description: 'Extrahiere strukturierte Daten von jeder Webseite, auch wenn sie keine offizielle API anbietet, indem du die KI als intelligenten Web-Scraper einsetzt.',
    category: 'data-analysis',
    difficulty: 'intermediate',
    tools: ['Claude 3.5 Sonnet', 'ChatGPT-4o'],
    timeToImplement: '10 Minuten pro Seite',
    impact: 'high',
    steps: [
      'Schritt 1: Öffne die Webseite, von der du Daten extrahieren möchtest, und kopiere den gesamten sichtbaren Text (Strg+A, Strg+C).',
      'Schritt 2: Gib den kopierten Text an die KI.',
      'Schritt 3: Formuliere eine präzise Anweisung, welche Daten du in welchem Format benötigst. Kopiere und passe dies an: "Analysiere den folgenden Webseiten-Text. Extrahiere alle [z.B. Produktnamen, Preise und Bewertungen]. Formatiere das Ergebnis als eine JSON-Array von Objekten mit den Schlüsseln `name`, `price` und `rating`."',
      'Schritt 4: Kopiere den generierten JSON-Code und verwende ihn in deinen Skripten, Tabellen oder Anwendungen.'
    ],
    examples: [
      'Ein Analyst sammelte Preisdaten von 10 Konkurrenz-Websites in unter einer Stunde, um eine umfassende Marktanalyse zu erstellen.',
      'Ein Startup baute einen Prototyp für einen Job-Aggregator, indem es Stellenangebote von verschiedenen Karriere-Seiten mit diesem Trick extrahierte.'
    ],
    slug: generateSlug('Der API-ohne-API-Trick für jede Webseite'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'Moderne Sprachmodelle, insbesondere multimodale wie GPT-4o und Claude 3.5, können die visuelle und textuelle Struktur einer Webseite semantisch verstehen. Sie erkennen, was ein "Titel", ein "Preis" oder ein "Nutzerkommentar" ist, und können diese unstrukturierten Informationen in das von dir gewünschte strukturierte Format (wie JSON) umwandeln.'
  },
  {
    id: '71',
    title: 'Der "Design-System-Generator" für konsistente UIs',
    description: 'Erstelle ein komplettes Set an UI-Komponenten (Buttons, Formulare, Karten) für deine Web-Anwendung, die einem konsistenten Design-System folgen, basierend auf einer einzigen Beschreibung.',
    category: 'design',
    difficulty: 'intermediate',
    tools: ['Claude 3.5 Sonnet', 'v0.dev'],
    timeToImplement: '30-45 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Beschreibe deinen gewünschten Design-Stil in 3-5 Adjektiven (z.B. "minimalistisch, modern, professionell, mit abgerundeten Ecken und einem primären Blauton").',
      'Schritt 2: Gib dies an eine Design-orientierte KI (wie v0.dev oder Claude 3.5) mit dem Prompt: "Erstelle basierend auf dieser Design-Beschreibung den HTML- und Tailwind-CSS-Code für die folgenden React-Komponenten: 1. Ein Primary Button. 2. Ein Secondary Button. 3. Ein Texteingabefeld mit Label. 4. Eine Informations-Karte mit Titel und Text."',
      'Schritt 3: Kopiere den generierten Code in dein Projekt.',
      'Schritt 4: Verwende diese Basis-Komponenten konsistent in deiner gesamten Anwendung, um ein einheitliches Look-and-Feel zu gewährleisten.'
    ],
    examples: [
      'Ein Entwickler erstellte in unter einer Stunde ein komplettes, professionell aussehendes Design-System für sein neues SaaS-Produkt.',
      'Ein Team verbesserte die Benutzererfahrung seiner App erheblich, indem es die inkonsistenten UI-Elemente durch ein KI-generiertes, einheitliches System ersetzte.'
    ],
    slug: generateSlug('Der Design-System-Generator für konsistente UIs'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'Design ist ein System von Regeln und Mustern. KI-Modelle sind exzellent darin, solche Regeln (z.B. "alle Buttons haben abgerundete Ecken") zu lernen und konsistent auf verschiedene Elemente anzuwenden. Sie automatisieren den Prozess der Erstellung einer kohärenten visuellen Sprache.'
  },
  {
    id: '72',
    title: 'Der "SQL-Master"-Trick für komplexe Datenbankabfragen',
    description: 'Schreibe komplexe SQL-Abfragen in einfacher, natürlicher Sprache, optimiere die Performance und verstehe bestehende Abfragen, ohne ein Datenbank-Experte zu sein.',
    category: 'data-analysis',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT-4o'],
    timeToImplement: '5 Minuten pro Abfrage',
    impact: 'high',
    steps: [
      'Schritt 1: Gib der KI das Schema deiner relevanten Datenbanktabellen. Kopiere den `CREATE TABLE`-Befehl.',
      'Schritt 2: Beschreibe das gewünschte Ergebnis in einfacher Sprache. Zum Beispiel: "Ich brauche eine Liste aller Kunden aus Deutschland, die in den letzten 30 Tagen mehr als 100 Euro ausgegeben haben. Sortiere sie nach dem höchsten Umsatz."',
      'Schritt 3 (Generierung): Lass die KI die SQL-Abfrage generieren.',
      'Schritt 4 (Optimierung & Erklärung): Frage weiter: "Erkläre mir diese Abfrage Schritt für Schritt. Gibt es eine Möglichkeit, sie performanter zu machen? Welche Indizes sollte ich setzen?"'
    ],
    examples: [
      'Ein Marketing-Analyst konnte eine komplexe Kundensegmentierungs-Abfrage, die er manuell nicht hätte schreiben können, in 5 Minuten erstellen.',
      'Ein Junior-Entwickler optimierte eine langsame Datenbankabfrage und reduzierte die Ladezeit einer Seite von 10 Sekunden auf 200 Millisekunden, indem er die Index-Empfehlungen der KI befolgte.'
    ],
    slug: generateSlug('Der SQL-Master-Trick für komplexe Datenbankabfragen'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'SQL ist eine deklarative Sprache, was bedeutet, dass man beschreibt, *was* man will, nicht *wie* man es bekommt. Dies ist eine perfekte Analogie zur natürlichen Sprache. Moderne KIs können die Absicht hinter einer natürlichen Sprachbeschreibung erfassen und sie in die formale, logische Struktur von SQL übersetzen.'
  },
  {
    id: '73',
    title: 'Der "Persona-Wechsel"-Trick für 360°-Feedback',
    description: 'Erhalte umfassendes Feedback zu einer Idee, einem Text oder einem Produkt, indem du die KI zwingst, das Problem aus mehreren, widersprüchlichen Perspektiven zu betrachten.',
    category: 'business',
    difficulty: 'beginner',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '15 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Präsentiere der KI deine Idee oder deinen Text.',
      'Schritt 2: Verwende den Multi-Persona-Prompt. Kopiere und passe dies an: "Analysiere meine Idee. Gib mir Feedback aus den folgenden drei Perspektiven in einer Tabelle: 1. **Ein optimistischer Kunde**, der begeistert ist. 2. **Ein skeptischer Investor**, der nach Schwachstellen sucht. 3. **Ein überarbeiteter Mitarbeiter**, der die Umsetzung fürchtet."',
      'Schritt 3: Analysiere die tabellarische Ausgabe. Die wertvollsten Einsichten liegen oft in den Argumenten des "Skeptikers" und des "Mitarbeiters".',
      'Schritt 4: Verbessere deine Idee, indem du die identifizierten Schwachstellen proaktiv adressierst.'
    ],
    examples: [
      'Ein Startup überarbeitete sein Geschäftsmodell, nachdem die "skeptische Investor"-Persona ein kritisches Skalierungsproblem aufdeckte.',
      'Ein Autor formulierte die Einleitung seines Buches neu, nachdem die "begeisterte Leser"-Persona anmerkte, dass der Hook nicht stark genug sei.'
    ],
    slug: generateSlug('Der Persona-Wechsel-Trick für 360-Grad-Feedback'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'Diese Methode bekämpft den "Confirmation Bias" (Bestätigungsfehler), dem sowohl Menschen als auch KIs unterliegen. Indem du die KI explizit anweist, widersprüchliche Rollen einzunehmen, erzwingst du eine breitere, ausgewogenere Analyse und deckst blinde Flecken auf, die bei einer einfachen Anfrage verborgen geblieben wären.'
  },
  {
    id: '74',
    title: 'Der "Automatisierte Frontend-Test"-Generator',
    description: 'Schreibe robuste End-to-End-Tests für deine Web-Anwendung in Minuten statt Stunden, indem du die KI den Testcode für Frameworks wie Cypress oder Playwright generieren lässt.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude 3.5 Sonnet', 'Cypress', 'Playwright'],
    timeToImplement: '10 Minuten pro Testfall',
    impact: 'high',
    steps: [
      'Schritt 1: Gib der KI den HTML- oder React/Vue-Code deiner Komponente oder Seite.',
      'Schritt 2: Beschreibe den User-Flow in einfacher Sprache. Zum Beispiel: "Ein Nutzer besucht die Seite, klickt auf den Button mit der ID `login-button`, füllt das Textfeld `email` mit `test@test.com` und das Feld `password` mit `password123` aus und klickt dann auf `submit`."',
      'Schritt 3: Fordere den Testcode an: "Schreibe einen Cypress-Test, der diesen User-Flow verifiziert. Der Test soll am Ende überprüfen, ob auf der neuen Seite der Text `Willkommen zurück!` erscheint."',
      'Schritt 4: Kopiere den generierten Testcode in deine Test-Suite und führe ihn aus.'
    ],
    examples: [
      'Ein QA-Team konnte die Testabdeckung für ihre Anwendung von 40% auf 85% erhöhen, indem es den Großteil der repetitiven Test-Skripte von der KI schreiben ließ.',
      'Ein Frontend-Entwickler erstellte für jede neue Komponente automatisch einen Basis-Test, was die Anzahl der Regression-Bugs um 90% reduzierte.'
    ],
    slug: generateSlug('Der Automatisierte Frontend-Test-Generator'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-06'),
    'Warum es funktioniert': 'End-to-End-Tests sind oft syntaktisch repetitiv ("finde Element", "klicke", "tippe Text", "überprüfe Ergebnis"). Dies ist ein Muster, das KIs perfekt beherrschen. Sie können die natürliche Sprachbeschreibung eines User-Flows direkt in die formale Syntax des Test-Frameworks übersetzen.'
  },
  {
    id: '75',
    title: 'Der "UI/UX-Analyst"-Trick: Sofort-Feedback zu jedem Screenshot',
    description: 'Erhalte in Sekunden ein professionelles UI/UX-Review für deine Webseite oder App, indem du Claudes Vision-Fähigkeiten nutzt, um Design-Schwächen aufzudecken.',
    category: 'design',
    difficulty: 'beginner',
    tools: ['Claude 3.5 Sonnet'],
    timeToImplement: '5 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Mache einen Screenshot von der Benutzeroberfläche, die du analysieren lassen möchtest.',
      'Schritt 2: Lade den Screenshot in Claude hoch.',
      'Schritt 3: Verwende diesen präzisen Analyse-Prompt: "Agiere als Senior UX-Designer von Google. Analysiere diesen Screenshot basierend auf den Prinzipien der Usability-Heuristiken von Jakob Nielsen. Gib mir eine tabellarische Übersicht mit drei Spalten: 1. Beobachtetes Problem, 2. Betroffenes Prinzip (z.B. Sichtbarkeit des Systemstatus), 3. Konkreter Verbesserungsvorschlag."',
      'Schritt 4: Setze die umsetzbarsten Vorschläge direkt um, um die Benutzerfreundlichkeit zu verbessern.'
    ],
    examples: [
      'Ein App-Entwickler identifizierte einen unklaren Button im Onboarding-Prozess, dessen Änderung die Nutzeraktivierung um 25% steigerte.',
      'Ein Webdesigner erhielt Feedback zur mobilen Ansicht seines Shops, was die Abbruchrate im Warenkorb um 15% senkte.'
    ],
    slug: generateSlug('Der UI-UX-Analyst-Trick Sofort-Feedback zu jedem Screenshot'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Dieser Trick simuliert einen "Cognitive Walkthrough", eine etablierte Methode im UX-Design. Claudes Vision-Modell wurde mit Millionen von Webseiten trainiert und hat gelernt, gängige Design-Muster und deren Abweichungen zu erkennen, die gegen visuelle Hierarchie oder Nutzererwartungen verstoßen.'
  },
  {
    id: '76',
    title: 'Der "Live-Code-Generator"-Trick mit Artifacts',
    description: 'Erstelle und bearbeite Code-Komponenten live in einem separaten Fenster, während du mit der KI chattest. Perfekt für schnelles Prototyping und kollaboratives Coden.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude 3.5 Sonnet'],
    timeToImplement: '10 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Stelle sicher, dass "Artifacts" in den Claude-Einstellungen aktiviert ist.',
      'Schritt 2: Gib eine klare Anweisung zur Code-Generierung, z.B.: "Erstelle eine React-Komponente für eine Preiskarte mit Tailwind CSS. Sie soll einen Titel, Preis, eine Liste von Features und einen Call-to-Action-Button enthalten."',
      'Schritt 3: Claude generiert den Code und zeigt ihn im Artifacts-Fenster an. Du siehst sofort eine Live-Vorschau.',
      'Schritt 4: Gib iterative Verbesserungsanweisungen in natürlicher Sprache: "Mache den Button blau und ändere den Titel." Claude aktualisiert den Code und die Vorschau in Echtzeit.'
    ],
    examples: [
      'Ein Frontend-Entwickler erstellte in einer 20-minütigen Live-Session mit einem Product Manager einen kompletten Prototyp für eine neue Landing-Page.',
      'Ein Team nutzte die Funktion, um gemeinsam ein komplexes SQL-Query zu entwickeln und live zu testen, was die Entwicklungszeit von einer Stunde auf 10 Minuten reduzierte.'
    ],
    slug: generateSlug('Der Live-Code-Generator-Trick mit Artifacts'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Die Artifacts-Funktion von Anthropic schafft eine sofortige Feedback-Schleife, eines der Kernprinzipien agiler Entwicklung. Durch die direkte visuelle Repräsentation des Codes wird der Zyklus von "Anweisung -> Ergebnis -> Korrektur" extrem verkürzt, was die Iterationsgeschwindigkeit massiv erhöht.'
  },
  {
    id: '77',
    title: 'Der "Marken-Konstitution"-Trick für konsistente KI-Antworten',
    description: 'Erstelle eine "KI-Verfassung" für deine Marke oder dein Projekt, um sicherzustellen, dass jede von der KI generierte Antwort exakt deinen Werten, deinem Ton und deinen Regeln entspricht.',
    category: 'business',
    difficulty: 'advanced',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '45 Minuten Setup',
    impact: 'high',
    steps: [
      'Schritt 1: Erstelle ein Dokument mit den Grundprinzipien deiner Marke. Formuliere sie als positive Anweisungen (z.B. "Antworte immer hilfsbereit und optimistisch").',
      'Schritt 2: Füge auch strikte Verbote hinzu (z.B. "Verwende niemals Fachjargon ohne ihn zu erklären", "Mache niemals medizinische Ratschläge").',
      'Schritt 3: Beginne jeden wichtigen Prompt mit einer Präambel, die auf diese Verfassung verweist: "Befolge bei deiner Antwort die Prinzipien aus meiner Marken-Konstitution: [Hier die 3-5 wichtigsten Prinzipien einfügen]."',
      'Schritt 4: Bei komplexen Systemen (z.B. einem Kundenservice-Bot) kannst du diese Prinzipien als System-Prompt hinterlegen.'
    ],
    examples: [
      'Ein Finanz-Startup stellte sicher, dass sein KI-Chatbot niemals Anlageberatung gibt, indem es dies als Kernprinzip in seiner Konstitution verankerte.',
      'Ein Luxus-Modelabel trainierte seine KI darauf, immer in einem anspruchsvollen, eleganten Ton zu kommunizieren, was die Markenkonsistenz über alle Kanäle hinweg wahrte.'
    ],
    slug: generateSlug('Der Marken-Konstitution-Trick für konsistente KI-Antworten'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Dieser Trick ist eine praktische Anwendung von Anthropics "Constitutional AI". Indem du der KI ein explizites Set von Regeln und Werten gibst, an das sie sich halten muss, lenkst du ihr Verhalten auf einer fundamentalen Ebene. Dies ist weitaus effektiver als die Korrektur einzelner Ausgaben.'
  },
  {
    id: '78',
    title: 'Der "Handschrift-zu-JSON"-Trick für analoge Notizen',
    description: 'Digitalisiere deine handschriftlichen Notizen, Whiteboard-Skizzen oder Post-its direkt in strukturiertes JSON-Format, bereit für die Weiterverarbeitung in deinen Apps.',
    category: 'data-analysis',
    difficulty: 'beginner',
    tools: ['Claude 3.5 Sonnet'],
    timeToImplement: '5 Minuten',
    impact: 'medium',
    steps: [
      'Schritt 1: Mache ein klares, gut beleuchtetes Foto von deinen handschriftlichen Notizen.',
      'Schritt 2: Lade das Bild in Claude 3.5 Sonnet hoch.',
      'Schritt 3: Gib eine präzise Anweisung, wie die Daten strukturiert werden sollen. Kopiere und passe dies an: "Analysiere das Bild. Transkribiere die handschriftlichen Notizen und extrahiere alle Aufgaben. Formatiere das Ergebnis als JSON-Array von Objekten mit den Schlüsseln `task` (string), `priority` (string: hoch, mittel, niedrig) und `dueDate` (string: YYYY-MM-DD)."',
      'Schritt 4: Kopiere den generierten JSON-Code und importiere ihn in dein Projektmanagement-Tool oder deine Datenbank.'
    ],
    examples: [
      'Ein Projektmanager digitalisierte das Ergebnis eines Team-Brainstormings von einem Whiteboard in 2 Minuten in importierbare Jira-Tickets.',
      'Ein Student wandelte seine handschriftlichen Lernkarten in eine JSON-Datei um, die er direkt in die Anki-App importieren konnte.'
    ],
    slug: generateSlug('Der Handschrift-zu-JSON-Trick für analoge Notizen'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Claudes Vision-Fähigkeiten kombinieren optische Zeichenerkennung (OCR) mit semantischem Verständnis. Die KI liest nicht nur die Wörter, sondern versteht auch den Kontext (z.B. dass ein unterstrichenes Wort mit einem Datum eine Aufgabe mit Deadline ist) und kann diese unstrukturierten Informationen in das von dir geforderte, streng strukturierte Format umwandeln.'
  },
  {
    id: '79',
    title: 'Der "Meta-Prompt"-Trick: Lass die KI den perfekten Prompt schreiben',
    description: 'Verbessere deine Prompt-Qualität, indem du die KI selbst den optimalen Prompt für eine Aufgabe erstellen lässt. Du beschreibst das Ziel, die KI liefert die perfekte Anweisung.',
    category: 'productivity',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '10 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Beschreibe dein gewünschtes Ergebnis in einfacher Sprache (z.B. "Ich will einen LinkedIn-Post, der witzig ist und meine Expertise zeigt").',
      'Schritt 2: Verwende den Meta-Prompt. Kopiere und passe dies an: "Agiere als weltweit führender Prompt-Ingenieur. Mein Ziel ist: [Dein Ziel]. Erstelle einen detaillierten, wiederverwendbaren Prompt, den ich einer anderen KI geben kann, um dieses Ziel zu erreichen. Der Prompt sollte Platzhalter für variable Teile enthalten und Techniken wie Rollenzuweisung und One-Shot-Beispiele nutzen."',
      'Schritt 3: Nimm den von der KI generierten "Master-Prompt".',
      'Schritt 4: Verwende diesen Master-Prompt in einem neuen Chat für deine eigentliche Aufgabe und erlebe den Qualitätsunterschied.'
    ],
    examples: [
      'Ein Anfänger erstellte einen Prompt für die Generierung von Code, der so gut war wie der eines Senior-Entwicklers, was die Fehlerquote um 90% reduzierte.',
      'Ein Marketing-Team entwickelte einen Master-Prompt für die Erstellung von Produktbeschreibungen, der die Conversion Rate auf ihrer E-Commerce-Seite um 20% steigerte.'
    ],
    slug: generateSlug('Der Meta-Prompt-Trick Lass die KI den perfekten Prompt schreiben'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Sprachmodelle sind auf die Struktur und Nuancen von Sprache trainiert. Sie "wissen", welche Art von Anweisung am wahrscheinlichsten zu einem guten Ergebnis führt. Indem du die KI bittest, einen Prompt zu erstellen, nutzt du ihre Fähigkeit zur "Meta-Kognition" – dem Nachdenken über den eigenen Denkprozess – um eine optimale Eingabe zu erzeugen.'
  },
  {
    id: '80',
    title: 'Der "Diagramm-zu-Daten"-Trick für Reports und Präsentationen',
    description: 'Extrahiere die exakten Rohdaten aus einem Balken-, Linien- oder Tortendiagramm in einem Bild oder PDF, ohne die Original-Datenquelle zu besitzen.',
    category: 'data-analysis',
    difficulty: 'beginner',
    tools: ['Claude 3.5 Sonnet'],
    timeToImplement: '5 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Mache einen Screenshot des Diagramms, aus dem du die Daten extrahieren möchtest.',
      'Schritt 2: Lade das Bild in Claude 3.5 Sonnet hoch.',
      'Schritt 3: Gib eine klare Anweisung. Kopiere und passe dies an: "Analysiere das Diagramm in diesem Bild. Extrahiere die zugrundeliegenden Daten so präzise wie möglich. Formatiere das Ergebnis als CSV mit den Spalten [Spaltenname 1] und [Spaltenname 2]."',
      'Schritt 4: Kopiere die generierten CSV-Daten und füge sie in Excel, Google Sheets oder dein Analyse-Tool ein, um sie weiterzuverarbeiten oder neu zu visualisieren.'
    ],
    examples: [
      'Ein Marktanalyst extrahierte die Daten aus einem Konkurrenz-Report-PDF, um sie mit seinen eigenen Daten in einem einzigen Dashboard zu vergleichen.',
      'Eine Studentin digitalisierte die Diagramme aus einem alten Lehrbuch, um die Daten in ihrer eigenen statistischen Analyse zu verwenden.'
    ],
    slug: generateSlug('Der Diagramm-zu-Daten-Trick für Reports und Präsentationen'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Claudes Vision-Fähigkeiten gehen über einfaches OCR hinaus. Das Modell kann die visuellen Elemente eines Diagramms (die Höhe der Balken, die Position der Punkte) im Verhältnis zu den Achsen interpretieren und diese visuellen Informationen in quantitative numerische Daten zurückübersetzen.'
  },
  {
    id: '81',
    title: 'Der "KI-Agenten"-Trick mit Tool Use',
    description: 'Baue einen einfachen, aber mächtigen KI-Agenten, der externe Tools wie eine Taschenrechner- oder Wetter-API nutzen kann, um Fragen zu beantworten, die über sein internes Wissen hinausgehen.',
    category: 'programming',
    difficulty: 'advanced',
    tools: ['Claude 3.5 Sonnet API', 'Python'],
    timeToImplement: '1-2 Stunden',
    impact: 'high',
    steps: [
      'Schritt 1: Definiere deine Tools in einem JSON-Schema, das den Namen, die Beschreibung und die Parameter jedes Tools festlegt (z.B. ein Tool `get_weather` mit dem Parameter `city`).',
      'Schritt 2: Stelle eine Anfrage an die Claude-API mit deinem Prompt (z.B. "Wie ist das Wetter in Berlin?") und der Tool-Definition.',
      'Schritt 3: Claude wird nicht direkt antworten, sondern ein JSON-Objekt zurückgeben, das anzeigt, welches Tool es mit welchen Parametern aufrufen möchte (z.B. `{ "tool_name": "get_weather", "parameters": { "city": "Berlin" } }`).',
      'Schritt 4: Führe in deinem Code die entsprechende Funktion aus (rufe die echte Wetter-API auf) und sende das Ergebnis zurück an Claude, der dann die finale, menschenlesbare Antwort generiert.'
    ],
    examples: [
      'Ein Entwickler baute einen Kundenservice-Bot, der über ein Tool auf die echte Bestelldatenbank zugreifen und Fragen wie "Wo ist meine Bestellung?" beantworten konnte.',
      'Ein Datenanalyst erstellte einen Agenten, der komplexe statistische Berechnungen über eine externe Python-Bibliothek durchführen konnte.'
    ],
    slug: generateSlug('Der KI-Agenten-Trick mit Tool Use'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Dies ist eine praktische Anwendung des "Tool Use" oder "Function Calling"-Features von Anthropic. Es löst das Problem der "Wissens-Abgeschnittenheit" und der Halluzinationen, indem es der KI erlaubt, auf externe, verlässliche Informationsquellen und Rechenfähigkeiten zuzugreifen, anstatt sich nur auf ihr trainiertes Wissen zu verlassen.'
  },
  {
    id: '82',
    title: 'Der "Red Teaming"-Trick zur Absicherung deiner Prompts',
    description: 'Finde die Schwachstellen in deinen eigenen Prompts, bevor es andere tun, indem du eine zweite KI anweist, die Rolle eines "Red Teams" zu übernehmen und deinen Prompt zu "jailbreaken".',
    category: 'programming',
    difficulty: 'advanced',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '20-30 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Finalisiere den Prompt, den du absichern möchtest (z.B. den System-Prompt für deinen Kundenservice-Bot).',
      'Schritt 2: Öffne einen neuen Chat mit einer anderen KI (oder demselben Modell).',
      'Schritt 3: Gib ihr den "Red Teaming"-Auftrag. Kopiere und passe dies an: "Agiere als Sicherheitsexperte (Red Team). Hier ist ein System-Prompt, den ich für einen anderen KI-Bot verwende: --- [Dein Prompt hier einfügen] ---. Deine Aufgabe ist es, 5 kreative Wege zu finden, wie ein Nutzer diesen Prompt manipulieren oder umgehen könnte, um die KI dazu zu bringen, gegen ihre Regeln zu verstoßen. Liste die potenziellen Angriffs-Prompts auf."',
      'Schritt 4: Nutze die gefundenen Schwachstellen, um deinen ursprünglichen Prompt zu härten und widerstandsfähiger zu machen.'
    ],
    examples: [
      'Ein Unternehmen verhinderte, dass Nutzer ihren Support-Bot dazu bringen konnten, Rabattcodes herauszugeben, die nicht für sie bestimmt waren.',
      'Ein Entwickler schloss eine Lücke in seinem KI-Agenten, die es ermöglicht hätte, interne Systeminformationen preiszugeben.'
    ],
    slug: generateSlug('Der Red Teaming-Trick zur Absicherung deiner Prompts'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Dieser Prozess, "Red Teaming" genannt, ist eine Standard-Sicherheitspraxis, die von Unternehmen wie Anthropic selbst verwendet wird, um die Sicherheit ihrer Modelle zu testen. Indem du eine KI darauf ansetzt, eine andere KI zu überlisten, nutzt du ihre Kreativität und ihr Mustererkennungsvermögen, um Schwachstellen zu finden, an die ein Mensch vielleicht nicht gedacht hätte.'
  },
  {
    id: '83',
    title: 'Der "Chain of Density"-Trick für perfekte Zusammenfassungen',
    description: 'Erstelle extrem dichte und informationsreiche Zusammenfassungen von langen Texten, indem du die KI iterativ anweist, mehr Entitäten hinzuzufügen, ohne an Länge zu gewinnen.',
    category: 'learning',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '10 Minuten pro Text',
    impact: 'high',
    steps: [
      'Schritt 1: Gib der KI einen langen Text und bitte um eine erste, kurze Zusammenfassung (ca. 3 Sätze).',
      'Schritt 2: Nimm diese Zusammenfassung und gib sie zusammen mit dem Originaltext erneut an die KI mit dem Prompt: "Hier ist der Originaltext und eine erste Zusammenfassung. Deine Aufgabe ist es, die Zusammenfassung zu überarbeiten. Sie soll genauso lang bleiben, aber 1-2 zusätzliche, wichtige Entitäten (Namen, Orte, Konzepte) aus dem Originaltext enthalten, die bisher fehlen."',
      'Schritt 3: Wiederhole Schritt 2 zwei- bis dreimal.',
      'Schritt 4: Das Ergebnis ist eine extrem "dichte" Zusammenfassung, die die maximale Menge an Information auf minimalem Raum enthält.'
    ],
    examples: [
      'Ein Analyst erstellte ein Executive Summary eines 100-seitigen Reports, das so präzise war, dass die Führungsebene keine weiteren Fragen hatte.',
      'Ein Student fasste ein komplexes wissenschaftliches Paper so gut zusammen, dass er die Kernargumente in einer mündlichen Prüfung perfekt wiedergeben konnte.'
    ],
    slug: generateSlug('Der Chain of Density-Trick für perfekte Zusammenfassungen'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Diese Methode, "Chain of Density" (Adams et al., 2023), zwingt die KI, einen Kompromiss zwischen Kürze und Informationsgehalt zu finden. Anstatt nur zu kürzen, muss das Modell aktiv entscheiden, welche Informationen am wichtigsten sind, und den Text so umformulieren, dass mehr davon auf dem gleichen Raum Platz findet. Dies führt zu qualitativ hochwertigeren Zusammenfassungen.'
  },
  {
    id: '84',
    title: 'Der "Dynamische Persona"-Trick für personalisierte Erlebnisse',
    description: 'Erstelle KI-Anwendungen, die ihre Persönlichkeit und ihren Kommunikationsstil dynamisch an den jeweiligen Nutzer anpassen, um die Nutzerbindung zu maximieren.',
    category: 'design',
    difficulty: 'advanced',
    tools: ['Claude API', 'ChatGPT API'],
    timeToImplement: '2-3 Stunden',
    impact: 'high',
    steps: [
      'Schritt 1: Definiere 3-5 Kern-Personas für deine Nutzer (z.B. "Der Anfänger", "Der Experte", "Der Skeptiker").',
      'Schritt 2: Erstelle für jede Persona einen kurzen System-Prompt, der ihren Ton und ihre Prioritäten beschreibt (z.B. "Du bist ein geduldiger Lehrer. Erkläre alles einfach und ohne Fachjargon.").',
      'Schritt 3: Analysiere die erste Anfrage eines Nutzers mit einer separaten KI-Instanz, um die passende Persona zu identifizieren ("Welcher Persona entspricht dieser Nutzer am ehesten?").',
      'Schritt 4: Führe die eigentliche Konversation mit dem dynamisch ausgewählten System-Prompt, um dem Nutzer ein maßgeschneidertes Erlebnis zu bieten.'
    ],
    examples: [
      'Eine Lern-App passt ihre Erklärungen automatisch an, je nachdem, ob ein Schüler als "visueller Lerner" oder "pragmatischer Anwender" eingestuft wird.',
      'Ein KI-Coach für mentale Gesundheit wechselt zwischen einem unterstützenden, empathischen und einem motivierenden, fordernden Ton, je nach Gemütszustand des Nutzers.'
    ],
    slug: generateSlug('Der Dynamische Persona-Trick für personalisierte Erlebnisse'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Personalisierung ist ein Schlüsselfaktor für Nutzerengagement. Dieser Trick automatisiert die Personalisierung auf der fundamentalsten Ebene – dem Kommunikationsstil. Indem die KI sich an den Nutzer anpasst, anstatt umgekehrt, entsteht eine tiefere, vertrauensvollere und effektivere Interaktion.'
  },
  {
    id: '85',
    title: 'Die 5‑Phasen‑App‑Strategie: Von der Idee zum Claude‑Produkt',
    description: 'Unterteile die Entwicklung deiner Claude‑App in fünf klar definierte Phasen – so behältst du den Überblick und minimierst Fehler von Anfang an.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude 3.5 Sonnet', 'ChatGPT-4o'],
    timeToImplement: '2–4 Tage',
    impact: 'high',
    steps: [
      'Schritt 1: Setup & Planung – definiere Ziele, richte deine Entwicklungsumgebung ein und hole die API-Schlüssel.',
      'Schritt 2: API-Integration – implementiere die Authentifizierung, erstelle eine robuste Fehlerbehandlung und designe deine Prompts.',
      'Schritt 3: User Interface – entwickle eine intuitive Oberfläche, die mit deinem Backend kommuniziert.',
      'Schritt 4: Advanced Features – füge Kontextspeicher, Datenbankanbindung oder weitere Services hinzu.',
      'Schritt 5: Test & Deployment – führe Unit- und Integrationstests durch, optimiere für die Produktion und stelle deine App bereit.'
    ],
    examples: [
      'Ein Startup erstellte mit dieser Methode einen lauffähigen Prototyp in einer Woche statt der üblichen vier Wochen.',
      'Ein Team halbierte seine Fehlerrate, weil es eine explizite Testphase einplante und keine Stufe übersprang.'
    ],
    slug: 'die-5-phasen-app-strategie-von-der-idee-zum-claude-produkt',
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Eine klare Phasenstruktur reduziert Komplexität. Wie beim agilen Projektmanagement führen definierte Milestones zu schnelleren Feedback-Zyklen, weniger technischen Schulden und höherer Codequalität.'
  },
  {
    id: '86',
    title: 'Prompt‑Design als Superpower: Maximale KI‑Qualität in 5 Minuten',
    description: 'Verbessere die Qualität der KI‑Antworten dramatisch, indem du deine Prompts mit klarer Struktur, Kontext und Einschränkungen versiehst.',
    category: 'content-creation',
    difficulty: 'beginner',
    tools: ['Claude 3.5 Sonnet', 'ChatGPT-4o'],
    timeToImplement: '5 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Lege Ziel und Kontext fest – was soll die KI wissen und erreichen?',
      'Schritt 2: Formuliere klare Anweisungen und gewünschte Ausgaben (z. B. Länge, Format).',
      'Schritt 3: Füge Beispiele oder implizites Wissen als separate Kontextsektion hinzu und liste Tabus auf.',
      'Schritt 4: Teste den Prompt und passe ihn an, bis die Antworten deinen Erwartungen entsprechen.'
    ],
    examples: [
      'Ein Autor steigerte die Relevanz seiner Antworten um 80 %, indem er präzise Prompts mit Beispielen nutzte.',
      'Eine Marketingmanagerin reduzierte die Zahl der Rückfragen erheblich, nachdem sie implizite Informationen (Budget, Tonalität) im Prompt explizit gemacht hatte.'
    ],
    slug: 'prompt-design-als-superpower-maximale-ki-qualitaet-in-5-minuten',
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Sprachmodelle arbeiten nur mit den Informationen, die sie erhalten. Durch strukturiertes Prompt-Design grenzen sie den Lösungsraum ein und verbessern die Relevanz der Antworten – ein Prinzip, das in der Promptforschung als „Implied Context" bekannt ist.'
  },
  {
    id: '87',
    title: 'Der Kosten‑Latenz‑Sicherheits‑Check für Claude‑Projekte',
    description: 'Reduziere Ausgaben und technische Risiken, indem du vor dem Launch einer KI‑App gezielt Kosten, Latenz und Sicherheitsaspekte analysierst.',
    category: 'business',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '30 Minuten Analyse',
    impact: 'medium',
    steps: [
      'Schritt 1: Kalkuliere Token-Verbrauch und API-Kosten für typische Nutzerfälle.',
      'Schritt 2: Plane asynchrone Prozesse (z. B. WebSockets, Hintergrundjobs), um variable Antwortzeiten abzufangen.',
      'Schritt 3: Implementiere robustes Error-Handling und Logging, damit Fehler die Nutzererfahrung nicht beeinträchtigen.',
      'Schritt 4: Sichere API-Schlüssel ab, setze Rate-Limits und verschlüssele sensible Daten.'
    ],
    examples: [
      'Ein Unternehmen senkte die monatlichen API-Kosten um 5.000 €, indem es den Token-Verbrauch pro Aufruf optimierte.',
      'Ein Entwickler verbesserte die Zufriedenheit der Anwender, weil asynchrone Antworten lange Wartezeiten verstecken.'
    ],
    slug: 'der-kosten-latenz-sicherheits-check-fuer-claude-projekte',
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Proaktives Risikomanagement verhindert böse Überraschungen. Wer Kosten, Latenz und Sicherheit von Anfang an adressiert, vermeidet nachträgliche teure Anpassungen und schafft ein zuverlässigeres Produkt.'
  },
  {
    id: '88',
    title: 'Der Business‑Wert‑Analyzer: 3‑Stufen‑ROI‑Methode',
    description: 'Identifiziere die profitabelsten Automatisierungsprojekte, indem du Prozesse nach Pain Points, Machbarkeit und Return on Investment bewertest.',
    category: 'business',
    difficulty: 'intermediate',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '60 Minuten',
    impact: 'high',
    steps: [
      'Schritt 1: Finde Prozesse mit hoher Frustration, Fehlerquote oder Verzögerungen (Pain-Point-Analyse).',
      'Schritt 2: Beurteile, ob diese Prozesse realistisch von KI automatisiert werden können oder ob ein einfacheres Mittel ausreicht.',
      'Schritt 3: Berechne den ROI, indem du direkte Einsparungen (Arbeitszeit, Fehlerkosten) und indirekte Vorteile (Kundenzufriedenheit, Geschwindigkeit) quantifizierst.'
    ],
    examples: [
      'Ein Finanzdienstleister verdoppelte seine Onboarding-Geschwindigkeit und sparte gleichzeitig 10.500 € pro Monat, indem er nur Projekte mit hohem ROI umsetzte.',
      'Eine HR-Abteilung erkannte, dass ein Recruiting-Prozess nicht automatisiert werden sollte, weil der erwartete ROI zu gering war.'
    ],
    slug: 'der-business-wert-analyzer-3-stufen-roi-methode',
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Durch das Quantifizieren von Nutzen und Aufwand werden unproduktive Projekte frühzeitig aussortiert. Unternehmen wie Amazon nutzen ähnliche Verfahren, um Ressourcen gezielt dort einzusetzen, wo sie den größten Hebel haben.'
  },
  {
    id: '89',
    title: 'Der Quick‑Win‑Priorisierer: Impact‑Effort‑Matrix im Einsatz',
    description: 'Setze deine Ressourcen sinnvoll ein, indem du Projekte nach Nutzen und Aufwand in einer Matrix einordnest und zuerst die Quick Wins realisierst.',
    category: 'business',
    difficulty: 'beginner',
    tools: ['Claude', 'ChatGPT'],
    timeToImplement: '20 Minuten',
    impact: 'medium',
    steps: [
      'Schritt 1: Zeichne eine Matrix mit den Achsen „Impact" (Nutzen) und „Effort" (Aufwand).',
      'Schritt 2: Platziere alle potenziellen Projekte oder Automatisierungen auf dieser Matrix.',
      'Schritt 3: Identifiziere Quick Wins (hoher Impact, niedriger Aufwand), strategische Projekte (hoch/hoch), Fill-ins (niedrig/niedrig) und Aufgaben, die du vermeiden solltest (niedriger Impact, hoher Aufwand).',
      'Schritt 4: Starte mit den Quick Wins, plane die strategischen Projekte langfristig und eliminiere unwirtschaftliche Ideen.'
    ],
    examples: [
      'Ein Startup wählte zwei Quick-Win-Automationen und sparte sofort 15 Stunden Arbeit pro Woche.',
      'Ein Manager stoppte ein Low-Impact-High-Effort-Projekt und setzte die frei gewordenen Ressourcen für ein profitableres Vorhaben ein.'
    ],
    slug: 'der-quick-win-priorisierer-impact-effort-matrix-im-einsatz',
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Eine visuelle Übersicht erleichtert Entscheidungen. Die Impact-Effort-Matrix verhindert, dass Teams sich in ressourcenintensive Projekte verrennen und sorgt für schnelle Erfolgserlebnisse, die Motivation schaffen.'
  },
  {
    id: '90',
    title: 'Der Netzwerk‑Effekt‑Trick: Skalierbare Agenten erfolgreich einsetzen',
    description: 'Erzeuge exponentiellen Mehrwert, indem du Agenten so implementierst, dass sie skalieren, Daten teilen und voneinander lernen.',
    category: 'business',
    difficulty: 'advanced',
    tools: ['Claude'],
    timeToImplement: '45 Minuten Analyse',
    impact: 'high',
    steps: [
      'Schritt 1: Identifiziere Prozesse, bei denen Automatisierung eine 10×-Skalierung ohne proportional steigende Kosten ermöglicht.',
      'Schritt 2: Implementiere Agenten, die Daten und Erkenntnisse untereinander teilen (z. B. durch eine zentrale Wissensdatenbank).',
      'Schritt 3: Überwache die Leistungskennzahlen (Skalierbarkeit, Fehlerquoten) und erkenne, wie sich der Nutzen bei höherer Last verhält.',
      'Schritt 4: Weite das System auf weitere Geschäftsbereiche aus, um den Netzwerk-Effekt zu vergrößern.'
    ],
    examples: [
      'Ein E‑Commerce-Anbieter vervierfachte seine Auftragsabwicklung, ohne zusätzliches Personal zu benötigen, weil Agenten gemeinsam lernten.',
      'Ein Service-Team reduzierte Fehler um 90 %, da die Agenten ihre Erfahrungen über verschiedene Workflows hinweg teilten.'
    ],
    slug: 'der-netzwerk-effekt-trick-skalierbare-agenten-erfolgreich-einsetzen',
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Autonome Agenten erzeugen steigenden Wert, wenn sie skaliert werden und voneinander lernen. Ökonomisch spricht man von „increasing returns to scale" – je mehr Prozesse automatisiert sind, desto größer der Gesamtnutzen.'
  },
  {
    id: '91',
    title: 'Cloud vs. Lokal: Der LLM‑Entscheidungs‑Guide',
    description: 'Finde heraus, ob ein Cloud‑Modell oder ein lokaler LLM besser zu deinem Projekt passt, indem du Privatsphäre, Kosten, Leistung und Hardwareanforderungen vergleichst.',
    category: 'programming',
    difficulty: 'beginner',
    tools: ['Claude', 'ChatGPT', 'Ollama', 'llama.cpp'],
    timeToImplement: '30 Minuten Recherche',
    impact: 'medium',
    steps: [
      'Schritt 1: Definiere deine Anforderungen – benötigst du Datenschutz, Offline-Fähigkeit oder maximale Rechenleistung?',
      'Schritt 2: Vergleiche die großen Cloud-Anbieter (OpenAI, Anthropic, Google, Amazon) in Bezug auf Kosten, Performance und Safety-Features.',
      'Schritt 3: Prüfe lokale Optionen wie Ollama oder llama.cpp und wähle passende Modelle (Llama 2/3, Mistral 7B, Code Llama, Phi‑3).',
      'Schritt 4: Bewerte deine Hardware – 8–16 GB RAM für 7B-Modelle, 32 GB+ für größere Varianten; GPU-Beschleunigung erhöht die Geschwindigkeit.',
      'Schritt 5: Entscheide dich für Cloud oder lokal und implementiere gegebenenfalls Quantisierung, um Speicherbedarf zu reduzieren.'
    ],
    examples: [
      'Ein Arzt wählte eine lokale LLM-Lösung, um Patientendaten zu schützen und ohne Internetverbindung arbeiten zu können.',
      'Ein Start-up setzte auf Cloud-LLMs, um ohne Investitionen in teure Hardware schnell skalieren zu können.'
    ],
    slug: 'cloud-vs-lokal-der-llm-entscheidungs-guide',
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Die Entscheidung zwischen Cloud und lokal beeinflusst Kosten, Datenschutz und Leistungsfähigkeit. Indem du die Kriterien systematisch abwägst, vermeidest du Fehlentscheidungen und investierst in die für dich beste Lösung.'
  },
  {
    id: '92',
    title: 'Der Kontext‑Manager: Immer den Überblick im Chat',
    description: 'Halte lange KI‑Unterhaltungen kohärent, indem du das Kontextfenster intelligent verwaltest und ältere Nachrichten zusammenfasst.',
    category: 'programming',
    difficulty: 'advanced',
    tools: ['Claude'],
    timeToImplement: '45 Minuten Implementierung',
    impact: 'high',
    steps: [
      'Schritt 1: Implementiere einen Conversation-Manager, der jede Nachricht mit Rolle, Inhalt, Zeitstempel und Token-Anzahl speichert.',
      'Schritt 2: Lege eine maximale Kontextlänge fest und berechne regelmäßig die Gesamtanzahl der Tokens.',
      'Schritt 3: Führe Smart Context Pruning durch – behalte Systemnachrichten und die letzten 10 Nachrichten, fasse den mittleren Teil der Unterhaltung in einer Zusammenfassung zusammen.',
      'Schritt 4: Speichere den Konversationszustand persistent (z. B. in einer Datenbank), um Unterhaltungen über mehrere Sitzungen hinweg fortzusetzen.',
      'Schritt 5: Implementiere optional Conversation-Branching, um alternative Gesprächsverläufe zu erkunden.'
    ],
    examples: [
      'Ein Chatbot blieb auch nach über 100 Nachrichten kohärent, da ältere Teile der Konversation automatisch zusammengefasst wurden.',
      'Eine Support-App ermöglichte es Nutzern, auf verschiedenen Geräten weiterzumachen, weil die Gesprächshistorie persistent gespeichert war.'
    ],
    slug: 'der-kontext-manager-immer-den-ueberblick-im-chat',
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Große Sprachmodelle haben begrenzte Kontextfenster. Durch intelligentes Kürzen und Persistieren bleiben relevante Informationen erhalten, während überflüssiger Ballast entfernt wird – das steigert die Konsistenz und Qualität der Antworten.'
  },
  {
    id: '93',
    title: 'Der Flow‑State‑Coding‑Trick: Mehr Produktivität durch Vibe‑Workflows',
    description: 'Passe deine Coding‑Workflows an deine Energiezustände an und vermeide Unterbrechungen, um im Flow zu bleiben und produktiver zu werden.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude', 'IDE'],
    timeToImplement: '30 Minuten Setup',
    impact: 'medium',
    steps: [
      'Schritt 1: Identifiziere deine drei Arbeitsmodi: Exploration (schnelles Prototyping), Refinement (Code-Qualität und Tests) und Maintenance (Fehlerbehebung und Dokumentation).',
      'Schritt 2: Richte für jeden Modus ein eigenes Workflow-Profil ein – z. B. Hot Reloading und visuelle Tools für Exploration, umfangreiche Tests und Linter für Refinement.',
      'Schritt 3: Schalte Tools kontextabhängig ein und aus, damit sie dich nicht aus dem Flow reißen (z. B. keine Pop-up-Benachrichtigungen im Exploration Mode).',
      'Schritt 4: Reflektiere regelmäßig deine Frustrationspunkte und optimiere den Workflow entsprechend.'
    ],
    examples: [
      'Ein Entwickler programmierte ein neues Feature in der Hälfte der Zeit, nachdem er zwischen Exploration- und Refinement-Modus wechselte, statt alles in einem einzigen Setup zu machen.',
      'Ein Team reduzierte den Zeitverlust durch Tool-Switching, indem es Konfigurationen automatisch je nach Modus anpasste.'
    ],
    slug: 'der-flow-state-coding-trick-mehr-produktivitaet-durch-vibe-workflows',
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Die Psychologie zeigt, dass Unterbrechungen den „Flow"-Zustand zerstören. Adaptive Workflows minimieren Kontextwechsel und passen sich an das aktuelle Energielevel an – das steigert Kreativität und Effizienz.'
  },
  {
    id: '94',
    title: 'CLAUDE.md & Prompt Improver: Deinen Kontext perfektionieren',
    description: 'Richte eine CLAUDE.md‑Datei ein und nutze den Prompt Improver, um häufige Befehle, Code‑Konventionen und Workflows zu dokumentieren und so deine Entwicklungsumgebung zu optimieren.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude Code'],
    timeToImplement: '30 Minuten',
    impact: 'high',
    steps: [
      'Lege eine Datei `CLAUDE.md` im Wurzelverzeichnis deines Projekts oder eines Elternverzeichnisses an. Halte sie prägnant und menschenlesbar und dokumentiere darin häufige Bash‑Befehle, Kern‑Dateien, Code‑Stil und Testanweisungen.',
      'Nutze die `#`‑Taste in Claude Code, um während der Arbeit neue Erkenntnisse direkt in die `CLAUDE.md` aufzunehmen. Dadurch wird der Kontext automatisch in künftige Sessions geladen.',
      'Verwende den **Prompt Improver**, um die `CLAUDE.md` zu verfeinern: markiere wichtige Anweisungen mit Betonungen wie **WICHTIG** oder **MUST**, um die Einhaltung zu erhöhen.',
      'Checke die Datei ins Versionskontrollsystem ein, damit dein Team von den verbesserten Prompts profitiert.'
    ],
    examples: [
      'Ein Entwicklerteam erstellte eine Projektweite `CLAUDE.md`, die alle wichtigen CLI‑Befehle und Code‑Stilregeln enthielt. Dadurch reduzierte sich die Anzahl der Kontextfragen an Claude Code um 50 %.',
      'Durch regelmäßige Verfeinerung mit dem Prompt Improver erhöhten sich die Trefferquoten der KI‑Antworten deutlich, weil alle relevanten Projektstandards explizit in der Datei verankert waren.'
    ],
    slug: generateSlug('CLAUDE.md & Prompt Improver Deinen Kontext perfektionieren'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Claude Code zieht Inhalte aus `CLAUDE.md` automatisch als Kontext in jede Session. Durch das Dokumentieren von Befehlen und Stilregeln erhöhst du die Konsistenz der Antworten. Die Prompt‑Verbesserung sorgt dafür, dass wichtige Regeln klar hervorgehoben sind, was laut der Dokumentation von Anthropic die Befolgung verbessert.'
  },
  {
    id: '95',
    title: 'Tool‑Permissions Manager: Sicher automatisieren',
    description: 'Verwalte die Liste der erlaubten Tools in Claude Code, um gefährliche Aktionen zu verhindern und gleichzeitig effizientes Arbeiten zu ermöglichen.',
    category: 'programming',
    difficulty: 'beginner',
    tools: ['Claude Code'],
    timeToImplement: '10 Minuten',
    impact: 'medium',
    steps: [
      'Wenn Claude Code um Erlaubnis bittet, kannst du auf **Always allow** klicken, um den Aufruf dauerhaft zuzulassen (z. B. für `git commit`).',
      'Nutze den Befehl `/permissions`, um Tools zur Allowlist hinzuzufügen oder zu entfernen. Beispielsweise erlaubt `mcp_puppeteer__puppeteer_navigate` die Steuerung eines Browser‑MCP‑Servers.',
      'Bearbeite die Datei `~/.claude/settings.json` bzw. `~/.claude.json`, um globale erlaubte Tools zu definieren, oder hinterlege die Konfiguration im Projekt, damit dein Team sie teilt.',
      'Verwende die CLI‑Option `--allowlist`, um in einzelnen Sessions nur bestimmte Tools freizuschalten – ideal für isolierte Workflows.'
    ],
    examples: [
      'Ein Team ermöglichte den automatischen Commit mit `git commit` und verhinderte gleichzeitig versehentliche File‑Edits, indem es nur ausgewählte Befehle in die Allowlist aufnahm.',
      'Durch das Entfernen unsicherer Tools aus der Allowlist konnte ein Entwickler sicherstellen, dass versehentliche Ausführungen (z. B. Deploy‑Scripts) nicht ohne Freigabe laufen.'
    ],
    slug: generateSlug('Tool-Permissions Manager Sicher automatisieren'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Claude Code ist standardmäßig konservativ und fordert für jede potenziell gefährliche Aktion eine Bestätigung. Durch eine gepflegte Allowlist kannst du repetitive Aufgaben automatisieren, ohne Sicherheit einzubüßen. Die Dokumentation beschreibt vier Möglichkeiten zur Verwaltung der Allowlist, um den Workflow sicher und flexibel zu gestalten.'
  },
  {
    id: '96',
    title: 'Slash‑Befehle für wiederkehrende Aufgaben',
    description: 'Automatisiere häufige Workflows, indem du eigene Slash‑Commands erstellst, die prompt‑basierte Anweisungen mit Parametern enthalten.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude Code', 'GitHub CLI'],
    timeToImplement: '20 Minuten Setup',
    impact: 'medium',
    steps: [
      'Lege im Verzeichnis `.claude/commands` eine Markdown‑Datei für deinen Slash‑Command an, z. B. `fix-github-issue.md`.',
      'Schreibe in die Datei einen strukturierten Prompt und verwende den Platzhalter `$ARGUMENTS`, um Parameter zur Laufzeit einzufügen. Beispiel: „Bitte analysiere und behebe das GitHub Issue: $ARGUMENTS. Folge diesen Schritten: ...".',
      'Speichere die Datei. Der Befehl steht nun über `/fix-github-issue` zur Verfügung. Du kannst ihn mit Argumenten aufrufen, z. B. `/fix-github-issue 1234`.',
      'Checke die Datei ins Repository ein oder lege sie global unter `~/.claude/commands` ab, damit du sie projektübergreifend nutzen kannst.'
    ],
    examples: [
      'Ein Entwickler automatisierte das Beheben von GitHub‑Issues, indem er einen Slash‑Command erstellte, der das Issue analysiert, den Code anpasst, Tests schreibt und eine Pull‑Request erstellt.',
      'Ein Team legte ein Set von Slash‑Commands für wiederkehrende Datenbank‑Migrations‑Tasks an und reduzierte die Bearbeitungszeit pro Ticket um 70 %.'
    ],
    slug: generateSlug('Slash-Befehle für wiederkehrende Aufgaben'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Durch das Speichern von Prompt‑Vorlagen als Dateien werden Abläufe reproduzierbar. Slash‑Commands erlauben es, Parameter zu übergeben und komplexe Aufgaben ohne erneutes Prompt‑Schreiben auszuführen. Laut dem Guide können diese Dateien sogar versioniert werden, sodass Teams gemeinsam darauf zugreifen können.'
  },
  {
    id: '97',
    title: 'Exploration‑Plan‑Commit: Der Claude‑Workflow für neue Features',
    description: 'Nutze einen strukturierten Vier‑Phasen‑Prozess, um komplexe Probleme mit Claude Code anzugehen: erkunden, planen, implementieren und committen.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude Code'],
    timeToImplement: '15–30 Minuten pro Aufgabe',
    impact: 'high',
    steps: [
      'Phase 1 – Exploration: Bitte Claude, relevante Dateien oder Abschnitte zu lesen (z. B. „lies das File `logging.py`") und stelle Fragen, um das Problem zu verstehen. In diesem Schritt kannst du Unteragenten einsetzen, um Details zu prüfen, ohne Kontext zu verlieren.',
      'Phase 2 – Planung: Verwende das Schlüsselwort „think", um Claude zur erweiterten Analyse zu bewegen, und lasse einen detaillierten Implementierungsplan erstellen. Überprüfe und bestätige den Plan, bevor du mit dem Coding beginnst.',
      'Phase 3 – Umsetzung: Bitte Claude, den Plan Schritt für Schritt umzusetzen, aber fordere es auf, Tests zu bestehen und nichts zu überstürzen. Überwache das Ergebnis und unterbreche bei Bedarf mit Esc, um Kurskorrekturen vorzunehmen.',
      'Phase 4 – Commit: Nachdem das Ergebnis deinen Erwartungen entspricht, lass Claude einen Commit mitsamt Beschreibung erstellen (oder erstelle selbst einen). Dieser Commit kann z. B. Release‑Notes oder Changelogs aktualisieren.'
    ],
    examples: [
      'Ein Entwickler löste ein kniffliges Logging‑Problem, indem er Claude zuerst das gesamte Logging‑Modul lesen und eine Lösung planen ließ. Nach der Umsetzung und dem Commit war der Bug behoben, ohne dass der Entwickler eigene Recherchen anstellen musste.',
      'Ein Team nutzte den Planungs‑Schritt, um vorab mögliche Edge‑Cases zu identifizieren. Dadurch vermieden sie unnötige Iterationen und setzten das Feature fehlerfrei um.'
    ],
    slug: generateSlug('Exploration-Plan-Commit Der Claude-Workflow für neue Features'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Der Guide empfiehlt, Aufgaben in separate Phasen zu unterteilen. Durch eine Explorations‑ und Planungsphase wird Kontext aufgebaut und die KI auf das Problem fokussiert, bevor Code erzeugt wird. Dies verbessert die Qualität des Ergebnisses erheblich und reduziert Fehlversuche.'
  },
  {
    id: '98',
    title: 'TDD mit Claude Code: Tests zuerst, Code danach',
    description: 'Setze Test‑getriebene Entwicklung mit Claude Code um, indem du zuerst Tests schreibst, dann den Code erzeugen lässt und erst committest, wenn alle Tests bestehen.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude Code'],
    timeToImplement: '30 Minuten pro Feature',
    impact: 'high',
    steps: [
      'Bitte Claude, anhand von erwarteten Input/Output‑Paaren eine Test‑Suite zu schreiben. Sei explizit, dass du TDD betreibst und keine Mock‑Implementationen in den Tests akzeptierst.',
      'Lass Claude die Tests ausführen und dir die fehlschlagenden Fälle zeigen. Durch das klare Feedback weißt du, worauf sich die Implementierung konzentrieren muss.',
      'Beauftrage Claude, Code zu schreiben, der die Tests besteht. Sage ausdrücklich, dass es die Tests nicht ändern darf. Lass es iterieren, bis alle Tests grün sind.',
      'Committe den Code erst, wenn alle Tests bestanden sind. Eventuell möchtest du eine zweite Claude‑Instanz beauftragen, sicherzustellen, dass die Implementierung nicht übermäßig auf die Testfälle optimiert.'
    ],
    examples: [
      'Ein Projekt mit hoher Qualitätsanforderung schrieb zunächst 20 Unit‑Tests für eine neue API‑Funktion. Claude Code implementierte die Funktion in drei Iterationen und bestand schließlich alle Tests.',
      'Ein Entwicklerpaar reduzierte die Zahl der Regressionen massiv, indem es Claude erst nach bestandenem Testlauf committen ließ.'
    ],
    slug: generateSlug('TDD mit Claude Code Tests zuerst Code danach'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Tests vor dem Code zu definieren zwingt die KI, die Anforderungen präzise zu erfüllen. Der Guide betont, dass die explizite Reihenfolge (Tests → Code → Commit) hilft, Overfitting zu vermeiden und die Qualität des Codes zu sichern.'
  },
  {
    id: '99',
    title: 'Visuelle Iteration: Screenshots für perfektes UI‑Coding',
    description: 'Nutze Screenshots oder Mock‑Ups, um Claude Code die gewünschte Optik zu zeigen und iteriere, bis das Ergebnis exakt dem Bild entspricht.',
    category: 'design',
    difficulty: 'intermediate',
    tools: ['Claude Code', 'Puppeteer MCP'],
    timeToImplement: '20–30 Minuten',
    impact: 'high',
    steps: [
      'Erstelle ein visuelles Mock‑Up deines UI‑Ziels (z. B. in Figma) oder mach einen Screenshot des gewünschten Ergebnisses.',
      'Gib Claude eine Möglichkeit, Screenshots zu sehen: entweder über den Puppeteer MCP‑Server oder durch Drag‑&‑Drop bzw. Pfadangabe der Bilddatei.',
      'Bitte Claude, den Code zu schreiben oder anzupassen, sodass er dem Mock‑Up entspricht, und fordere anschließend einen Screenshot des Ergebnisses an.',
      'Vergleiche den Screenshot mit dem Zielbild und gib weitere Anweisungen wie „mache den Button blau" oder „die Abstände sind zu groß". Wiederhole den Prozess, bis das Ergebnis passt.'
    ],
    examples: [
      'Ein UX‑Designer gab Claude eine Mock‑Up‑Grafik für eine Landing‑Page. Nach drei Iterationen stimmte das generierte React‑Layout pixelgenau mit dem Mock‑Up überein.',
      'Ein Entwickler nutzte den Screenshot‑Workflow, um Farbfehler in einem Balkendiagramm zu beheben: „[Image pasted] update the chart to make the bars green".'
    ],
    slug: generateSlug('Visuelle Iteration Screenshots für perfektes UI-Coding'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Menschen beurteilen Oberflächen visuell, daher sind Bilder ein starkes Feedbacksignal. Claude Code kann Bilder interpretieren und auf dieser Grundlage Code iterativ anpassen. Der Guide empfiehlt, Screenshots direkt zu pasten oder per Datei einzubinden, um visuelle Qualität zu erreichen.'
  },
  {
    id: '100',
    title: 'Safe‑YOLO Mode: Batch‑Aufgaben ohne Unterbrechung',
    description: 'Führe umfangreiche, risikoarme Tasks wie Lint‑Fixes oder Boilerplate‑Generierung ohne ständige Abfragen aus, indem du Claude Code im Safe‑YOLO‑Modus betreibst – aber in einer isolierten Umgebung.',
    category: 'programming',
    difficulty: 'advanced',
    tools: ['Claude Code'],
    timeToImplement: '5 Minuten Setup',
    impact: 'medium',
    steps: [
      'Starte Claude Code mit dem Flag `--dangerously-skip-permissions` (Safe‑YOLO‑Modus), um alle Genehmigungsabfragen zu überspringen.',
      'Nutze diesen Modus ausschließlich für ungefährliche oder revertierbare Aufgaben wie Lint‑Korrekturen, Typ‑Fixes oder das Erzeugen von Boilerplate‑Code.',
      'Führe Safe‑YOLO‑Sessions in einem Container ohne Internetzugang durch, damit keine unbeabsichtigten Kommandos deine reale Umgebung verändern oder Daten exfiltrieren.',
      'Beende den Modus nach Abschluss der Aufgabe und prüfe die Änderungen, bevor du sie in die produktive Codebasis zurückführst.'
    ],
    examples: [
      'Ein Entwickler reparierte 200 Lint‑Fehler in wenigen Minuten, ohne jede einzelne Berechtigung bestätigen zu müssen, indem er Safe‑YOLO in einem Docker‑Container nutzte.',
      'Ein Team generierte komplette Projekt‑Skeletons (Next.js + Tailwind + Auth) ohne Unterbrechung und verschob den Code anschließend manuell ins Hauptrepository.'
    ],
    slug: generateSlug('Safe-YOLO Mode Batch-Aufgaben ohne Unterbrechung'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Der Safe‑YOLO‑Modus deaktiviert die Permission‑Prompts von Claude Code, was die Ausführung repetitiver Aufgaben stark beschleunigt. Das Risiko wird durch Ausführen in einem isolierten Container begrenzt, wie der Guide empfiehlt, um Datenverlust oder Sicherheitspannen zu vermeiden.'
  },
  {
    id: '101',
    title: 'Codebase Q&A: Schnell in neue Projekte einsteigen',
    description: 'Nutze Claude Code wie einen erfahrenen Kollegen: Stell Fragen zur Codebase in natürlicher Sprache und lass dir die Antworten agentisch aus dem Projektcode extrahieren.',
    category: 'learning',
    difficulty: 'beginner',
    tools: ['Claude Code'],
    timeToImplement: '5 Minuten',
    impact: 'high',
    steps: [
      'Formuliere Fragen, die du einem Teammitglied stellen würdest, z. B.: „Wie funktioniert die Logging‑Architektur?", „Wie erstelle ich ein neues API‑Endpoint?" oder „Welche Edge‑Cases behandelt `CustomerOnboardingFlowImpl`?"',
      'Gib die Fragen Claude Code, ohne besondere Syntax. Claude durchsucht den Code automatisch und liefert Antworten mit Verweisen auf Dateien und Zeilennummern.',
      'Stelle Folgefragen, um Details zu vertiefen. Claude kann Zeilen vergleichen, den Grund für bestimmte Designentscheidungen erklären oder alternative Implementierungen aufzeigen.',
      'Nutze diese Methode als Onboarding‑Workflow: Stelle in einer neuen Codebasis nacheinander alle unklaren Punkte zur Sprache, bis du den Überblick hast.'
    ],
    examples: [
      'Ein neuer Mitarbeiter fragte: „Wie wird ein Fehler protokolliert?" Claude zeigte die zentrale Logging‑Funktion und erklärte, warum bestimmte Tags verwendet werden.',
      'Ein Produktmanager wollte wissen, wie er eine neue API‑Route erstellt. Claude gab eine Schritt‑für‑Schritt‑Anleitung basierend auf der bestehenden Struktur, ohne dass der Manager den Code selbst lesen musste.'
    ],
    slug: generateSlug('Codebase QA Schnell in neue Projekte einsteigen'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Claude Code kann die Codebasis agentisch durchsuchen und Antworten generieren, ähnlich wie ein erfahrener Engineer. Der Guide beschreibt dies als effektiven Onboarding‑Workflow, der den Ramp‑Up‑Aufwand drastisch reduziert.'
  },
  {
    id: '102',
    title: 'Versionskontroll‑Assistent: Git & GitHub mit Claude steuern',
    description: 'Lass Claude Code deinen Version‑Control‑Assistenten sein: von der Suche im Git‑Verlauf über das Schreiben von Commit‑Messages bis hin zum Erstellen von Pull‑Requests und dem Triage offener Issues.',
    category: 'programming',
    difficulty: 'intermediate',
    tools: ['Claude Code', 'GitHub CLI'],
    timeToImplement: '15 Minuten pro Session',
    impact: 'high',
    steps: [
      'Frage Claude nach dem Git‑Verlauf, um Antworten wie „Welche Commits haben Feature X eingeführt?" oder „Wer hat diese API entworfen?" zu erhalten. Claude durchsucht `git log` und erklärt die Ergebnisse.',
      'Bitte Claude, Commit‑Nachrichten zu verfassen, indem du kurz beschreibst, was geändert wurde. Claude berücksichtigt deine Änderungen sowie den aktuellen Kontext und generiert aussagekräftige Nachrichten.',
      'Nutze Claude, um komplexe Git‑Operationen durchzuführen, z. B. Rebase‑Konflikte aufzulösen, Patches zu vergleichen oder Branches zusammenzuführen. Die KI erklärt dir die Schritte und führt sie aus, wenn du es erlaubst.',
      'Interagiere mit GitHub: Erstelle Pull‑Requests, beantworte Code‑Review‑Kommentare, behebe Build‑Fehler und triagiere offene Issues, indem Claude eine Schleife über alle Issues laufen lässt und Labels oder Antworten vorschlägt.'
    ],
    examples: [
      'Ein Entwicklerteam erledigte 90 % seiner Git‑Interaktionen via Claude, indem es Commit‑Messages schreiben und Rebase‑Konflikte lösen ließ, was die Zeit pro Merge‑Request erheblich reduzierte.',
      'Ein Projektmanager triagierte täglich neue GitHub‑Issues automatisch – Claude etikettierte sie und machte Lösungsvorschläge, sodass das Team sich auf die Umsetzung konzentrieren konnte.'
    ],
    slug: generateSlug('Versionskontroll-Assistent Git und GitHub mit Claude steuern'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Der Guide zeigt, dass Claude Code nicht nur Code generieren kann, sondern auch Git‑ und GitHub‑Aktionen beherrscht. Durch das Auslagern von Version‑Control‑Aufgaben an die KI können Entwickler sich auf die Logik konzentrieren und Routinearbeiten automatisieren.'
  },
  {
    id: '103',
    title: 'Multi‑Claude & Headless Workflows: Parallelisieren wie ein Profi',
    description: 'Erhöhe deine Effizienz, indem du mehrere Claude‑Instanzen parallel betreibst, separate Git‑Checkouts nutzt und mit Headless‑Modus automatisierte Aufgaben in Skripte integrierst.',
    category: 'programming',
    difficulty: 'advanced',
    tools: ['Claude Code'],
    timeToImplement: '60 Minuten Setup',
    impact: 'high',
    steps: [
      'Starte mehrere Claude‑Sessions gleichzeitig: eine, die Code schreibt, eine zweite, die den Code überprüft, und optional eine dritte, die Tests schreibt. Nutze `/clear` oder separate Terminalfenster, um die Kontexte zu trennen.',
      'Lege mehrere Git‑Checkouts oder Git‑Worktrees an (z. B. 3–4 Arbeitskopien) und führe in jedem eine Claude‑Instanz mit unterschiedlichen Tasks aus. So kannst du neue Features entwickeln, Bugs fixen und Tests parallel bearbeiten.',
      'Nutze Headless‑Mode (`claude -p`) mit einem eigenen Harness, um Claude programmatisch in CI/CD‑Pipelines einzusetzen. Muster: Führe ein Skript aus, das eine Liste von Aufgaben erzeugt (z. B. 2 000 Dateien migrieren), rufe Claude für jede Aufgabe im Batch auf und wiederhole den Vorgang, bis alle Tasks erledigt sind.',
      'Integriere Claude in bestehende Datenverarbeitungs‑Pipelines, indem du sein JSON‑Output (`--output-format stream-json`) an nachgelagerte Tools übergibst. So entsteht ein robustes, automatisiertes System.'
    ],
    examples: [
      'Ein Team führte drei Claude‑Instanzen parallel aus: eine implementierte ein neues Feature, die zweite schrieb die zugehörigen Tests, die dritte führte Code‑Reviews durch. Dadurch halbierte sich die Durchlaufzeit des Sprints.',
      'Ein Data‑Engineering‑Team migrierte 2 000 CSV‑Dateien von Framework A zu Framework B, indem es Claude per Headless‑Mode in ein Skript einband, das jede Datei automatisch umwandelte.'
    ],
    slug: generateSlug('Multi-Claude und Headless Workflows Parallelisieren wie ein Profi'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-07'),
    'Warum es funktioniert': 'Die parallele Nutzung mehrerer Claude‑Instanzen und Git‑Worktrees ermöglicht Arbeitsteilung wie in einem Team: eine KI kann schreiben, eine andere prüfen. Der Headless‑Modus erlaubt die Integration in automatisierte Skripte und CI‑Pipelines. Diese Kombination maximiert den Durchsatz und nutzt Claude Codes Stärken optimal aus.'
  }
];

// Get all unique tools from tricks
export const getAllTools = (): string[] => {
  const tools = new Set<string>()
  mockTricks.forEach(trick => {
    trick.tools.forEach(tool => tools.add(tool))
  })
  return Array.from(tools).sort()
}

// Get all categories
export const getAllCategories = (): Category[] => {
  return [
    'productivity',
    'content-creation',
    'programming',
    'design',
    'data-analysis',
    'learning',
    'business',
    'marketing'
  ]
}

// Get trick count by category
export const getTrickCountByCategory = (): Record<Category, number> => {
  const counts: Record<string, number> = {}
  mockTricks.forEach(trick => {
    counts[trick.category] = (counts[trick.category] || 0) + 1
  })
  return counts as Record<Category, number>
}

// Filter tricks with support for FilterState and separate searchQuery
export const filterTricks = (
  tricks: KITrick[],
  filters: {
    categories?: Category[]
    difficulty?: Difficulty[]
    impact?: Impact[]
    search?: string
  },
  searchQuery?: string
): KITrick[] => {
  return tricks.filter(trick => {
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(trick.category)) return false
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty.length > 0) {
      if (!filters.difficulty.includes(trick.difficulty)) return false
    }

    // Impact filter
    if (filters.impact && filters.impact.length > 0) {
      if (!filters.impact.includes(trick.impact)) return false
    }

    // Search filter - check both filters.search and searchQuery parameter
    const searchTerm = searchQuery?.trim() || filters.search?.trim() || ''
    if (searchTerm !== '') {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        trick.title.toLowerCase().includes(searchLower) ||
        trick.description.toLowerCase().includes(searchLower) ||
        trick.tools.some(tool => tool.toLowerCase().includes(searchLower))
      if (!matchesSearch) return false
    }

    return true
  })
}

// Get trick by slug
export const getTrickBySlug = (slug: string): KITrick | undefined => {
  return mockTricks.find(trick => trick.slug === slug)
}

// Get related tricks (same category, excluding current)
export const getRelatedTricks = (currentTrick: KITrick, limit: number = 3): KITrick[] => {
  return mockTricks
    .filter(trick =>
      trick.category === currentTrick.category &&
      trick.id !== currentTrick.id
    )
    .slice(0, limit)
}

// Get total number of tricks
export const getTotalTricksCount = (): number => {
  return mockTricks.length
}

// Get total number of categories with at least one trick
export const getTotalCategoriesCount = (): number => {
  const categoriesWithTricks = new Set(mockTricks.map(trick => trick.category))
  return categoriesWithTricks.size
}

// Calculate average implementation time
export const getAverageImplementationTime = (): number => {
  const times = mockTricks.map(trick => {
    const timeStr = trick.timeToImplement.toLowerCase()
    
    // Extract numbers from strings like "5 Minuten", "10-15 Minuten", "45-60 Minuten"
    const numbers = timeStr.match(/\d+/g)
    if (!numbers || numbers.length === 0) return 0
    
    // If it's a range, take the average
    if (numbers.length === 2) {
      return (parseInt(numbers[0]) + parseInt(numbers[1])) / 2
    }
    
    // Single number
    return parseInt(numbers[0])
  })
  
  const total = times.reduce((sum, time) => sum + time, 0)
  const average = total / times.length
  
  // Round to nearest 5 minutes
  return Math.round(average / 5) * 5
}