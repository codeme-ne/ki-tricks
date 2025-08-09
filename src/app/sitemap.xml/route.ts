import { mockTricks } from '@/lib/data/mock-data'

export async function GET() {
  const baseUrl = 'https://ai-tricks-platform.vercel.app'
  
  // Statische Seiten
  const staticPages = [
    '',
    '/tricks',
    '/claude-code',
    '/about',
    '/kontakt',
    '/impressum',
    '/datenschutz'
  ]
  
  // Dynamische Trick-Seiten
  const trickPages = mockTricks.map(trick => `/trick/${trick.slug}`)
  
  // Alle Seiten kombinieren
  const allPages = [...staticPages, ...trickPages]
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '' || page === '/tricks' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page === '/tricks' ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}