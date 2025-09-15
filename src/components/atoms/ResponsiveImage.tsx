"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";
import { useLazyImage } from "@/hooks/useLazyLoad";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "portrait";
  priority?: boolean;
  sizes?: string;
  enableLazyLoad?: boolean;
  placeholder?: React.ReactNode;
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[16/9]",
  portrait: "aspect-[3/4]"
};

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  aspectRatio = "video",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  enableLazyLoad = true,
  placeholder
}) => {
  const { targetRef, shouldLoad, isLoaded, isError } = useLazyImage(src, {
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: true,
  });

  // Skip lazy loading for priority images
  const useLazy = enableLazyLoad && !priority;

  const containerClasses = cn(
    "relative overflow-hidden rounded-lg",
    aspectRatioClasses[aspectRatio],
    className
  );

  if (!useLazy) {
    return (
      <div className={containerClasses}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={priority}
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div ref={targetRef} className={containerClasses}>
      {shouldLoad ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-all duration-300 hover:scale-105",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          priority={priority}
          sizes={sizes}
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          }}
        />
      ) : (
        placeholder || (
          <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 animate-pulse" />
        )
      )}

      {isError && (
        <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
          <span className="text-neutral-400 text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
};

ResponsiveImage.displayName = "ResponsiveImage";