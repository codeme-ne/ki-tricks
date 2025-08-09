# 🌌 KI Tricks Platform - Design System

## Übersicht

Dieses Dokument definiert das einheitliche Design-System für die KI Tricks Platform. Das Design folgt einem **intergalaktischen Dark Theme** mit Glassmorphism-Effekten und subtilen Glow-Animationen, inspiriert von modernen UI-Libraries wie 21dev.

## 🎨 Design-Philosophie

### Kern-Prinzipien
1. **Intergalaktisch**: Dunkles Theme mit Sternen-Animationen und Glow-Effekten
2. **Konsistenz**: Einheitliche Komponenten und Patterns über alle Seiten
3. **Lesbarkeit**: Hoher Kontrast für optimale Lesbarkeit im Dark Mode
4. **Performance**: Subtile Animationen ohne Performance-Einbußen
5. **Accessibility**: WCAG AA konform mit Focus-States und Keyboard-Navigation

## 🎨 Farbpalette

### Primärfarben
```css
/* Hauptfarbe - Electric Blue */
--primary-500: #2299dd    /* Hauptakzent */
--primary-400: #38bdf8    /* Heller Akzent */
--primary-600: #0284c7    /* Dunkler Akzent */

/* Sekundärfarben - Für Vielfalt */
--secondary-purple: #B829DD   /* Neon Purple */
--secondary-pink: #FF0080     /* Hot Pink */
--secondary-cyan: #00D9FF     /* Electric Cyan */
```

### Neutral-Palette (Dark Mode)
```css
/* Hintergründe */
--bg-base: #0A0A0F           /* Deep Space - Haupthintergrund */
--bg-surface: #171717        /* neutral-900 - Karten-Hintergrund */
--bg-elevated: #262626       /* neutral-800 - Erhöhte Elemente */

/* Glassmorphism Backgrounds */
--glass-light: rgba(38, 38, 38, 0.3)    /* 30% Opacity */
--glass-medium: rgba(38, 38, 38, 0.5)   /* 50% Opacity */
--glass-dark: rgba(38, 38, 38, 0.7)     /* 70% Opacity */

/* Text */
--text-primary: #fafafa      /* neutral-50 - Haupttext */
--text-secondary: #e5e5e5    /* neutral-200 - Sekundärtext */
--text-muted: #a3a3a3        /* neutral-400 - Gedämpfter Text */

/* Borders */
--border-default: rgba(115, 115, 115, 0.3)   /* Subtle Border */
--border-hover: rgba(115, 115, 115, 0.5)     /* Hover Border */
--border-focus: #2299dd                       /* Focus Border */
```

### Status-Farben
```css
--success: #10b981    /* green-500 */
--warning: #f59e0b    /* amber-500 */
--danger: #ef4444     /* red-500 */
--info: #3b82f6       /* blue-500 */
```

## 📐 Typografie

### Font Stack
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Größen-Skala
```css
/* Headlines */
--text-5xl: 3rem        /* 48px - Hero Headlines */
--text-4xl: 2.25rem     /* 36px - Page Titles */
--text-3xl: 1.875rem    /* 30px - Section Headers */
--text-2xl: 1.5rem      /* 24px - Subsection Headers */
--text-xl: 1.25rem      /* 20px - Large Text */

/* Body */
--text-lg: 1.125rem     /* 18px - Large Body */
--text-base: 1rem       /* 16px - Normal Body */
--text-sm: 0.875rem     /* 14px - Small Text */
--text-xs: 0.75rem      /* 12px - Meta Text */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

## 🌟 Effekte & Animationen

### Glow-Effekte
```css
/* Subtiler Glow (wie SearchBar) */
.glow-subtle {
  box-shadow: 0 0 20px rgba(34, 153, 221, 0.2);
}

/* Medium Glow (Hover States) */
.glow-medium {
  box-shadow: 0 0 30px rgba(34, 153, 221, 0.3);
}

/* Starker Glow (CTAs) */
.glow-strong {
  box-shadow: 0 0 40px rgba(34, 153, 221, 0.4);
}

