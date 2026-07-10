import React from 'react'
import { Link } from '@/lib/navigation'
import { notFound } from 'next/navigation'
import { Calculator, DollarSign, Heart, Sigma, ArrowLeftRight, Calendar, Hammer, BarChart3, GraduationCap, Atom, FlaskConical, Cog, Globe, UtensilsCrossed, Dna, TreePine, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import { getHubMeta, isValidHubSlug, getAllHubSlugs } from '@/lib/hub-data'
import { getHubTheme } from '@/lib/hub-themes'
import { getRelatedHubs } from '@/lib/hub-relations'
import { HubNav } from '@/components/hub/HubNav'
import { HubIcon } from '@/components/hub/HubIcon'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

let _clusterMod: any = null
async function cluster() {
  if (!_clusterMod) _clusterMod = await import('@/lib/seo-clusters')
  return _clusterMod
}
import { getLocale, getTranslations } from 'next-intl/server'
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
  const map: Record<string, string> = { 'x-default': `${siteUrl}${path}` }
  for (const l of routing.locales) {
    map[l] = l === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${l}${path}`
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
    ? (locale === 'en' ? `${siteUrl}/${hubSlug}` : `${siteUrl}/${locale}/${hubSlug}`)
    : (locale === 'en' ? `${siteUrl}/${hubSlug}?page=${page}` : `${siteUrl}/${locale}/${hubSlug}?page=${page}`)
  const rawTitle = page === 1 ? meta.title : `${meta.title} — Page ${page}`
  const title = rawTitle.length > 45 ? rawTitle : `${rawTitle} | JDCALC`
  const desc = meta.description.length > 155 ? meta.description.substring(0, 152).replace(/\s+\S*$/, '') + '...' : meta.description
  const robots = page === 1 ? { index: true, follow: true } as const : { index: false, follow: true } as const
  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: buildHreflang(`${siteUrl}/${hubSlug}`),
    },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: 'JDCALC',
      type: 'website',
      images: [{ url: `${siteUrl}/api/og/${hubSlug}?locale=${locale}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [`${siteUrl}/api/og/${hubSlug}?locale=${locale}`],
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

   const th = await getTranslations('hubs')
   const tc = await getTranslations('common')
  const Icon = hubIcons[hubSlug] || Calculator
  const theme = getHubTheme(hubSlug)
  const hubTitle = th(hubSlug)
  const hubDescription = meta.description
  const calculators = meta.calculators

  const totalPages = Math.ceil(calculators.length / PER_PAGE)
  const start = (page - 1) * PER_PAGE
  const pageCalcs = calculators.slice(start, start + PER_PAGE)

  const { getClusterSlugsForHub: getCS, getClusterBySlug: getCB } = await cluster()
  const clusterSlugs = getCS(hubSlug)
  const clusterByPrimary = new Map<string, string[]>()
  for (const cs of clusterSlugs) {
    const entry = getCB(cs)
    if (entry) {
      const existing = clusterByPrimary.get(entry.primarySlug) || []
      existing.push(cs)
      clusterByPrimary.set(entry.primarySlug, existing)
    }
  }

  const localePrefix = `/${locale}`

  const { calculatorRegistry } = await import('@calcuniverse/calculator-registry')
  const countByHub: Record<string, number> = {}
  for (const c of calculatorRegistry) {
    countByHub[c.hubSlug] = (countByHub[c.hubSlug] || 0) + 1
  }

  const relatedHubs = getRelatedHubs(hubSlug)
    .filter((s) => isValidHubSlug(s))
    .map((s) => ({ slug: s, name: th(s), count: countByHub[s] || 0 }))

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
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ '--hub-accent': theme.accent } as React.CSSProperties}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href={localePrefix || '/'} className="transition-colors hover:text-[color:var(--hub-accent)]">{tc('home')}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{hubTitle}</span>
        </div>

        <div className="mb-8">
          <HubNav activeSlug={hubSlug} />
        </div>

        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient} p-8 sm:p-10 mb-10 shadow-lg`}>
          <div aria-hidden className="pointer-events-none absolute -right-6 -top-8 text-[9rem] leading-none opacity-20 select-none">{theme.emoji}</div>
          <div className="relative flex items-start gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{hubTitle}</h1>
              <p className="text-base sm:text-lg text-white/90 max-w-2xl">{hubDescription}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: `rgb(${theme.accentRgb} / 0.08)`, borderColor: `rgb(${theme.accentRgb} / 0.2)` }}>
            <p className="text-2xl font-bold" style={{ color: theme.accent }}>{calculators.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Calculators</p>
          </div>
          <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: `rgb(${theme.accentRgb} / 0.08)`, borderColor: `rgb(${theme.accentRgb} / 0.2)` }}>
            <p className="text-2xl font-bold" style={{ color: theme.accent }}>{calculators.filter((c: CalculatorEntry) => c.tier === 'tier3').length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Flagship Tools</p>
          </div>
          <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: `rgb(${theme.accentRgb} / 0.08)`, borderColor: `rgb(${theme.accentRgb} / 0.2)` }}>
            <p className="text-2xl font-bold" style={{ color: theme.accent }}>{calculators.filter((c: CalculatorEntry) => c.dataDependent).length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Live Data</p>
          </div>
          <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: `rgb(${theme.accentRgb} / 0.08)`, borderColor: `rgb(${theme.accentRgb} / 0.2)` }}>
            <p className="text-2xl font-bold" style={{ color: theme.accent }}>Free</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">To Use</p>
          </div>
        </div>

        {page === 1 && clusterByPrimary.size > 0 && (
          <div className="mb-8 p-4 rounded-xl border" style={{ backgroundColor: `rgb(${theme.accentRgb} / 0.06)`, borderColor: `rgb(${theme.accentRgb} / 0.18)` }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: theme.accent }}>Popular Variations</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(clusterByPrimary.entries()).slice(0, 15).map(([primary, variants]) => {
                const calc = calculators.find(c => c.slug === primary)
                if (!calc) return null
                return variants.slice(0, 3).map(cs => {
                  const entry = getCB(cs)
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

        {calculators.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 shadow-sm text-center" role="status">
            <div aria-hidden className="text-5xl mb-4 select-none">{theme.emoji}</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{th('emptyTitle')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">{th('emptyMessage')}</p>
            <Link
              href={localePrefix || '/'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity min-h-[44px]"
            >
              {tc('goHome')}
            </Link>
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageCalcs.map((calc: CalculatorEntry) => {
            const CalcIcon = getCalcIcon(calc.title)
            return (
              <Link
                key={calc.slug}
                href={`${localePrefix}/${hubSlug}/${calc.slug}`}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-l-4 rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
                style={{ borderLeftColor: theme.accent }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center flex-shrink-0`}>
                    <CalcIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm transition-colors group-hover:text-[color:var(--hub-accent)]">{calc.title}</h3>
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
        )}

        <PaginationBar />

        {relatedHubs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Explore related hubs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedHubs.map((hub) => {
                const theme = getHubTheme(hub.slug)
                return (
                  <Link
                    key={hub.slug}
                    href={`${localePrefix}/${hub.slug}`}
                    className="group flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5 border-l-4"
                    style={{ borderLeftColor: theme.accent }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `rgb(${theme.accentRgb} / 0.12)` }}
                    >
                      <HubIcon slug={hub.slug} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-[color:var(--hub-accent)] transition-colors truncate">
                        {hub.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {hub.count} calculators
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
