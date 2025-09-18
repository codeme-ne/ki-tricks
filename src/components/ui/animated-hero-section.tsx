"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "./button";
import { AnimatedHeroTitle } from "./text-reveal";

export const AnimatedHeroSection = () => {
  return (
    <>
      {/* Animated Hero Title */}
      <div className="mb-6">
        <AnimatedHeroTitle
          text="Entdecke bewährte KI-Tricks"
          delay={0.2}
          className="mb-4"
        />
      </div>

      {/* Animated Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-readable"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
      >
        Praktische KI-Tipps für deinen Arbeitsalltag.
      </motion.p>

      {/* Action Buttons - Reduced to 2 primary CTAs */}
      <motion.div
        className="flex items-center justify-center gap-4 flex-col sm:flex-row"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
      >
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          asChild
        >
          <Link href="/tricks" className="inline-flex items-center gap-2">
            Tricks entdecken
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto"
          asChild
        >
          <Link href="/tricks/einreichen" className="inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Trick einreichen
          </Link>
        </Button>
      </motion.div>

      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link
          href="#categories"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Oder nach Kategorien stöbern →
        </Link>
      </motion.div>
    </>
  );
};
