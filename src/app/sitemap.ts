import type { MetadataRoute } from 'next'
import { calculatorRegistry } from '@calcuniverse/calculator-registry'
import { getAllClusterSlugs, getClusterBySlug } from '@/lib/seo-clusters'
import { routing, isoLangs } from '@/i18n/routing'
import { getReviewedDate } from '@/lib/trust'

const siteUrl = 'https://www.calculat.online'

const BUILD_DATE = new Date()

const locales = routing.locales
const defaultLocale = routing.defaultLocale

const hubs = [
  'financial-calculators', 'health-calculators', 'math-calculators',
  'conversion-calculators', 'date-time-calculators', 'construction-calculators',
  'statistics-calculators', 'education-calculators', 'physics-calculators',
  'chemistry-calculators', 'engineering-calculators', 'everyday-calculators',
  'food-calculators', 'biology-calculators', 'ecology-calculators', 'sports-calculators',
]

import { AUTHORS } from '@/lib/authors'

const blogArticles = [
  'mortgage-tips-2026', 'bmi-limitations', 'retirement-savings-guide',
  'currency-exchange-explained', 'improving-credit-score',
  'investment-calculator-guide', 'loan-comparison-guide',
  'calorie-deficit-explained', 'conversion-cooking-guide', 'gpa-strategies',
]

const staticPages = [
  '', '/privacy', '/terms', '/contact', '/about', '/calculator-builder', '/suggest-calculator',
  '/author', ...Object.keys(AUTHORS).map(id => `/author/${id}`),
]

// Pages that only exist in English (no localized variant resolves to a real page).
const enOnlyStaticPages = [
  '/editorial-policy', '/press',
  '/blog', ...blogArticles.map(a => `/blog/${a}`),
  '/a-z-index', '/accessibility',
]

function localeUrl(locale: string, path: string): string {
  return locale === defaultLocale ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`
}

function alternatesFor(path: string, localized = true): Record<string, string> {
  const clean = path === '/' ? '' : path
  const langs: Record<string, string> = { 'x-default': `${siteUrl}${clean}` }
  if (localized) {
    for (const locale of locales) {
      langs[isoLangs[locale]] = localeUrl(locale, clean)
    }
  } else {
    langs[isoLangs[defaultLocale]] = localeUrl(defaultLocale, clean)
  }
  return langs
}

interface EntryOpts {
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
  lastModified?: Date
}

// English-only pages that are still listed per-locale in the sitemap array
// (author pages, calculator-builder, suggest-calculator) but must only be
// emitted for the default locale, since the localized variants serve English
// content. Kept here so the same set can drive sitemap filtering.
const englishOnlyStaticPages = new Set([
  '/suggest-calculator',
  '/calculator-builder',
  '/author',
  ...Object.keys(AUTHORS).map(id => `/author/${id}`),
])

function entriesForPath(locale: string, path: string, opts: EntryOpts, localized = true): MetadataRoute.Sitemap[number] {
  return {
    url: localeUrl(locale, path),
    lastModified: opts.lastModified || BUILD_DATE,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages: alternatesFor(path, localized) },
  }
}

export async function generateSitemaps() {
  return [
    ...locales.map(locale => ({ id: locale })),
    { id: 'static' as const },
  ]
}

export default async function sitemap(props: { id: string | Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  if (id === 'static') {
    return [
      ...staticPages.map(p => entriesForPath(defaultLocale, p, {
        changeFrequency: 'monthly',
        priority: p === '' ? 1.0 : 0.5,
      }, true)),
      ...enOnlyStaticPages.map(p => entriesForPath(defaultLocale, p, {
        changeFrequency: 'monthly',
        priority: 0.5,
      }, false)),
    ]
  }

  const locale = id
  const entries: MetadataRoute.Sitemap = []

  for (const p of staticPages) {
    if (locale !== defaultLocale && englishOnlyStaticPages.has(p)) continue
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

  const filteredCalcs = calculatorRegistry.filter(c => !/\d$/.test(c.slug))

  for (const calc of filteredCalcs) {
    const path = `/${calc.hubSlug}/${calc.slug}`
    const priority = calc.tier === 'tier1' ? 0.9 : calc.tier === 'tier2' ? 0.75 : 0.64
    const reviewedDate = getReviewedDate(calc.hubSlug, calc.slug)
    entries.push(entriesForPath(locale, path, {
      changeFrequency: 'monthly',
      priority,
      lastModified: new Date(reviewedDate),
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
    const match = path.match(/^\/([^/]+)\/([^/]+)$/)
    const lastModified = match ? new Date(getReviewedDate(match[1], match[2])) : BUILD_DATE
    entries.push(entriesForPath(locale, path, {
      changeFrequency: 'weekly',
      priority: 0.5,
      lastModified,
    }))
  }

  return entries
}
