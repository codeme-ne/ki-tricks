/**
 * Content preloading utilities for better performance
 */

// Preload strategy types
export type PreloadStrategy = 'eager' | 'lazy' | 'viewport' | 'hover';

// Preload resource types
export type PreloadType = 'image' | 'font' | 'script' | 'style' | 'document';

interface PreloadOptions {
  strategy?: PreloadStrategy;
  priority?: 'high' | 'low' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

/**
 * Preload images for better performance
 */
export const preloadImage = (src: string, options: PreloadOptions = {}): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = reject;

    // Set cross-origin if specified
    if (options.crossOrigin) {
      img.crossOrigin = options.crossOrigin;
    }

    img.src = src;
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = async (
  srcs: string[],
  options: PreloadOptions = {}
): Promise<HTMLImageElement[]> => {
  try {
    return await Promise.all(srcs.map(src => preloadImage(src, options)));
  } catch (error) {
    console.warn('Failed to preload some images:', error);
    return [];
  }
};

/**
 * Preload resources using link preload
 */
export const preloadResource = (
  href: string,
  type: PreloadType,
  options: PreloadOptions = {}
) => {
  // Check if already preloaded
  const existing = document.querySelector(`link[href="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;

  // Set resource type
  switch (type) {
    case 'image':
      link.as = 'image';
      break;
    case 'font':
      link.as = 'font';
      link.type = 'font/woff2';
      if (!options.crossOrigin) {
        link.crossOrigin = 'anonymous';
      }
      break;
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
    case 'document':
      link.as = 'document';
      break;
  }

  // Set priority
  if (options.priority && link.fetchPriority !== undefined) {
    link.fetchPriority = options.priority;
  }

  // Set cross-origin
  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }

  document.head.appendChild(link);
};

/**
 * Preload critical images based on viewport
 */
export const preloadCriticalImages = () => {
  // Get images in viewport or near viewport
  const images = Array.from(document.querySelectorAll('img'));
  const viewportHeight = window.innerHeight;

  images.forEach(img => {
    const rect = img.getBoundingClientRect();
    const isNearViewport = rect.top < viewportHeight * 1.5; // 1.5x viewport height

    if (isNearViewport && img.dataset.src) {
      preloadImage(img.dataset.src).catch(() => {
        // Silently handle preload errors
      });
    }
  });
};

/**
 * Hover-based preloading for better UX
 */
export const setupHoverPreload = (
  element: HTMLElement,
  resources: { href: string; type: PreloadType }[]
) => {
  let preloaded = false;

  const handleHover = () => {
    if (preloaded) return;

    resources.forEach(({ href, type }) => {
      preloadResource(href, type, { strategy: 'hover' });
    });

    preloaded = true;
  };

  element.addEventListener('mouseenter', handleHover, { once: true });
  element.addEventListener('focus', handleHover, { once: true });

  // Cleanup
  return () => {
    element.removeEventListener('mouseenter', handleHover);
    element.removeEventListener('focus', handleHover);
  };
};

/**
 * Smart preloading based on connection and device
 */
export const getOptimalPreloadStrategy = (): PreloadStrategy => {
  // Check connection quality
  const connection = (navigator as any).connection;

  if (connection) {
    // Slow connection - be conservative
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return 'lazy';
    }

    // Fast connection - preload more aggressively
    if (connection.effectiveType === '4g') {
      return 'viewport';
    }
  }

  // Check if device prefers reduced data
  const prefersReducedData = (navigator as any).connection?.saveData;
  if (prefersReducedData) {
    return 'lazy';
  }

  // Default strategy
  return 'viewport';
};

/**
 * Cache management for preloaded content
 */
class PreloadCache {
  private cache = new Map<string, HTMLImageElement>();
  private maxSize = 50; // Maximum cached images

  set(key: string, image: HTMLImageElement) {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, image);
  }

  get(key: string): HTMLImageElement | undefined {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const preloadCache = new PreloadCache();