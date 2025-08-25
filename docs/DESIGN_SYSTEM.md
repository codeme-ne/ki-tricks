# KI Tricks Platform - Design System Specification

## Design Philosophy
**Ultra-minimalist approach** focused on content clarity, usability, and performance across all devices.

### Core Principles
1. **Content First** - Remove all unnecessary visual elements
2. **Mobile-First** - Design for mobile, enhance for desktop
3. **Performance** - Minimize animations and complex effects
4. **Accessibility** - Large touch targets, clear hierarchy
5. **Consistency** - Unified design language across all pages

---

## Color Palette

### Primary Colors
```css
/* Neutrals - Main palette */
--neutral-50:  #fafafa    /* Lightest background */
--neutral-100: #f5f5f5    /* Light background */
--neutral-200: #e5e5e5    /* Borders */
--neutral-300: #d4d4d4    /* Disabled states */
--neutral-400: #a3a3a3    /* Placeholder text */
--neutral-500: #737373    /* Secondary text */
--neutral-600: #525252    /* Body text */
--neutral-700: #404040    /* Emphasis text */
--neutral-800: #262626    /* Strong emphasis */
--neutral-900: #171717    /* Primary text, buttons */

/* Backgrounds */
--bg-primary: #ffffff
--bg-secondary: #fafafa
--bg-tertiary: gradient(to-b, from-white, to-neutral-50)
```

### Accent Colors (Minimal use)
```css
/* Only for critical actions */
--accent-primary: #171717    /* Black for primary CTAs */
--accent-hover: #262626      /* Hover state */
--accent-focus: #404040      /* Focus rings */
```

---

## Typography

### Font Stack
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale
```css
/* Mobile First */
--text-xs:   0.75rem  (12px)  /* Metadata, captions */
--text-sm:   0.875rem (14px)  /* Secondary text, labels */
--text-base: 1rem     (16px)  /* Body text */
--text-lg:   1.125rem (18px)  /* Emphasized body */
--text-xl:   1.25rem  (20px)  /* Section headings */
--text-2xl:  1.5rem   (24px)  /* Page subheadings */
--text-3xl:  1.875rem (30px)  /* Page headings mobile */
--text-4xl:  2.25rem  (36px)  /* Hero headings mobile */

/* Desktop (md: 768px+) */
@media (min-width: 768px) {
  --text-3xl: 2.25rem  (36px)
  --text-4xl: 3rem     (48px)
  --text-5xl: 3.75rem  (60px)  /* Hero headings desktop */
}
```

### Font Weights
```css
--font-normal: 400   /* Body text */
--font-medium: 500   /* Buttons, links */
--font-semibold: 600 /* Subheadings */
--font-bold: 700     /* Headings */
```

### Line Heights
```css
--leading-tight: 1.25    /* Headings */
--leading-normal: 1.5    /* Body text */
--leading-relaxed: 1.75  /* Long-form content */
```

---

## Spacing System

### Base Unit: 4px
```css
--space-0:  0
--space-1:  0.25rem (4px)
--space-2:  0.5rem  (8px)
--space-3:  0.75rem (12px)
--space-4:  1rem    (16px)
--space-5:  1.25rem (20px)
--space-6:  1.5rem  (24px)
--space-8:  2rem    (32px)
--space-10: 2.5rem  (40px)
--space-12: 3rem    (48px)
--space-16: 4rem    (64px)
--space-20: 5rem    (80px)
--space-24: 6rem    (96px)
```

### Section Spacing
```css
/* Mobile */
--section-padding-y: 4rem (64px)

/* Desktop */
@media (min-width: 768px) {
  --section-padding-y: 6rem (96px)
}
```

---

## Layout System

### Container
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;   /* Mobile: 16px */
}

@media (min-width: 640px) {
  padding: 0 1.5rem; /* Tablet: 24px */
}

@media (min-width: 1024px) {
  padding: 0 2rem;   /* Desktop: 32px */
}
```

### Grid System
```css
/* Mobile First */
.grid-cols-1  /* Single column */
.grid-cols-2  /* Two columns */

/* Tablet (sm: 640px+) */
.sm:grid-cols-2
.sm:grid-cols-3

/* Desktop (md: 768px+) */
.md:grid-cols-3
.md:grid-cols-4

