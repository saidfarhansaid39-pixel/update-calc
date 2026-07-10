import type { MetadataRoute } from 'next'
import { calculatorRegistry } from '@calcuniverse/calculator-registry'
import { getAllClusterSlugs, getClusterBySlug } from '@/lib/seo-clusters'
import { routing, isoLangs } from '@/i18n/routing'

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

function localeUrl(locale: string, path: string): string {
  return locale === defaultLocale ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`
}

function alternatesFor(path: string): Record<string, string> {
  const langs: Record<string, string> = { 'x-default': `${siteUrl}${path}` }
  for (const locale of locales) {
    langs[isoLangs[locale]] = localeUrl(locale, path)
  }
  return langs
}

interface EntryOpts {
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

function entriesForPath(locale: string, path: string, opts: EntryOpts): MetadataRoute.Sitemap[number] {
  return {
    url: localeUrl(locale, path),
    lastModified: new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages: alternatesFor(path) },
  }
}

export async function generateSitemaps() {
  return [
    ...locales.map(locale => ({ id: locale })),
    { id: 'static' as const },
  ]
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  if (id === 'static') {
    return staticPages.map(p => entriesForPath(defaultLocale, p, {
      changeFrequency: 'monthly',
      priority: p === '' ? 1.0 : 0.5,
    }))
  }

  const locale = id
  const entries: MetadataRoute.Sitemap = []

  for (const p of staticPages) {
    entries.push(entriesForPath(locale, p, {
      changeFrequency: 'monthly',
      priority: p === '' ? 1.0 : 0.5,
    }))
  }

  for (const hub of hubs) {
    entries.push(entriesForPath(locale, `/${hub}`, {
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  }

  const calcPaths = calculatorRegistry
    .filter(c => !/\d$/.test(c.slug))
    .map(c => `/${c.hubSlug}/${c.slug}`)

  for (const path of calcPaths) {
    entries.push(entriesForPath(locale, path, {
      changeFrequency: 'monthly',
      priority: 0.64,
    }))
  }

  const clusterPaths: string[] = []
  if (process.env.CLUSTER_PASS === 'true' || process.env.NEXT_PUBLIC_CLUSTER_PASS === 'true') {
    try {
      for (const slug of getAllClusterSlugs()) {
        const cluster = getClusterBySlug(slug)
        if (!cluster) continue
        clusterPaths.push(`/${cluster.hubSlug}/${slug}`)
      }
    } catch {
      // cluster registry not available — skip cluster sitemap entries
    }
  }

  for (const path of clusterPaths) {
    entries.push(entriesForPath(locale, path, {
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
  }

  return entries
}
