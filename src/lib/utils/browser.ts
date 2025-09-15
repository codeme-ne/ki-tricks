/**
 * Browser compatibility utilities for cross-browser support
 */

// Browser detection utilities
export const getBrowserInfo = () => {
  if (typeof window === 'undefined') return { name: 'server', version: '0' };

  const userAgent = window.navigator.userAgent;

  // Chrome
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    const match = userAgent.match(/Chrome\/(\d+)/);
    return { name: 'chrome', version: match ? match[1] : '0' };
  }

  // Firefox
  if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/(\d+)/);
    return { name: 'firefox', version: match ? match[1] : '0' };
  }

  // Safari
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/(\d+)/);
    return { name: 'safari', version: match ? match[1] : '0' };
  }

  // Edge
  if (userAgent.includes('Edg')) {
    const match = userAgent.match(/Edg\/(\d+)/);
    return { name: 'edge', version: match ? match[1] : '0' };
  }

  // Internet Explorer
  if (userAgent.includes('Trident') || userAgent.includes('MSIE')) {
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    return { name: 'ie', version: match ? match[1] : '0' };
  }

  return { name: 'unknown', version: '0' };
};

// Feature detection utilities
export const supportsFeature = {
  // CSS features
  backdropFilter: () => {
    if (typeof window === 'undefined') return false;
    const div = document.createElement('div');
    return 'backdropFilter' in div.style || 'webkitBackdropFilter' in div.style;
  },

  cssGrid: () => {
    if (typeof window === 'undefined') return false;
    const div = document.createElement('div');
    return 'grid' in div.style || 'msGrid' in div.style;
  },

  flexbox: () => {
    if (typeof window === 'undefined') return false;
    const div = document.createElement('div');
    return 'flex' in div.style || 'webkitFlex' in div.style;
  },

  transforms3d: () => {
    if (typeof window === 'undefined') return false;
    const div = document.createElement('div');
    return 'transform' in div.style || 'webkitTransform' in div.style;
  },

  // JavaScript features
  intersectionObserver: () => {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window;
  },

  webp: () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  },

  avif: () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  },

  // Touch support
  touch: () => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  },

  // Reduced motion preference
  reducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
};

// CSS prefix utilities
export const addVendorPrefixes = (property: string, value: string) => {
  const prefixes = ['-webkit-', '-moz-', '-o-', '-ms-', ''];
  const rules: string[] = [];

  prefixes.forEach(prefix => {
    rules.push(`${prefix}${property}: ${value};`);
  });

  return rules.join('\n');
};

// Get optimal image format based on browser support
export const getOptimalImageFormat = (fallback: string = 'jpg'): string => {
  if (supportsFeature.avif()) return 'avif';
  if (supportsFeature.webp()) return 'webp';
  return fallback;
};

// Browser-specific CSS class names
export const getBrowserClasses = (): string[] => {
  const browser = getBrowserInfo();
  const classes: string[] = [];

  // Browser name
  classes.push(`browser-${browser.name}`);

  // Browser version (major version only)
  classes.push(`browser-${browser.name}-${browser.version.split('.')[0]}`);

  // Feature classes
  if (!supportsFeature.backdropFilter()) classes.push('no-backdrop-filter');
  if (!supportsFeature.cssGrid()) classes.push('no-css-grid');
  if (!supportsFeature.flexbox()) classes.push('no-flexbox');
  if (!supportsFeature.transforms3d()) classes.push('no-transforms3d');
  if (supportsFeature.touch()) classes.push('touch-device');
  if (supportsFeature.reducedMotion()) classes.push('reduced-motion');

  return classes;
};

// Apply browser classes to document
export const applyBrowserClasses = () => {
  if (typeof document === 'undefined') return;

  const classes = getBrowserClasses();
  document.documentElement.classList.add(...classes);
};

// CSS fallback generators
export const generateGradientFallback = (
  direction: string,
  colorStops: string[]
): Record<string, string> => {
  const gradient = `linear-gradient(${direction}, ${colorStops.join(', ')})`;

  return {
    backgroundColor: colorStops[0], // Fallback to first color
    backgroundImage: gradient,
    // Browser prefixed fallbacks are typically handled by CSS autoprefixer
    // in modern builds, but if needed they should be separate style properties
  };
};

export const generateTransformFallback = (transform: string): Record<string, string> => {
  return {
    '-webkit-transform': transform,
    '-moz-transform': transform,
    '-o-transform': transform,
    '-ms-transform': transform,
    transform: transform,
  };
};

export const generateTransitionFallback = (transition: string): Record<string, string> => {
  return {
    '-webkit-transition': transition,
    '-moz-transition': transition,
    '-o-transition': transition,
    transition: transition,
  };
};

// Legacy browser polyfills
export const loadPolyfills = async () => {
  const polyfills: Promise<any>[] = [];

  // Intersection Observer polyfill - modern browsers support this natively
  // if (!supportsFeature.intersectionObserver()) {
  //   polyfills.push(
  //     import('intersection-observer').catch(() => {
  //       console.warn('Failed to load IntersectionObserver polyfill');
  //     })
  //   );
  // }

  // Wait for all polyfills to load
  await Promise.allSettled(polyfills);
};

// Browser-specific optimizations
export const getBrowserOptimizations = () => {
  const browser = getBrowserInfo();

  const optimizations = {
    // Disable expensive effects on older browsers
    disableAnimations: browser.name === 'ie' ||
      (browser.name === 'safari' && parseInt(browser.version) < 12),

    // Use simpler gradients on mobile Safari
    useSimpleGradients: browser.name === 'safari' && supportsFeature.touch(),

    // Reduce shadow complexity on Firefox
    useSimpleShadows: browser.name === 'firefox',

    // Enable hardware acceleration on modern browsers
    useHardwareAcceleration: browser.name !== 'ie' &&
      !(browser.name === 'safari' && parseInt(browser.version) < 10),
  };

  return optimizations;
};