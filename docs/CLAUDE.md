# Docs - CLAUDE.md

Dieses Verzeichnis enthält Design-Spezifikationen und Komponenten-Beispiele für die KI Tricks Platform.

## Struktur

```
docs/
└── design/
    ├── component-examples.md      # UI-Komponenten Beispiele
    └── trick-detail-page-spec.md  # Detailseite Spezifikation
```

## Design-Philosophie

### Kern-Prinzipien
1. **Minimalistisch**: Inspiriert von thegrowthlist.co
2. **Content-First**: Fokus auf Lesbarkeit
3. **Mobile-First**: Responsive von Grund auf
4. **Performance**: Schnelle Ladezeiten, optimierte Assets

### Design System

#### Farben
```css
/* Primär */
--primary: #2299dd      /* Blau - CTAs, Links */
--primary-hover: #1e88cc

/* Neutral */
--text: #171717         /* neutral-900 */
--text-muted: #737373   /* neutral-500 */
--border: #e5e5e5       /* neutral-200 */
--bg: #fafafa          /* neutral-50 */
--white: #ffffff

/* Status */
--success: #10b981      /* green-500 */
--warning: #f59e0b      /* amber-500 */
--danger: #ef4444       /* red-500 */
```

#### Typografie
```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif;

/* Größen */
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */

/* Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

#### Spacing
```css
/* Konsistentes 4px Grid */
--space-1: 0.25rem      /* 4px */
--space-2: 0.5rem       /* 8px */
--space-3: 0.75rem      /* 12px */
--space-4: 1rem         /* 16px */
--space-6: 1.5rem       /* 24px */
--space-8: 2rem         /* 32px */
--space-12: 3rem        /* 48px */
--space-16: 4rem        /* 64px */
```

#### Breakpoints
```css
--mobile: 640px         /* sm */
--tablet: 768px         /* md */
--desktop: 1024px       /* lg */
--wide: 1280px          /* xl */
```

## Component Examples

### Card Design
```html
<!-- TrickCard Beispiel -->
<div class="card">
  <div class="card-header">
    <h3>Trick Title</h3>
    <span class="badge">Kategorie</span>
  </div>
  <p class="card-description">
    Beschreibung des Tricks...
  </p>
  <div class="card-meta">
    <span>15 Min</span>
    <span>•</span>
    <span>Hoch</span>
  </div>
</div>

<!-- CSS -->
.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
```

### Button Varianten
```html
<!-- Primary -->
<button class="btn btn-primary">
  KI Kurs
</button>

<!-- Secondary -->
<button class="btn btn-secondary">
  Mehr erfahren
</button>

<!-- Ghost -->
<button class="btn btn-ghost">
  Abbrechen
</button>

<!-- Sizes -->
<button class="btn btn-sm">Klein</button>
<button class="btn btn-md">Normal</button>
<button class="btn btn-lg">Groß</button>
```

### Form Elements
```html
<!-- Input -->
<div class="form-group">
  <label>Titel</label>
  <input 
    type="text" 
    class="form-input"
    placeholder="Gib einen Titel ein..."
  />
  <span class="form-error">Titel ist erforderlich</span>
</div>

<!-- Select -->
<select class="form-select">
  <option>Wähle eine Kategorie</option>
  <option>Produktivität</option>
  <option>Programmierung</option>
</select>

<!-- Checkbox -->
<label class="checkbox">
  <input type="checkbox" />
  <span>Claude</span>
</label>
```

## Trick Detail Page Spec

### Layout-Struktur
```
┌─────────────────────────────────────┐
│ Header (fixed)                      │
├─────────────────────────────────────┤
│ Breadcrumb                          │
│ Home > Tricks > [Trick Name]        │
├─────────────────────────────────────┤
│ < Zurück zu allen Tricks            │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Hero Section                    │ │
│ │ • Title (h1)                    │ │
│ │ • Category Badge                │ │
│ │ • Description with Hook         │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Meta Information Bar            │ │
│ │ 🕐 Zeit  🛠️ Tools  📈 Impact    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Schritte Section                │ │
│ │ 1. Step One                     │ │
│ │ 2. Step Two                     │ │
│ │ 3. Step Three                   │ │
│ │ 4. Step Four                    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Beispiele Section               │ │
│ │ • Example 1                     │ │
│ │ • Example 2                     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Ähnliche Tricks                 │ │
│ │ [Card] [Card] [Card]            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### Responsive Behavior

#### Desktop (≥1024px)
- Container: max-width 896px (4xl)
- Side margins: auto
- Font sizes: Base scale
- Meta info: Horizontal layout

#### Tablet (640-1023px)
- Container: Full width mit padding
- Font sizes: -1 step
- Meta info: 2x2 Grid

#### Mobile (<640px)
- Container: Full width
- Font sizes: -2 steps
- Meta info: Vertical stack
- Schritte: Kompakter

## Animation Guidelines

### Hover States
```css
/* Cards */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Buttons */
.btn {
  transition: all 0.15s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}
```

### Loading States
```css
/* Skeleton Animation */
@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 200px 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
}
```

### Page Transitions
```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-content {
  animation: fadeIn 0.3s ease-out;
}
```

## Accessibility Specs

### Focus States
```css
/* Visible Focus */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Skip to Content */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}
```

### ARIA Labels
```html
<!-- Filter -->
<div role="group" aria-label="Filter nach Kategorie">
  <input 
    type="checkbox" 
    id="cat-1" 
    aria-label="Produktivität"
  />
</div>

<!-- Loading -->
<div 
  role="status" 
  aria-live="polite" 
  aria-label="Lade KI-Tricks"
>
  <span class="sr-only">Wird geladen...</span>
</div>

<!-- Navigation -->
<nav aria-label="Hauptnavigation">
  <!-- links -->
</nav>
```

### Keyboard Navigation
- Tab Order: Logisch von oben nach unten
- Skip Links: Zu Hauptcontent und Navigation
- Modal: Focus Trap im Mobile Filter Drawer
- Escape: Schließt Modals/Drawers

## Performance Guidelines

### Image Optimization
```jsx
// Next.js Image Component
import Image from 'next/image'

<Image
  src="/trick-hero.jpg"
  alt="KI Trick Visualisierung"
  width={1200}
  height={630}
  priority // für Above-the-fold
  placeholder="blur"
  blurDataURL={shimmer}
/>
```

### Code Splitting
```jsx
// Lazy Load Heavy Components
const TrickForm = dynamic(
  () => import('@/components/organisms/TrickForm'),
  { ssr: false }
)
```

### Font Loading
```css
/* Font Display Swap */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('/fonts/inter.woff2') format('woff2');
}
```

## Testing Matrix

### Browser Support
- Chrome/Edge: Letzte 2 Versionen
- Firefox: Letzte 2 Versionen
- Safari: Letzte 2 Versionen
- Mobile: iOS Safari, Chrome Android

### Device Testing
- iPhone SE (375px)
- iPhone 14 (390px)
- iPad (768px)
- Desktop (1280px+)

### Performance Targets
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Page Size: < 200KB (ohne Bilder)

## Future Enhancements

### Dark Mode
```css
/* CSS Variables für Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --text: #fafafa;
    --border: #262626;
    /* ... */
  }
}

/* Oder Toggle-basiert */
[data-theme="dark"] {
  /* dark mode styles */
}
```

### Advanced Animations
- Framer Motion für Page Transitions
- Lottie für Micro-Interactions
- CSS View Transitions API

### Component Library
- Storybook Integration
- Component Documentation
- Visual Regression Tests
- Design Tokens Export