/* Animierter Glow */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(34, 153, 221, 0.2); }
  50% { box-shadow: 0 0 40px rgba(34, 153, 221, 0.4); }
}
```

### Glassmorphism
```css
/* Standard Glass Effect */
.glass {
  background: rgba(38, 38, 38, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(115, 115, 115, 0.3);
}

/* Light Glass */
.glass-light {
  background: rgba(38, 38, 38, 0.3);
  backdrop-filter: blur(8px);
}

/* Dark Glass */
.glass-dark {
  background: rgba(38, 38, 38, 0.7);
  backdrop-filter: blur(16px);
}
```

### Hover-Animationen
```css
/* Standard Hover */
.hover-lift {
  transition: all 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Card Hover mit Glow */
.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(34, 153, 221, 0.2);
  border-color: rgba(34, 153, 221, 0.5);
}
```

### Shimmer-Animation (von GlowingButton)
```css
@keyframes shimmer-button {
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
}

.shimmer {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(34, 153, 221, 0.3),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer-button 2s linear infinite;
}
```

## 🧱 Komponenten-Patterns

### Buttons (GlowingButton)
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-500);
  color: white;
  position: relative;
  overflow: hidden;
}

/* Mit Glow und Shimmer auf Hover */
.btn-primary:hover {
  box-shadow: 0 0 30px rgba(34, 153, 221, 0.4);
  /* Shimmer overlay aktiviert sich */
}
```

### Cards
```css
/* Standard Card */
.card {
  background: var(--glass-medium);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--border-hover);
  box-shadow: 0 10px 40px rgba(34, 153, 221, 0.15);
}
```

### Input Fields (wie SearchBar)
```css
.input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(34, 153, 221, 0.1);
}

/* Mit Glow-Gruppe */
.input-group:hover .input {
  border-color: var(--border-hover);
}

.input-group:focus-within {
  /* Subtle glow effect */
  box-shadow: 0 0 20px rgba(34, 153, 221, 0.2);
}
```

## 📱 Responsive Breakpoints

```css
--mobile: 640px     /* sm - Phones */
--tablet: 768px     /* md - Tablets */
--desktop: 1024px   /* lg - Small Laptops */
--wide: 1280px      /* xl - Desktops */
--ultrawide: 1536px /* 2xl - Large Screens */
```

## 🎯 Seiten-spezifische Styles

### Homepage
- **Hintergrund**: InteractiveStarfield mit 200 Sternen
- **Hero**: Große Headlines (text-5xl) mit AnimatedStatsGrid
- **Buttons**: GlowingButton Komponente
- **Cards**: Glassmorphism mit bg-neutral-800/30

### Tricks-Übersicht
- **Hintergrund**: SparklesCore mit primary-500 Farbe
- **Grid**: 3-spaltig Desktop, responsive
- **Filter**: Glassmorphism Sidebar
- **Cards**: TrickCard mit hover-lift Effekt

### Trick-Detail-Seiten
- **Hintergrund**: Gleich wie Tricks-Übersicht (SparklesCore)
- **Container**: max-w-4xl mit glass-light Background
- **StepCards**: Glassmorphism mit Glow-Nummer
- **ExampleCards**: Gradient-Background mit Shimmer-Border
- **Header**: Große Titel mit Gradient-Text Option

## 🔧 Utility-Klassen

### Neu hinzugefügte Utilities (globals.css)

```css
/* Glassmorphism Utilities */
.glass-light { /* siehe oben */ }
.glass-medium { /* siehe oben */ }
.glass-dark { /* siehe oben */ }

/* Glow Utilities */
.glow-subtle { /* siehe oben */ }
.glow-medium { /* siehe oben */ }
.glow-strong { /* siehe oben */ }
.glow-pulse { animation: pulse-glow 2s infinite; }

/* Text Glow */
.text-glow {
  text-shadow: 0 0 20px rgba(34, 153, 221, 0.5);
}

/* Gradient Text */
.text-gradient {
  background: linear-gradient(135deg, #2299dd, #00D9FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Border Animations */
.border-shimmer {
  position: relative;
  overflow: hidden;
}

.border-shimmer::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, 
    transparent, 
    var(--primary-500), 
    transparent
  );
  animation: rotate 3s linear infinite;
  border-radius: inherit;
  z-index: -1;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 🎬 Animation Guidelines

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Durations
```css
--duration-fast: 150ms     /* Micro-interactions */
--duration-normal: 300ms   /* Standard transitions */
--duration-slow: 500ms     /* Complex animations */
```

### Performance-Regeln
1. Nutze `transform` und `opacity` für Animationen (GPU-beschleunigt)
2. Vermeide `box-shadow` Animationen bei vielen Elementen
3. Nutze `will-change` sparsam und entferne es nach der Animation
4. Debounce/Throttle bei scroll-basierten Animationen

## ♿ Accessibility

### Focus States
```css
/* Sichtbarer Focus für Keyboard-Navigation */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Keine Outline bei Maus-Klick */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Kontrast-Verhältnisse
- **Normal Text**: Minimum 4.5:1
- **Large Text**: Minimum 3:1
- **UI Components**: Minimum 3:1

### Dark Mode Considerations
- Verwende nie reines Weiß (#FFFFFF) auf schwarzem Hintergrund
- Nutze stattdessen #FAFAFA für reduzierten Augenbelastung
- Erhöhe Schriftgewicht leicht im Dark Mode für bessere Lesbarkeit

## 🚀 Implementierungs-Checkliste

### Bei neuen Komponenten
- [ ] Verwende bestehende Farb-Variablen
- [ ] Implementiere konsistente Hover-States
- [ ] Füge Focus-States für Accessibility hinzu
- [ ] Teste auf allen Breakpoints
- [ ] Prüfe Kontrast-Verhältnisse
- [ ] Nutze bestehende Animationen
- [ ] Dokumentiere Abweichungen

### Bei Updates
- [ ] Prüfe Konsistenz mit anderen Seiten
- [ ] Teste Dark Mode Darstellung
- [ ] Validiere Performance der Animationen
- [ ] Überprüfe Mobile Darstellung
- [ ] Update dieses Dokument bei Änderungen

## 📈 Versionierung

### v1.0.0 (Januar 2025)
- Initial Design System
- Dark Theme Implementation
- Glassmorphism Components
- Animation Library

### Geplante Updates
- v1.1.0: Enhanced Animations
- v1.2.0: Component Variations
- v2.0.0: Light Mode Support (Optional)

---

**Hinweis**: Dieses Design-System ist ein lebendiges Dokument und wird kontinuierlich mit der Platform-Entwicklung aktualisiert. Bei Fragen oder Vorschlägen, erstelle ein Issue im Repository.