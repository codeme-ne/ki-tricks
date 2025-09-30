"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { Button } from "./button";
import { AnimatedHeroTitle } from "./text-reveal";

export const AnimatedHeroSection = () => {
  return (
    <>
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-semibold">Kuratierte KI-Workflows für Professionals</span>
      </motion.div>

      {/* Animated Hero Title */}
      <div className="mb-6">
        <AnimatedHeroTitle
          text="Entdecke bewährte KI-Tricks"
          delay={0.2}
          className="mb-6"
        />
      </div>

      {/* Animated Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-foreground/80 dark:text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
      >
        Keine generischen Tutorials. Nur praxiserprobte Workflows mit exakten Prompts, Tool-Kombinationen und Beispielen aus echten Projekten.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        className="flex items-center justify-center gap-4 flex-col sm:flex-row mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
      >
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-lg font-bold px-8 py-6"
          asChild
        >
          <Link href="/tricks" className="inline-flex items-center gap-2">
            Jetzt Tricks entdecken
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all hover:scale-105 text-base font-semibold px-6"
          asChild
        >
          <Link href="/tricks/einreichen" className="inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Trick einreichen
          </Link>
        </Button>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link
          href="#categories"
          className="text-base text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 font-semibold group"
        >
          Oder nach Kategorien stöbern
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </>
  );
};
