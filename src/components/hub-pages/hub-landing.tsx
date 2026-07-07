import React from 'react'
import { Link } from '@/lib/navigation'
import { notFound } from 'next/navigation'
import { Calculator, DollarSign, Heart, Sigma, ArrowLeftRight, Calendar, Hammer, BarChart3, GraduationCap, Atom, FlaskConical, Cog, Globe, UtensilsCrossed, Dna, TreePine, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import { getHubMeta, isValidHubSlug, getAllHubSlugs } from '@/lib/hub-data'
import { getClusterSlugsForHub, getClusterBySlug } from '@/lib/seo-clusters'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { getLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

const siteUrl = 'https://www.jdcalc.com'
const PER_PAGE = 60

const hubIcons: Record<string, React.ElementType> = {
  'financial-calculators': DollarSign,
  'health-calculators': Heart,
  'math-calculators': Sigma,
  'conversion-calculators': ArrowLeftRight,
  'date-time-calculators': Calendar,
  'construction-calculators': Hammer,
  'statistics-calculators': BarChart3,
  'education-calculators': GraduationCap,
  'physics-calculators': Atom,
  'chemistry-calculators': FlaskConical,
  'engineering-calculators': Cog,
  'everyday-calculators': Globe,
  'food-calculators': UtensilsCrossed,
  'biology-calculators': Dna,
  'ecology-calculators': TreePine,
  'sports-calculators': Trophy,
}

const calcIcons: Record<string, React.ElementType> = {
  'Mortgage': DollarSign,
  'Loan': DollarSign,
  'Investment': DollarSign,
  'BMI': Heart,
  'Calorie': Heart,
  'Body Fat': Heart,
  'Conversion': ArrowLeftRight,
}

function getCalcIcon(title: string): React.ElementType {
  for (const [key, icon] of Object.entries(calcIcons)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return Calculator
}

function getTierColor(tier: string): string {
  switch (tier) {
    case 'tier3': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    case 'tier2': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    case 'tier1': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    default: return 'bg-gray-100 text-gray-600'
  }
}

function getTierLabel(tier: string): string {
  switch (tier) {
    case 'tier3': return 'Flagship'
    case 'tier2': return 'Standard'
    case 'tier1': return 'Essential'
    default: return ''
  }
}

function buildHreflang(baseUrl: string) {
  const path = baseUrl.replace(siteUrl, '')
  const map: Record<string, string> = { 'x-default': `${siteUrl}/en${path}` }
  for (const l of routing.locales) {
    map[l] = `${siteUrl}/${l}${path}`
  }
  return map
}

export function generateHubStaticParams() {
  return getAllHubSlugs().map(hubSlug => ({ hubSlug }))
}

export async function generateHubLandingMetadata(hubSlug: string, page: number = 1) {
  const locale = await getLocale()
  const meta = await getHubMeta(hubSlug, locale)
  if (!meta) return { title: 'Calculators' }
  const totalPages = Math.ceil(meta.calculators.length / PER_PAGE)
  const url = page === 1
    ? `${siteUrl}/${locale}/${hubSlug}`
    : `${siteUrl}/${locale}/${hubSlug}?page=${page}`
  const title = page === 1 ? meta.title : `${meta.title} — Page ${page}`
  const robots = page === 1 ? { index: true, follow: true } as const : { index: false, follow: true } as const
  return {
    title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: buildHreflang(`${siteUrl}/${hubSlug}`),
    },
    openGraph: {
      title,
      description: meta.description,
      url,
      siteName: 'JDCALC.com',
      type: 'website',
      images: [{ url: 'https://www.jdcalc.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: meta.description,
    },
    robots,
  }
}

export async function HubLandingContent({ hubSlug, searchParams }: { hubSlug: string, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams
  const locale = await getLocale()
  const page = Math.max(1, parseInt(sp.page as string) || 1)
  const meta = await getHubMeta(hubSlug, locale)
  if (!meta) notFound()

  const Icon = hubIcons[hubSlug] || Calculator
  const hubTitle = meta.title
  const hubDescription = meta.description
  const calculators = meta.calculators

  const totalPages = Math.ceil(calculators.length / PER_PAGE)
  const start = (page - 1) * PER_PAGE
  const pageCalcs = calculators.slice(start, start + PER_PAGE)

  const clusterSlugs = getClusterSlugsForHub(hubSlug)
  const clusterByPrimary = new Map<string, string[]>()
  for (const cs of clusterSlugs) {
    const entry = getClusterBySlug(cs)
    if (entry) {
      const existing = clusterByPrimary.get(entry.primarySlug) || []
      existing.push(cs)
      clusterByPrimary.set(entry.primarySlug, existing)
    }
  }

  const localePrefix = `/${locale}`

  function PaginationBar() {
    if (totalPages <= 1) return null
    const pages: (number | '...')[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return (
      <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-8 mb-4">
        {page > 1 && (
          <Link
            href={page === 2 ? `${localePrefix}/${hubSlug}` : `${localePrefix}/${hubSlug}?page=${page - 1}`}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#1a3a8a] hover:text-white dark:hover:bg-[#06b6d4] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Link>
        )}
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">...</span>
          ) : (
            <Link
              key={p}
              href={p === 1 ? `${localePrefix}/${hubSlug}` : `${localePrefix}/${hubSlug}?page=${p}`}
              className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                p === page
                  ? 'bg-[#1a3a8a] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#1a3a8a] hover:text-white dark:hover:bg-[#06b6d4]'
              }`}
            >
              {p}
            </Link>
          )
        )}
        {page < totalPages && (
          <Link
            href={`${localePrefix}/${hubSlug}?page=${page + 1}`}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#1a3a8a] hover:text-white dark:hover:bg-[#06b6d4] transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </nav>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href={localePrefix || '/'} className="hover:text-[#1a3a8a]">Home</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{hubTitle}</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">{hubTitle}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">{hubDescription}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-gradient-to-br from-[#e0e7ff]/20 to-[#c7d2fe]/20 dark:from-[#0a1d4f]/20 dark:to-[#0a1d4f]/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#1a3a8a]">{calculators.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Calculators</p>
          </div>
          <div className="bg-gradient-to-br from-[#e0e7ff]/20 to-[#c7d2fe]/20 dark:from-[#0a1d4f]/20 dark:to-[#0a1d4f]/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#1a3a8a]">{calculators.filter((c: CalculatorEntry) => c.tier === 'tier3').length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Flagship Tools</p>
          </div>
          <div className="bg-gradient-to-br from-[#e0e7ff]/20 to-[#c7d2fe]/20 dark:from-[#0a1d4f]/20 dark:to-[#0a1d4f]/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#1a3a8a]">{calculators.filter((c: CalculatorEntry) => c.dataDependent).length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Live Data</p>
          </div>
          <div className="bg-gradient-to-br from-[#e0e7ff]/20 to-[#c7d2fe]/20 dark:from-[#0a1d4f]/20 dark:to-[#0a1d4f]/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#1a3a8a]">Free</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">To Use</p>
          </div>
        </div>

        {page === 1 && clusterByPrimary.size > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Popular Variations</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(clusterByPrimary.entries()).slice(0, 15).map(([primary, variants]) => {
                const calc = calculators.find(c => c.slug === primary)
                if (!calc) return null
                return variants.slice(0, 3).map(cs => {
                  const entry = getClusterBySlug(cs)
                  if (!entry) return null
                  return (
                    <Link
                      key={cs}
                      href={`${localePrefix}/${hubSlug}/${cs}`}
                      className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-gray-200 dark:border-gray-600"
                    >
                      {entry.variant.title}
                    </Link>
                  )
                })
              })}
            </div>
          </div>
        )}

        <PaginationBar />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageCalcs.map((calc: CalculatorEntry) => {
            const CalcIcon = getCalcIcon(calc.title)
            return (
              <Link
                key={calc.slug}
                href={`${localePrefix}/${hubSlug}/${calc.slug}`}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md hover:border-[#1a3a8a]/30 dark:hover:border-[#06b6d4]/30 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#1a3a8a] flex items-center justify-center flex-shrink-0">
                    <CalcIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-[#1a3a8a] transition-colors">{calc.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{calc.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getTierColor(calc.tier)}`}>
                        {getTierLabel(calc.tier)}
                      </span>
                      {calc.dataDependent && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Live Data</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <PaginationBar />
      </div>
    </div>
  )
}
