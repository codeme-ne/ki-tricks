"use client";

import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook for lazy loading content using Intersection Observer
 */
export const useLazyLoad = (options: UseLazyLoadOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // Skip if already intersected and triggerOnce is true
    if (triggerOnce && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        if (isVisible && triggerOnce) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  const shouldLoad = triggerOnce ? (isIntersecting || hasIntersected) : isIntersecting;

  return {
    targetRef,
    isIntersecting,
    hasIntersected,
    shouldLoad,
  };
};

/**
 * Hook specifically for lazy loading images
 */
export const useLazyImage = (src: string, options: UseLazyLoadOptions = {}) => {
  const { targetRef, shouldLoad } = useLazyLoad(options);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!shouldLoad || !src) return;

    const img = new Image();

    img.onload = () => {
      setIsLoaded(true);
      setIsError(false);
    };

    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [shouldLoad, src]);

  return {
    targetRef,
    shouldLoad,
    isLoaded,
    isError,
    imageSrc: shouldLoad ? src : undefined,
  };
};

/**
 * Hook for lazy loading card content
 */
export const useLazyCard = (options: UseLazyLoadOptions = {}) => {
  const defaultOptions = {
    threshold: 0.05, // Load when 5% visible
    rootMargin: '100px', // Preload 100px before visible
    triggerOnce: true,
    ...options,
  };

  return useLazyLoad(defaultOptions);
};