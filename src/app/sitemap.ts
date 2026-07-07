import type { MetadataRoute } from 'next'
import { calculatorRegistry } from '@calcuniverse/calculator-registry'
import { getAllClusterSlugs, getClusterBySlug } from '@/lib/seo-clusters'
import { routing } from '@/i18n/routing'

const siteUrl = 'https://www.jdcalc.com'

const locales = routing.locales
const defaultLocale = routing.defaultLocale

const hubs = [
  'financial-calculators', 'health-calculators', 'math-calculators',
  'conversion-calculators', 'date-time-calculators', 'construction-calculators',
  'statistics-calculators', 'education-calculators', 'physics-calculators',
  'chemistry-calculators', 'engineering-calculators', 'everyday-calculators',
  'food-calculators', 'biology-calculators', 'ecology-calculators', 'sports-calculators',
]

const staticPages = [
  '', '/privacy', '/terms', '/contact', '/about',
]

function localeUrl(path: string, locale: string): string {
  return `${siteUrl}/${locale}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push(
      ...staticPages.map(p => ({
        url: localeUrl(p, locale),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: p === '' ? 1.0 : 0.5,
      })),
      ...hubs.map(h => ({
        url: localeUrl(`/${h}`, locale),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...calculatorRegistry
        .filter(c => !/\d$/.test(c.slug))
        .map(c => ({
          url: localeUrl(`/${c.hubSlug}/${c.slug}`, locale),
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.64,
        })),
    )
  }

  if (process.env.CLUSTER_PASS === 'true' || process.env.NEXT_PUBLIC_CLUSTER_PASS === 'true') {
    try {
      for (const locale of locales) {
        for (const slug of getAllClusterSlugs()) {
          const cluster = getClusterBySlug(slug)
          if (!cluster) continue
          entries.push({
            url: localeUrl(`/${cluster.hubSlug}/${slug}`, locale),
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
          })
        }
      }
    } catch {
      // cluster not available — skip sitemap entries
    }
  }

  return entries
}
