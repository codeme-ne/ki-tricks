import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header, Footer, PageContainer } from '@/components/layout'
import { SparklesCore } from '@/components/atoms'
import { TrickHeader, TrickContent, RelatedTricks } from '@/components/organisms'
import { mockTricks } from '@/lib/data/mock-data'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return mockTricks.map((trick) => ({
    slug: trick.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const trick = mockTricks.find(t => t.slug === slug)
  
  if (!trick) {
    return {
      title: 'Trick nicht gefunden - KI Tricks Platform'
    }
  }

  return {
    title: `${trick.title} - KI Tricks Platform`,
    description: trick.description,
    openGraph: {
      title: trick.title,
      description: trick.description,
      type: 'article',
      publishedTime: trick.createdAt.toISOString(),
      modifiedTime: trick.updatedAt.toISOString(),
      tags: [trick.category, ...trick.tools],
    }
  }
}

export default async function TrickDetailPage({ params }: PageProps) {
  const { slug } = await params
  const trick = mockTricks.find(t => t.slug === slug)

  if (!trick) {
    notFound()
  }

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
            <RelatedTricks 
              currentTrickId={trick.id}
              category={trick.category}
              tricks={mockTricks}
            />
          </div>
        </PageContainer>
        <Footer />
      </div>
    </div>
  )
}