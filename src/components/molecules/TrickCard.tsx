"use client";

import React from "react";
import Link from "next/link";
import { Badge, BaseCard } from "@/components/atoms";
import { KITrick, TrickCardProps, categoryMetadata } from "@/lib/types/types";
import {
  ArrowRight,
  Clock,
  Code2,
  Brain,
  Briefcase,
  BarChart3,
  PenTool,
  Palette,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

export const TrickCard = React.memo(function TrickCard({
  trick,
  onClick,
  index = 0,
}: TrickCardProps & {
  index?: number;
}) {
  const categoryMeta = categoryMetadata[trick.category];

  // KI/Tech-thematische Icons für verschiedene Kategorien
  const getCategoryIcon = () => {
    const iconClass = "w-4 h-4 text-neutral-400";
    switch (trick.category) {
      case "programming":
        return <Code2 className={iconClass} />;
      case "productivity":
        return <TrendingUp className={iconClass} />;
      case "content-creation":
        return <PenTool className={iconClass} />;
      case "data-analysis":
        return <BarChart3 className={iconClass} />;
      case "learning":
        return <Brain className={iconClass} />;
      case "business":
        return <Briefcase className={iconClass} />;
      case "marketing":
        return <TrendingUp className={iconClass} />;
      case "design":
        return <Palette className={iconClass} />;
      default:
        return <BookOpen className={iconClass} />;
    }
  };

  const cardContent = (
    <BaseCard onClick={onClick} as="article" variant="default">
      {/* Header: Icon + Category */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {getCategoryIcon()}
        <Badge className="bg-neutral-50 border-neutral-200 text-neutral-700 text-xs py-1 px-2.5 font-medium">
          {categoryMeta.label}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-neutral-900 font-semibold leading-tight text-lg mb-2">
        {trick.title}
      </h3>

      {/* Description */}
      <p className="text-neutral-600 text-sm leading-relaxed flex-1 line-clamp-3">
        {trick.description.split("\n")[0]}
      </p>

      {/* Action */}
      <div className="mt-auto pt-3 flex items-center justify-between">
        <span className="text-xs text-neutral-400 font-medium">Mehr erfahren</span>
        <div className="p-1.5 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </BaseCard>
  );

  if (onClick) {
    return cardContent;
  }

  return (
    <Link href={`/trick/${trick.slug}`} className="block h-full group">
      {cardContent}
    </Link>
  );
});
