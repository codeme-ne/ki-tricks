/**
 * Spacing System - 4px base unit system for consistent layout
 */

// Base spacing unit (4px)
const BASE_UNIT = 4;

// Spacing scale using 4px base
export const spacing = {
  // Micro spacing (0-8px)
  0: 0,
  1: BASE_UNIT,     // 4px
  2: BASE_UNIT * 2, // 8px

  // Small spacing (12-16px)
  3: BASE_UNIT * 3, // 12px
  4: BASE_UNIT * 4, // 16px

  // Medium spacing (20-32px)
  5: BASE_UNIT * 5, // 20px
  6: BASE_UNIT * 6, // 24px
  7: BASE_UNIT * 7, // 28px
  8: BASE_UNIT * 8, // 32px

  // Large spacing (36-64px)
  9: BASE_UNIT * 9,   // 36px
  10: BASE_UNIT * 10, // 40px
  12: BASE_UNIT * 12, // 48px
  14: BASE_UNIT * 14, // 56px
  16: BASE_UNIT * 16, // 64px

  // Extra large spacing (72px+)
  18: BASE_UNIT * 18, // 72px
  20: BASE_UNIT * 20, // 80px
  24: BASE_UNIT * 24, // 96px
  32: BASE_UNIT * 32, // 128px
} as const;

// Component-specific spacing presets
export const componentSpacing = {
  // Card spacing
  card: {
    padding: {
      compact: spacing[3],   // 12px
      default: spacing[4],   // 16px
      feature: spacing[5],   // 20px
      hero: spacing[6],      // 24px
    },
    gap: {
      tight: spacing[2],     // 8px
      default: spacing[3],   // 12px
      loose: spacing[4],     // 16px
    }
  },

  // Layout spacing
  layout: {
    section: spacing[16],    // 64px
    container: spacing[4],   // 16px (mobile) to spacing[6] (desktop) - 24px
    header: spacing[4],      // 16px
  },

  // Typography spacing
  typography: {
    lineHeight: {
      tight: 1.2,
      default: 1.5,
      relaxed: 1.7,
    },
    letterSpacing: {
      tight: '-0.025em',
      default: '0',
      wide: '0.025em',
    }
  }
} as const;

// Responsive spacing utilities
export const responsiveSpacing = {
  // Fluid spacing using clamp()
  fluidPadding: {
    sm: 'clamp(12px, 3vw, 16px)',    // 12px - 16px
    md: 'clamp(16px, 4vw, 24px)',    // 16px - 24px
    lg: 'clamp(24px, 5vw, 32px)',    // 24px - 32px
    xl: 'clamp(32px, 6vw, 48px)',    // 32px - 48px
  },

  fluidGap: {
    sm: 'clamp(8px, 2vw, 12px)',     // 8px - 12px
    md: 'clamp(12px, 3vw, 16px)',    // 12px - 16px
    lg: 'clamp(16px, 4vw, 24px)',    // 16px - 24px
    xl: 'clamp(24px, 5vw, 32px)',    // 24px - 32px
  }
} as const;

// Helper function to get spacing value
export const getSpacing = (size: keyof typeof spacing): string => {
  return `${spacing[size]}px`;
};

// Helper function to get responsive spacing
export const getResponsiveSpacing = (
  mobile: keyof typeof spacing,
  desktop?: keyof typeof spacing
): string => {
  if (!desktop) return getSpacing(mobile);
  return `clamp(${spacing[mobile]}px, 4vw, ${spacing[desktop]}px)`;
};