/* Gap spacing */
.gap-4  /* Mobile: 16px */
.md:gap-6 /* Desktop: 24px */
```

---

## Components

### Buttons

#### Minimal Button Component
```tsx
/* Primary Button */
- Background: neutral-900 (#171717)
- Text: white
- Border: 1px solid neutral-800
- Hover: bg-neutral-800
- Padding: 12px 24px (mobile: 12px 20px)
- Border-radius: 8px
- Font-weight: 500
- Transition: all 200ms

/* Secondary Button */
- Background: white
- Text: neutral-900
- Border: 1px solid neutral-200
- Hover: bg-neutral-50

/* Ghost Button */
- Background: transparent
- Text: neutral-600
- Hover: bg-neutral-100, text-neutral-900
```

#### Button Sizes
```css
/* Small */
padding: 6px 12px;
font-size: 14px;

/* Medium (default) */
padding: 8px 16px;
font-size: 16px;

/* Large */
padding: 12px 24px;
font-size: 18px;

/* Mobile: Full width on small screens */
@media (max-width: 640px) {
  width: 100%;
  padding: 12px 20px;
  min-height: 48px; /* Touch target */
}
```

### Cards

#### Category Card
```css
- Background: white
- Border: 1px solid neutral-200
- Border-radius: 8px
- Padding: 16px (mobile) / 24px (desktop)
- Hover: border-neutral-300, shadow-sm
- Transition: all 200ms
```

#### Trick Card
```css
- Background: white
- Border: 1px solid neutral-200
- Border-radius: 8px
- Padding: 24px
- Hover: border-neutral-300, shadow-sm
```

### Navigation

#### Desktop Header
```css
- Height: 64px
- Background: white
- Border-bottom: 1px solid neutral-200
- Position: sticky top-0
- Z-index: 50
```

#### Mobile Header
```css
- Height: 56px
- Hamburger menu: 40x40px touch target
- Slide-out menu: full-width
- Menu background: white
- Menu items: 48px height minimum
```

### Forms

#### Input Fields
```css
- Background: white
- Border: 1px solid neutral-200
- Border-radius: 8px
- Padding: 8px 12px
- Font-size: 16px
- Focus: ring-2 ring-neutral-400
- Min-height: 44px (mobile)
```

#### Labels
```css
- Font-size: 14px
- Color: neutral-700
- Margin-bottom: 4px
- Font-weight: 500
```

---

## Animation Guidelines

### Principles
1. **Minimal animations** - Only for essential feedback
2. **Fast transitions** - 200ms default, 500ms max
3. **No complex effects** - Simple opacity/transform only
4. **Performance first** - GPU-accelerated properties only

### Standard Transitions
```css
/* Default transition */
transition: all 200ms ease-out;

/* Hover states */
transition: background-color 200ms, color 200ms;

/* Page transitions */
transition: opacity 300ms, transform 300ms;

/* Mobile: Reduce or disable */
@media (prefers-reduced-motion: reduce) {
  transition-duration: 0.01ms !important;
}
```

### Allowed Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Rules
1. Design for 375px width minimum
2. Test at 375px, 390px (common phones)
3. Tablet checkpoint at 768px
4. Desktop enhancement at 1024px+

---

## Accessibility Guidelines

### Touch Targets
- Minimum size: 44x44px (iOS standard)
- Recommended: 48x48px for primary actions
- Spacing between targets: minimum 8px

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus States
```css
:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: neutral-400;
  ring-offset: 2px;
}
```

### Keyboard Navigation
- All interactive elements reachable via Tab
- Escape key closes modals/menus
- Enter/Space activates buttons
- Arrow keys for menu navigation

---

## Performance Guidelines

### CSS Optimization
1. No complex selectors (max 3 levels)
2. Avoid expensive properties (box-shadow, filter)
3. Use transform/opacity for animations
4. Minimize repaints/reflows

### Image Guidelines
- Lazy load below-fold images
- Use WebP format when possible
- Responsive images with srcset
- Max width: 1920px for hero images

### Bundle Size Targets
- CSS: < 50KB (minified)
- JS: < 100KB per route (gzipped)
- First paint: < 1.5s
- Interactive: < 3.5s

---

## Component Examples

### Hero Section
```tsx
<section className="py-16 lg:py-24">
  <div className="container">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
        {subtitle}
      </p>
      <div className="flex gap-4 justify-center flex-col sm:flex-row">
        <MinimalButton variant="primary" size="lg">
          Primary Action
        </MinimalButton>
        <MinimalButton variant="secondary" size="lg">
          Secondary Action
        </MinimalButton>
      </div>
    </div>
  </div>
