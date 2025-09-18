import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import RelatedTricksWrapper from "@/components/organisms/RelatedTricksWrapper";
import { TricksService } from "@/lib/services/tricks.service";
import { KITrick, Category } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import { Calendar, Wrench, ArrowRight } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import SchemaMarkup from "@/components/SEO/SchemaMarkup";
import {
  generateTrickArticleSchema,
  generateHowToSchema,
  generateBreadcrumbSchema,
  generateWebsiteSchema
} from "@/lib/utils/schema-markup";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Use admin client for static generation (no cookies needed)
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const { data: tricks } = await supabase
    .from("ki_tricks")
    .select("slug")
    .eq("status", "published");

  return (tricks || []).map((trick) => ({
    slug: trick.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trickData = await TricksService.getTrickBySlug(slug);

  if (!trickData) {
    return {
      title: "Trick nicht gefunden - KI Tricks Platform",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com';
  const canonical = `${siteUrl.replace(/\/$/, '')}/trick/${slug}`;

  return {
    title: `${trickData.title} - KI Tricks Platform`,
    description: trickData.description,
    openGraph: {
      title: trickData.title,
      description: trickData.description,
      type: "article",
      publishedTime: trickData.created_at,
      modifiedTime: trickData.updated_at,
      tags: [trickData.category, ...trickData.tools],
    },
    alternates: {
      canonical,
    },
  };
}

export default async function TrickDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const trickData = await TricksService.getTrickBySlug(slug);

  if (!trickData) {
    notFound();
  }

  // Convert Supabase data to KITrick format
  const trick: KITrick = {
    id: trickData.id,
    title: trickData.title,
    description: trickData.description,
    category: trickData.category as Category,
    tools: trickData.tools,
    steps: trickData.steps || null,
    examples: trickData.examples || null,
    slug: trickData.slug,
    why_it_works: trickData.why_it_works,
    status: trickData.status || 'published',
    quality_score: trickData.quality_score || null,
    view_count: trickData.view_count || 0,
    created_at: trickData.created_at,
    updated_at: trickData.updated_at,
    published_at: trickData.published_at || null
  };

  // Track page view
  TricksService.incrementViewCount(slug).catch(console.error);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero / Article Header */}
      <section className="py-12 md:py-16 lg:py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="mb-8">
              <Link
                href={`/tricks?categories=${trick.category}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {trick.category} Tricks →
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight tracking-tight">
              {trick.title}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-12 max-w-4xl mx-auto">
              {trick.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8" asChild>
                <a href="#schritt-fuer-schritt">Jetzt testen</a>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 bg-transparent" asChild>
                <a href="#beispiele">Beispiele sehen</a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(trick.created_at).toLocaleDateString('de-DE')}</span>
              </div>
              {trick.tools?.length > 0 && (
                <div className="flex items-center gap-2 break-words">
                  <Wrench className="h-4 w-4" />
                  <span>{trick.tools.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

  <div className="container max-w-4xl mx-auto px-4">
        {/* Why it works */}
        {trick.why_it_works && (
          <section className="py-10 md:py-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Warum es funktioniert</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {trick.why_it_works}
            </p>
          </section>
        )}


        {/* Steps */}
        <section className="py-12 md:py-16">
          <div id="schritt-fuer-schritt" className="scroll-mt-24 sm:scroll-mt-32">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Schritt-für-Schritt Anleitung</h2>
            {trick.steps && trick.steps.length > 0 ? (
              <div className="space-y-5 sm:space-y-6">
                {trick.steps.map((step, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Schritt {idx + 1}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">{step}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Keine Schritte vorhanden.</p>
            )}
          </div>
        </section>

        {/* Examples - match Schritt-für-Schritt layout for consistency */}
        <section className="py-12 md:py-16 border-t border-border">
          <div id="beispiele" className="scroll-mt-24 sm:scroll-mt-32">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Praktische Beispiele</h2>
            {trick.examples && trick.examples.length > 0 ? (
              <div className="space-y-5 sm:space-y-6">
                {trick.examples.map((example, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Beispiel {idx + 1}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">{example}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Keine Beispiele vorhanden.</p>
            )}
          </div>
        </section>

        {/* Related Tricks */}
        <section className="py-12 md:py-16 border-t border-border">
          <RelatedTricksWrapper currentTrickId={trick.id} category={trick.category} />
          <div className="flex justify-center mt-8 sm:mt-10">
            <Button variant="secondary" size="md" asChild>
              <Link href="/tricks" className="inline-flex items-center gap-2">
                Alle Tricks ansehen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>

  <Footer />

      {/* Schema Markup for SEO */}
      <SchemaMarkup
        id="website-schema"
        schema={generateWebsiteSchema()}
      />
      <SchemaMarkup
        id="article-schema"
        schema={generateTrickArticleSchema(trick, trick.category)}
      />
      {trick.steps && trick.steps.length > 0 && (
        <SchemaMarkup
          id="howto-schema"
          schema={generateHowToSchema(trick)}
        />
      )}
      <SchemaMarkup
        id="breadcrumb-schema"
        schema={generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Tricks', url: '/tricks' },
          { name: trick.category, url: `/tricks?categories=${trick.category}` },
          { name: trick.title, url: `/trick/${trick.slug}` }
        ])}
      />
    </div>
  );
}
