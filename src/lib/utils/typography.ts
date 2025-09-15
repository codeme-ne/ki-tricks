/**
 * Typography Scale - Fluid type system for consistent text hierarchy
 */

// Base font size (16px)
const BASE_FONT_SIZE = 16;

// Typography scale using modular scale (1.25 - major third)
export const fontSize = {
  // Small text
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px

  // Body text
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px

  // Headings
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
  '7xl': '4.5rem',    // 72px
} as const;

// Fluid typography using clamp()
export const fluidFontSize = {
  xs: 'clamp(0.75rem, 1vw, 0.875rem)',     // 12px - 14px
  sm: 'clamp(0.875rem, 1.5vw, 1rem)',      // 14px - 16px
  base: 'clamp(1rem, 2vw, 1.125rem)',      // 16px - 18px
  lg: 'clamp(1.125rem, 2.5vw, 1.25rem)',   // 18px - 20px
  xl: 'clamp(1.25rem, 3vw, 1.5rem)',       // 20px - 24px

  // Fluid headings
  h6: 'clamp(1rem, 2.5vw, 1.125rem)',      // 16px - 18px
  h5: 'clamp(1.125rem, 3vw, 1.25rem)',     // 18px - 20px
  h4: 'clamp(1.25rem, 3.5vw, 1.5rem)',     // 20px - 24px
  h3: 'clamp(1.5rem, 4vw, 1.875rem)',      // 24px - 30px
  h2: 'clamp(1.875rem, 5vw, 2.25rem)',     // 30px - 36px
  h1: 'clamp(2.25rem, 6vw, 3rem)',         // 36px - 48px

  // Display text
  display: 'clamp(3rem, 8vw, 4.5rem)',     // 48px - 72px
} as const;

// Line height scale
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

// Font weights
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Typography component presets
export const typographyPresets = {
  // Headings
  heading: {
    h1: {
      fontSize: fluidFontSize.h1,
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight,
    },
    h2: {
      fontSize: fluidFontSize.h2,
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight,
    },
    h3: {
      fontSize: fluidFontSize.h3,
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.snug,
      letterSpacing: letterSpacing.tight,
    },
    h4: {
      fontSize: fluidFontSize.h4,
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.snug,
      letterSpacing: letterSpacing.normal,
    },
    h5: {
      fontSize: fluidFontSize.h5,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal,
    },
    h6: {
      fontSize: fluidFontSize.h6,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal,
    },
  },

  // Body text
  body: {
    large: {
      fontSize: fluidFontSize.lg,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.relaxed,
      letterSpacing: letterSpacing.normal,
    },
    default: {
      fontSize: fluidFontSize.base,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal,
    },
    small: {
      fontSize: fluidFontSize.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal,
    },
  },

  // UI text
  ui: {
    label: {
      fontSize: fluidFontSize.sm,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.wide,
    },
    caption: {
      fontSize: fluidFontSize.xs,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal,
    },
    button: {
      fontSize: fluidFontSize.sm,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.none,
      letterSpacing: letterSpacing.wide,
    },
  },

  // Card text
  card: {
    title: {
      fontSize: fluidFontSize.xl,
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.snug,
      letterSpacing: letterSpacing.tight,
    },
    subtitle: {
      fontSize: fluidFontSize.base,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal,
    },
    meta: {
      fontSize: fluidFontSize.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal,
    },
  },
} as const;

// Helper function to generate CSS styles
export const getTypographyStyle = (preset: keyof typeof typographyPresets, variant: string) => {
  const presetGroup = typographyPresets[preset] as any;
  const style = presetGroup[variant];

  if (!style) return {};

  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };
};