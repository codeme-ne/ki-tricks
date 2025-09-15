"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "title" | "avatar" | "button" | "image";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "text",
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] rounded";

  const variantClasses = {
    text: "h-4 rounded",
    title: "h-6 rounded",
    avatar: "w-10 h-10 rounded-full",
    button: "h-10 rounded-lg",
    image: "aspect-video rounded-lg",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && "w-3/4", // Last line shorter
              className
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
    />
  );
};

// Card skeleton loader variants
interface CardSkeletonProps {
  variant?: "compact" | "default" | "feature" | "hero";
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  variant = "default",
  className,
}) => {
  const skeletonConfigs = {
    compact: {
      titleHeight: "h-4",
      descriptionLines: 2,
      showImage: false,
      footerHeight: "h-6",
    },
    default: {
      titleHeight: "h-5",
      descriptionLines: 3,
      showImage: false,
      footerHeight: "h-8",
    },
    feature: {
      titleHeight: "h-6",
      descriptionLines: 3,
      showImage: true,
      footerHeight: "h-8",
    },
    hero: {
      titleHeight: "h-7",
      descriptionLines: 4,
      showImage: true,
      footerHeight: "h-10",
    },
  };

  const config = skeletonConfigs[variant];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Image skeleton for feature/hero variants */}
      {config.showImage && (
        <Skeleton variant="image" className="w-full" />
      )}

      {/* Header section */}
      <div className="space-y-2">
        {/* Category badge */}
        <Skeleton className="w-20 h-5 rounded-full" />

        {/* Title */}
        <Skeleton className={cn("w-4/5", config.titleHeight)} />
      </div>

      {/* Content section */}
      <div className="space-y-2">
        {/* Description lines */}
        {Array.from({ length: config.descriptionLines }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-3",
              index === config.descriptionLines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>

      {/* Footer section */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-16 h-4" />
        <Skeleton className={cn("w-8", config.footerHeight, "rounded-full")} />
      </div>
    </div>
  );
};

// Grid skeleton loader
interface GridSkeletonProps {
  count?: number;
  variant?: "compact" | "default" | "feature" | "hero";
  gridCols?: 1 | 2 | 3 | 4;
  className?: string;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  count = 6,
  variant = "default",
  gridCols = 3,
  className,
}) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={cn(
      "grid gap-4 sm:gap-5 md:gap-6",
      gridClasses[gridCols],
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-neutral-100 rounded-xl p-4 sm:p-5"
        >
          <CardSkeleton variant={variant} />
        </div>
      ))}
    </div>
  );
};

Skeleton.displayName = "Skeleton";
CardSkeleton.displayName = "CardSkeleton";
GridSkeleton.displayName = "GridSkeleton";