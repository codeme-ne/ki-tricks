# KI-Tricks Platform 🚀

Eine moderne Next.js 15 Webanwendung zum Entdecken und Implementieren praktischer KI-Tipps und Tricks.

![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)

## 📋 Übersicht

Die KI-Tricks Platform ist eine intuitive Webplattform, die praktische Tipps und Tricks für die effektive Nutzung von KI-Tools wie Claude, ChatGPT und anderen sammelt und präsentiert. Mit einem minimalistischen Design inspiriert von modernen Plattformen bietet sie eine benutzerfreundliche Oberfläche in deutscher Sprache.

## ✨ Features

- **📚 Umfangreiche Sammlung**: Über 40 hochwertige KI-Tricks in verschiedenen Kategorien
- **🔍 Intelligente Filterung**: URL-basiertes Filtersystem für teilbare Ansichten
- **🎨 Modernes Design**: Glassmorphismus und Glow-Effekte für eine ansprechende UI
- **📱 Responsive**: Optimiert für Mobile, Tablet und Desktop
- **🔐 Admin-Interface**: Geschützter Bereich zur Verwaltung neuer Tricks
- **⚡ Performance**: Optimiert mit React.memo und useMemo für schnelle Ladezeiten
- **🌟 Kategorien**: Programmierung, Produktivität, Lernen, Business, Content-Erstellung und mehr

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.5
- **Sprache**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4
- **UI-Komponenten**: Framer Motion für Animationen
- **Icons**: Lucide React

### Backend & Services
- **Datenbank**: Supabase (optional)
- **Analytics**: Vercel Analytics
- **Email**: EmailJS für Kontaktformulare
- **Deployment**: Vercel

## 🚀 Installation

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn
- Git

### Lokale Entwicklung

1. **Repository klonen**
```bash
git clone https://github.com/codeme-ne/ai-platform.git
cd ai-platform
```

2. **Abhängigkeiten installieren**
```bash
npm install
```

3. **Umgebungsvariablen einrichten**
```bash
cp .env.example .env.local
```

Fügen Sie folgende Variablen in `.env.local` ein:
```
# Admin-Authentifizierung
ADMIN_PASSWORD=ihr-sicheres-passwort

# EmailJS (optional für Kontaktformular)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=xxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx
```

4. **Entwicklungsserver starten**
```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:3000` verfügbar.

## 📂 Projektstruktur

```
ai-platform/
├── src/
│   ├── app/              # Next.js App Router Seiten
│   │   ├── admin/        # Admin-Interface
│   │   ├── tricks/       # Tricks-Verwaltung
│   │   └── api/          # API-Routen
│   ├── components/       # React-Komponenten
│   │   ├── atoms/        # Basis-UI-Komponenten
│   │   ├── molecules/    # Zusammengesetzte Komponenten
│   │   ├── organisms/    # Komplexe Komponenten
│   │   └── enhanced/     # Erweiterte UI-Komponenten
│   └── lib/              # Utilities und Services
├── public/               # Statische Assets
├── docs/                 # Dokumentation
└── scripts/              # Build- und Migrations-Scripts
```

## 💻 Verfügbare Scripts

```bash
# Entwicklung
npm run dev              # Entwicklungsserver starten
npm run dev:mobile       # Mobile-Entwicklung (alle Netzwerk-IPs)

# Produktion
npm run build           # Produktions-Build erstellen
npm start              # Produktionsserver starten

# Qualität
npm run lint           # ESLint ausführen

# Utilities
npm run fix-build      # Build-Fehler beheben
npm run migrate-to-supabase  # Daten zu Supabase migrieren
```

## 🎨 Komponenten-Architektur

Die Anwendung folgt einer Atomic Design Methodologie:

- **Atoms**: Button, Badge, Checkbox - Grundlegende UI-Elemente
- **Molecules**: TrickCard, SearchBar - Zusammengesetzte Komponenten
- **Organisms**: FilterSidebar, TrickGrid - Komplexe, eigenständige Komponenten
- **Enhanced**: GlowingButton, AnimatedStats - Erweiterte UI mit Animationen

## 🔧 Konfiguration

### Next.js Konfiguration
Die Anwendung nutzt Next.js 15 mit dem App Router. Wichtige Patterns:

- **Server Components** als Standard
- **Client Components** mit `'use client'` Direktive
- **Suspense Boundaries** für `useSearchParams`
- **Dynamic Routes** mit Promise-Pattern

### TypeScript
Strict Mode ist aktiviert. Keine `any` Types erlaubt.

### Tailwind CSS
Mobile-first Responsive Design mit benutzerdefinierten Breakpoints.

## 🤝 Beitragen

Wir freuen uns über Beiträge! Bitte beachten Sie:

1. Forken Sie das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add AmazingFeature'`)
4. Pushen Sie zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

### Code-Standards
- TypeScript strict mode
- ESLint-Regeln befolgen
- Deutscher UI-Text
- Mobile-first Design
- Performance-Optimierung beachten

## 📝 Lizenz

Dieses Projekt ist unter der ISC-Lizenz lizenziert. Siehe [LICENSE](LICENSE) für Details.

## 🆘 Support

Bei Fragen oder Problemen:
- Öffnen Sie ein [Issue](https://github.com/codeme-ne/ai-platform/issues)
- Nutzen Sie das Kontaktformular auf der Webseite
- Schauen Sie in die [Dokumentation](./docs)

## 🚀 Deployment

Die Anwendung wird automatisch über Vercel deployed:

1. Push zu `main` Branch triggert automatisches Deployment
2. Pull Requests erhalten Preview-Deployments
3. Umgebungsvariablen müssen im Vercel Dashboard konfiguriert werden

## 📊 Performance

Optimierungsziele:
- **Ladezeit**: <3s auf 3G, <1s auf WiFi
- **Bundle Size**: <500KB initial
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1

---

**Entwickelt mit ❤️ für die KI-Community**