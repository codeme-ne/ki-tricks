"use client";

import React from "react";
import { useLazyCard } from "@/hooks/useLazyLoad";
import { BaseCard } from "./BaseCard";
import { CardSkeleton } from "./SkeletonLoader";

interface LazyCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  as?: "div" | "article" | "section";
  variant?: "default" | "compact" | "feature" | "hero";
  enableLazyLoad?: boolean;
  skeleton?: React.ReactNode;
  loadingThreshold?: number;
  rootMargin?: string;
}

export const LazyCard: React.FC<LazyCardProps> = ({
  children,
  className,
  hover = true,
  onClick,
  as = "div",
  variant = "default",
  enableLazyLoad = true,
  skeleton,
  loadingThreshold = 0.05,
  rootMargin = "100px",
}) => {
  const { targetRef, shouldLoad } = useLazyCard({
    threshold: loadingThreshold,
    rootMargin,
    triggerOnce: true,
  });

  // If lazy loading is disabled, render immediately
  if (!enableLazyLoad) {
    return (
      <BaseCard
        className={className}
        hover={hover}
        onClick={onClick}
        as={as}
        variant={variant}
      >
        {children}
      </BaseCard>
    );
  }

  return (
    <div ref={targetRef}>
      {shouldLoad ? (
        <BaseCard
          className={className}
          hover={hover}
          onClick={onClick}
          as={as}
          variant={variant}
        >
          {children}
        </BaseCard>
      ) : (
        <BaseCard
          className={className}
          hover={false}
          as={as}
          variant={variant}
        >
          {skeleton || <CardSkeleton variant={variant} />}
        </BaseCard>
      )}
    </div>
  );
};

LazyCard.displayName = "LazyCard";