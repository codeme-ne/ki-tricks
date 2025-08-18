import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header, Footer, PageContainer } from '@/components/layout'
import { SparklesCore } from '@/components/atoms'
import { TrickHeader, TrickContent } from '@/components/organisms'
import RelatedTricksWrapper from '@/components/organisms/RelatedTricksWrapper'
import { TricksService } from '@/lib/services/tricks.service'
import { KITrick, Category } from '@/lib/types/types'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  // Use admin client for static generation (no cookies needed)
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const supabase = createAdminClient()
  
  const { data: tricks } = await supabase
    .from('ki_tricks')
    .select('slug')
    .eq('status', 'published')
  
  return (tricks || []).map((trick) => ({
    slug: trick.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const trickData = await TricksService.getTrickBySlug(slug)
  
  if (!trickData) {
    return {
      title: 'Trick nicht gefunden - KI Tricks Platform'
    }
  }

  return {
    title: `${trickData.title} - KI Tricks Platform`,
    description: trickData.description,
    openGraph: {
      title: trickData.title,
      description: trickData.description,
      type: 'article',
      publishedTime: trickData.created_at,
      modifiedTime: trickData.updated_at,
      tags: [trickData.category, ...trickData.tools],
    }
  }
}

export default async function TrickDetailPage({ params }: PageProps) {
  const { slug } = await params
  const trickData = await TricksService.getTrickBySlug(slug)

  if (!trickData) {
    notFound()
  }

  // Convert Supabase data to KITrick format
  const trick: KITrick = {
    id: trickData.id,
    title: trickData.title,
    description: trickData.description,
    category: trickData.category as Category,
    difficulty: trickData.difficulty,
    tools: trickData.tools,
    timeToImplement: trickData.time_to_implement,
    impact: trickData.impact,
    steps: trickData.steps || [],
    examples: trickData.examples || [],
    slug: trickData.slug,
    createdAt: new Date(trickData.created_at),
    updatedAt: new Date(trickData.updated_at),
    'Warum es funktioniert': trickData.why_it_works
  }

  // Track page view
  TricksService.incrementViewCount(slug).catch(console.error)

  return (
    <div className="min-h-screen flex flex-col relative bg-[#0A0A0F]">
      {/* Background Sparkles - same as Tricks page */}
      <div className="fixed inset-0 h-full w-full">
        <SparklesCore
          id="tsparticlesdetailpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#2299dd"
          speed={1}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <PageContainer>
          {/* Main Content Container with Glassmorphism */}
          <article className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Glass Container Background */}
              <div className="absolute inset-0 bg-neutral-800/20 backdrop-blur-sm rounded-2xl" />
              
              {/* Content */}
              <div className="relative p-8">
                <TrickHeader trick={trick} />
                
                <div className="mt-8 mb-12">
                  <TrickContent trick={trick} />
                </div>
              </div>
            </div>
          </article>
          
          {/* Related Tricks Section */}
          <div className="mt-16">
            <RelatedTricksWrapper 
              currentTrickId={trick.id}
              category={trick.category}
            />
          </div>
        </PageContainer>
        <Footer />
      </div>
    </div>
  )
}