import { Header, Footer } from '@/components/layout'
import { InteractiveStarfield } from '@/components/backgrounds'
import { GlowingButton, AnimatedStatsGrid } from '@/components/enhanced'
import { AnimatedHeroSection } from '@/components/ui/animated-hero-section'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { 
  getTotalTricksCount, 
  getTotalCategoriesCount, 
  getAllTools,
  getAverageImplementationTime,
  getTrickCountByCategory,
  getAllCategories
} from '@/lib/data/mock-data'
import { categoryLabels, categoryEmojis } from '@/lib/constants/constants'

export default function HomePage() {
  // Calculate dynamic statistics
  const totalTricks = getTotalTricksCount()
  const totalCategories = getTotalCategoriesCount()
  const totalTools = getAllTools().length
  const avgImplementationTime = getAverageImplementationTime()
  const tricksByCategory = getTrickCountByCategory()
  const allCategories = getAllCategories()
  
  return (
    <div className="min-h-screen flex flex-col relative bg-[#0A0A0F] overflow-hidden">
      {/* Interactive Starfield Background */}
      <InteractiveStarfield 
        starCount={200}
        mouseRadius={150}
        clickBurstCount={30}
        baseSpeed={0.03}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <Header />

        {/* Integrated Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedHeroSection />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-neutral-800/30 backdrop-blur-sm">
          <div className="container">
            <AnimatedStatsGrid 
              stats={[
                {
                  value: totalTricks,
                  label: 'KI Tricks',
                  suffix: ''
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
                  label: 'Durchschnittliche Umsetzungszeit',
                  suffix: 'min'
                }
              ]}
            />
          </div>
        </section>

        {/* Categories Preview */}
        <section id="categories" className="py-16">
          <div className="container">
            <h3 className="text-2xl font-bold text-neutral-100 mb-8 text-center">
              Tricks nach Kategorien
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Dynamic Category Cards */}
              {allCategories
                .filter(category => (tricksByCategory[category] || 0) > 0) // Only show categories with tricks
                .sort((a, b) => (tricksByCategory[b] || 0) - (tricksByCategory[a] || 0)) // Sort by trick count
                .slice(0, 8) // Show top 8 categories
                .map(category => (
                  <Link 
                    key={category} 
                    href={`/tricks?categories=${category}`}
                    className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-lg p-6 text-center hover:border-neutral-600 hover:bg-neutral-800/70 transition-all"
                  >
                    <div className="text-4xl mb-3">{categoryEmojis[category as keyof typeof categoryEmojis]}</div>
                    <h4 className="font-semibold mb-2 text-neutral-100">{categoryLabels[category as keyof typeof categoryLabels]}</h4>
                    <p className="text-sm text-neutral-400">
                      {tricksByCategory[category] || 0} {(tricksByCategory[category] || 0) === 1 ? 'Trick' : 'Tricks'}
                    </p>
                  </Link>
                ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/tricks">
                <GlowingButton
                  variant="secondary"
                  size="md"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Alle Kategorien ansehen
                </GlowingButton>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}