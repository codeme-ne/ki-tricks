"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface CardLayoutProps {
  children: React.ReactNode;
  variant?: "compact" | "default" | "feature" | "hero";
  className?: string;
}

// Layout templates for different card variants
const layoutVariants = {
  compact: {
    container: "flex flex-col gap-2",
    header: "space-y-1",
    content: "flex-1 min-h-0",
    footer: "mt-auto pt-2",
  },
  default: {
    container: "flex flex-col gap-3",
    header: "space-y-2",
    content: "flex-1 min-h-0",
    footer: "mt-auto pt-3",
  },
  feature: {
    container: "flex flex-col gap-4",
    header: "space-y-2",
    content: "flex-1 min-h-0",
    footer: "mt-auto pt-4",
  },
  hero: {
    container: "flex flex-col gap-5",
    header: "space-y-3",
    content: "flex-1 min-h-0",
    footer: "mt-auto pt-5",
  },
} as const;

export const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  variant = "default",
  className,
}) => {
  const layout = layoutVariants[variant];

  return (
    <div className={cn(layout.container, className)}>
      {children}
    </div>
  );
};

// Header component for card layouts
interface CardHeaderProps {
  children: React.ReactNode;
  variant?: "compact" | "default" | "feature" | "hero";
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  variant = "default",
  className,
}) => {
  const layout = layoutVariants[variant];

  return (
    <div className={cn(layout.header, className)}>
      {children}
    </div>
  );
};

// Content component for card layouts
interface CardContentProps {
  children: React.ReactNode;
  variant?: "compact" | "default" | "feature" | "hero";
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  variant = "default",
  className,
}) => {
  const layout = layoutVariants[variant];

  return (
    <div className={cn(layout.content, className)}>
      {children}
    </div>
  );
};

// Footer component for card layouts
interface CardFooterProps {
  children: React.ReactNode;
  variant?: "compact" | "default" | "feature" | "hero";
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  variant = "default",
  className,
}) => {
  const layout = layoutVariants[variant];

  return (
    <div className={cn(layout.footer, className)}>
      {children}
    </div>
  );
};

CardLayout.displayName = "CardLayout";
CardHeader.displayName = "CardHeader";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";