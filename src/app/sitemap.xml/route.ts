// Sitemap generation with Supabase-backed dynamic routes
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://ai-tricks-platform.vercel.app'

  // Static pages
  const staticPages = [
    '',
    '/tricks',
    '/learn',
    '/about',
    '/kontakt',
    '/impressum',
    '/datenschutz',
  ]

  // Fetch trick detail pages from Supabase (published only)
  let trickEntries: { loc: string; lastmod?: string }[] = []
  let guideEntries: { loc: string; lastmod?: string }[] = []
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const supabase = createAdminClient()
    const { data: tricks, error } = await supabase
      .from('ki_tricks')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (error) {
      console.error('Sitemap Supabase error:', error)
    } else if (tricks) {
      trickEntries = tricks.map((t) => ({
        loc: `${baseUrl}/trick/${t.slug}`,
        lastmod: t.updated_at ? new Date(t.updated_at).toISOString() : undefined,
      }))
    }

    const { data: guides, error: guideError } = await supabase
      .from('guides')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')

    if (guideError) {
      console.error('Sitemap guide fetch error:', guideError)
    } else if (guides) {
      guideEntries = guides.map((guide) => ({
        loc: `${baseUrl}/learn/${guide.slug}`,
        lastmod: guide.updated_at
          ? new Date(guide.updated_at).toISOString()
          : guide.published_at
            ? new Date(guide.published_at).toISOString()
            : undefined,
      }))
    }
  } catch (e) {
    console.error('Sitemap generation failed to load Supabase admin client', e)
  }

  // Combine static and dynamic entries
  const allEntries: { loc: string; lastmod?: string; changefreq: string; priority: string }[] = [
    ...staticPages.map((p) => ({
      loc: `${baseUrl}${p}`,
      lastmod: new Date().toISOString(),
      changefreq: p === '' || p === '/tricks' ? 'daily' : 'weekly',
      priority: p === '' ? '1.0' : p === '/tricks' ? '0.9' : '0.6',
    })),
    ...trickEntries.map((e) => ({
      loc: e.loc,
      lastmod: e.lastmod,
      changefreq: 'weekly',
      priority: '0.7',
    })),
    ...guideEntries.map((e) => ({
      loc: e.loc,
      lastmod: e.lastmod,
      changefreq: 'weekly',
      priority: '0.75',
    })),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    allEntries.map((e) => (
      `  <url>\n` +
      `    <loc>${e.loc}</loc>\n` +
      (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : '') +
      `    <changefreq>${e.changefreq}</changefreq>\n` +
      `    <priority>${e.priority}</priority>\n` +
      `  </url>`
    )).join('\n') +
    `\n</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      // Cache for 1 hour; let CDNs revalidate
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
