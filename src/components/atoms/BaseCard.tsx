"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils/utils";

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  as?: "div" | "article" | "section";
  variant?: "default" | "compact" | "feature" | "hero";
}

interface AnimationState {
  scale: number;
  translateY?: number;
  transition: string;
}

const cardAnimations: Record<string, AnimationState> = {
  hover: {
    scale: 1.01,
    translateY: -2,
    transition: "all 0.2s ease-out"
  },
  tap: {
    scale: 0.99,
    translateY: 0,
    transition: "all 0.1s ease-in"
  },
  default: {
    scale: 1,
    translateY: 0,
    transition: "all 0.2s ease-out"
  }
};

export const BaseCard = React.memo(function BaseCard({
  children,
  className,
  hover = true,
  onClick,
  as: Component = "div",
  variant = "default",
}: BaseCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
  }, []);

  const handleMouseEnter = () => {
    if (hover && !isTouchDevice) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (onClick) setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleTouchStart = () => {
    if (onClick) setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const getAnimationStyle = () => {
    if (isPressed) return cardAnimations.tap;
    if (isHovered && !isTouchDevice) return cardAnimations.hover;
    return cardAnimations.default;
  };

  const animationStyle = getAnimationStyle();

  return (
    <Component
      className={cn(
        // Base styles using new trick-card class for pseudo-element shadows
        "trick-card",
        "bg-white border border-neutral-100 rounded-xl",
        "flex flex-col relative",

        // Gradient background for depth
        "bg-gradient-to-br from-white to-neutral-50/30",

        // Height variants with mobile-first responsive design
        variant === "compact" && "min-h-[140px] p-3 sm:p-4",
        variant === "default" && "min-h-[160px] sm:min-h-[180px] p-4 sm:p-5",
        variant === "feature" && "min-h-[180px] sm:min-h-[200px] p-4 sm:p-5 md:p-6",
        variant === "hero" && "min-h-[200px] sm:min-h-[240px] p-5 sm:p-6 md:p-8",

        // Mobile touch targets (minimum 44px for accessibility)
        onClick && "min-h-[44px]",

        // Responsive spacing and margins using CSS clamp()
        "gap-2 sm:gap-3 md:gap-4",

        // Interactive styles
        onClick && "cursor-pointer",

        // Mobile-specific optimizations
        "touch-manipulation", // Improves touch response
        "select-none", // Prevents text selection on mobile taps

        className
      )}
      style={{
        transform: `scale(${animationStyle.scale}) translateY(${animationStyle.translateY || 0}px)`,
        transition: animationStyle.transition,
        willChange: hover ? 'transform' : 'auto',
        // Hardware acceleration hints
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        // Optimize rendering
        contain: 'layout style paint',
      } as React.CSSProperties}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </Component>
  );
});

BaseCard.displayName = "BaseCard";