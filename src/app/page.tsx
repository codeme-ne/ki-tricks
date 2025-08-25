import { Header, Footer } from '@/components/layout'
import { AnimatedHeroSection } from '@/components/ui/animated-hero-section'
import { MinimalButton } from '@/components/ui/MinimalButton'
import { MinimalStatsGrid } from '@/components/ui/MinimalStatsGrid'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { 
  getTotalTricksCount, 
  getTotalCategoriesCount, 
  getAllTools,
  getAverageImplementationTime,
  getTrickCountByCategory,
  getAllCategories
} from '@/lib/actions/tricks.actions'
import { categoryLabels, categoryEmojis } from '@/lib/constants/constants'

// Category to icon mapping
const categoryIcons: Record<string, string> = {
  'programming': '/icons/categories/programming-code.svg',
  'business': '/icons/categories/business-briefcase.svg',
  'productivity': '/icons/categories/productivity-calendar.svg',
  'learning': '/icons/categories/learning-book.svg',
  'marketing': '/icons/categories/marketing-megaphone.svg',
  'content-creation': '/icons/categories/content-camera.svg',
  'data-analysis': '/icons/categories/data-stats.svg',
  'design': '/icons/categories/design-palette.svg'
}

export default async function HomePage() {
  // Calculate dynamic statistics from Supabase
  const totalTricks = await getTotalTricksCount()
  const totalCategories = await getTotalCategoriesCount()
  const allTools = await getAllTools()
  const totalTools = allTools.length
  const avgImplementationTime = await getAverageImplementationTime()
  const tricksByCategory = await getTrickCountByCategory()
  const allCategories = await getAllCategories()
  
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-white to-neutral-50 overflow-hidden">
      {/* Content */}
      <div className="relative">
        <Header />

        {/* Integrated Hero Section */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedHeroSection />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-y border-neutral-200">
          <div className="container">
            <MinimalStatsGrid 
              stats={[
                {
                  value: totalTricks,
                  label: 'KI Tricks'
                },
                {
                  value: totalCategories,
                  label: 'Kategorien'
                },
                {
                  value: totalTools,
                  label: 'KI Tools'
                },
                {
                  value: avgImplementationTime,
                  label: 'Ø Umsetzungszeit',
                  suffix: ' min'
                }
              ]}
            />
          </div>
        </section>

        {/* Categories Preview */}
        <section id="categories" className="py-16 bg-neutral-50">
          <div className="container">
            <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
              Tricks nach Kategorien
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Dynamic Category Cards */}
              {allCategories
                .filter(category => (tricksByCategory[category] || 0) > 0) // Only show categories with tricks
                .sort((a, b) => (tricksByCategory[b] || 0) - (tricksByCategory[a] || 0)) // Sort by trick count
                .slice(0, 8) // Show top 8 categories
                .map(category => (
                  <Link 
                    key={category} 
                    href={`/tricks?categories=${category}`}
                    className="relative bg-white border border-neutral-200 rounded-lg p-6 text-center hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200 group"
                  >
                    <div className="relative w-10 h-10 md:w-12 md:h-12 mx-auto mb-3">
                      {categoryIcons[category] ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={categoryIcons[category]}
                            alt={categoryLabels[category as keyof typeof categoryLabels]}
                            fill
                            className="object-contain filter opacity-60 group-hover:opacity-90 transition-opacity duration-200"
                            style={{ filter: 'brightness(0) saturate(100%) invert(17%) sepia(0%) saturate(7%) hue-rotate(358deg) brightness(95%) contrast(97%)' }}
                          />
                        </div>
                      ) : (
                        <div className="text-3xl md:text-4xl flex items-center justify-center h-full opacity-60 group-hover:opacity-90 transition-opacity">
                          {categoryEmojis[category as keyof typeof categoryEmojis]}
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold mb-1 text-neutral-900 text-sm md:text-base group-hover:text-neutral-800 transition-colors">{categoryLabels[category as keyof typeof categoryLabels]}</h4>
                    <p className="text-xs md:text-sm text-neutral-500 group-hover:text-neutral-600 transition-colors">
                      {tricksByCategory[category] || 0} {(tricksByCategory[category] || 0) === 1 ? 'Trick' : 'Tricks'}
                    </p>
                  </Link>
                ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/tricks">
                <MinimalButton
                  variant="secondary"
                  size="md"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Alle Kategorien ansehen
                </MinimalButton>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}