</section>
```

### Stats Grid
```tsx
<section className="py-12 bg-white border-y border-neutral-200">
  <div className="container">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map(stat => (
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-neutral-900">
            {stat.value}
          </div>
          <div className="text-sm text-neutral-500 mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### Category Grid
```tsx
<section className="py-16 bg-neutral-50">
  <div className="container">
    <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
      {title}
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {categories.map(category => (
        <a className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6 
                     text-center hover:border-neutral-300 hover:shadow-sm transition-all">
          <div className="text-3xl md:text-4xl mb-2">{category.emoji}</div>
          <h3 className="font-semibold text-sm md:text-base text-neutral-900">
            {category.name}
          </h3>
          <p className="text-xs md:text-sm text-neutral-500">
            {category.count} items
          </p>
        </a>
      ))}
    </div>
  </div>
</section>
```

---

## Category Icons System

### Icon Implementation
Category cards use SVG icons from `/public/icons/categories/` for a clean, scalable visual representation.

#### Icon Specifications
```css
/* Icon Container */
- Size: 40x40px (mobile) / 48x48px (desktop)
- Margin-bottom: 12px
- Centered alignment

/* SVG Icons */
- Format: SVG for scalability
- Color: neutral-900 (#171717) via CSS filter
- Opacity: 60% (default) / 90% (hover)
- Transition: opacity 200ms
```

#### Icon Mapping
```tsx
const categoryIcons: Record<string, string> = {
  'programming': '/icons/categories/programming-code.svg',
  'business': '/icons/categories/business-briefcase.svg',
  'productivity': '/icons/categories/productivity-calendar.svg',
  'learning': '/icons/categories/learning-book.svg',
  'marketing': '/icons/categories/marketing-megaphone.svg',
  'content-creation': '/icons/categories/content-camera.svg',
  'data-analysis': '/icons/categories/data-stats.svg',
  'design': '/icons/categories/design-palette.svg'
}
```

#### Category Card with Icons
```tsx
<Link 
  href={`/tricks?categories=${category}`}
  className="relative bg-white border border-neutral-200 rounded-lg p-6 
             text-center hover:border-neutral-400 hover:bg-neutral-50 
             transition-all duration-200 group"
>
  {/* Icon Container */}
  <div className="relative w-10 h-10 md:w-12 md:h-12 mx-auto mb-3">
    <Image
      src={categoryIcons[category]}
      alt={categoryLabel}
      fill
      className="object-contain filter opacity-60 group-hover:opacity-90 
                 transition-opacity duration-200"
      style={{ 
        filter: 'brightness(0) saturate(100%) invert(17%) sepia(0%) 
                saturate(7%) hue-rotate(358deg) brightness(95%) contrast(97%)' 
      }}
    />
  </div>
  
  {/* Category Name */}
  <h4 className="font-semibold mb-1 text-neutral-900 text-sm md:text-base 
                 group-hover:text-neutral-800 transition-colors">
    {categoryLabel}
  </h4>
  
  {/* Count */}
  <p className="text-xs md:text-sm text-neutral-500 
                group-hover:text-neutral-600 transition-colors">
    {count} Tricks
  </p>
</Link>
```

### Icon Guidelines
1. **Consistency**: All icons should have similar visual weight and style
2. **Color**: Use CSS filters to ensure icons match the neutral color palette
3. **Fallback**: Provide emoji fallback for categories without icons
4. **Performance**: Use Next.js Image component for optimized loading
5. **Accessibility**: Always include descriptive alt text

### Hover Effects for Category Cards
```css
/* Card Container */
- Border: neutral-200 → neutral-400
- Background: white → neutral-50
- Duration: 200ms
- Easing: ease-out

/* Icon */
- Opacity: 60% → 90%
- No scaling (keeps minimalist approach)

/* Text */
- Title: neutral-900 → neutral-800
- Count: neutral-500 → neutral-600
```

---

## Implementation Checklist

When applying this design system:

- [ ] Remove all gradient backgrounds
- [ ] Replace complex animations with simple transitions
- [ ] Ensure all buttons use MinimalButton component
- [ ] Check mobile responsiveness at 375px
- [ ] Verify touch targets are 44px minimum
- [ ] Test with keyboard navigation
- [ ] Validate color contrast ratios
- [ ] Remove unnecessary visual effects
- [ ] Optimize images and lazy load
- [ ] Test on real devices (not just browser DevTools)

---

## Future Considerations

### Dark Mode (Optional)
If implementing dark mode in future:
- Use CSS variables for all colors
- Implement with `prefers-color-scheme`
- Keep it equally minimal (no gradients/effects)
- Test contrast ratios for both modes

### Micro-interactions
Only add if they serve a functional purpose:
- Form validation feedback
- Loading states
- Success/error messages
- Progress indicators

### Enhanced Components
Future components should follow:
- Same minimal aesthetic
- Mobile-first approach
- Performance guidelines
- Accessibility standards

---

*Last Updated: January 2025*
*Version: 1.0.0*