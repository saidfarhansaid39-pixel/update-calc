import { getLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Search, Compass, Calculator } from 'lucide-react'
import { Link } from '@/lib/navigation'
import { SearchBar } from '@/components/SearchBar'
import { getAllHubSlugs, getHubMeta } from '@/lib/hub-data'
import { getHubTheme } from '@/lib/hub-themes'
import { getLocalizedCalculator } from '@/lib/localized-registry'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('notFound')
  const title = t('title')
  const description = t('description')
  const path = '/not-found'
  const canonical = locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`
  const languages: Record<string, string> = { 'x-default': `${siteUrl}${path}` }
  for (const l of routing.locales) {
    languages[l] = l === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${l}${path}`
  }
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, siteName: 'JDCALC', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function NotFoundPage() {
  const locale = await getLocale()
  const t = await getTranslations('notFound')
  const th = await getTranslations('hubs')
  const localePrefix = locale === 'en' ? '' : `/${locale}`

  const hubSlugs = getAllHubSlugs()

  const popular: { title: string; href: string }[] = []
  for (const hubSlug of hubSlugs) {
    const meta = await getHubMeta(hubSlug, locale)
    if (!meta) continue
    const flagships = meta.calculators
      .filter((c: CalculatorEntry) => c.tier === 'tier3')
      .slice(0, 2)
    for (const calc of flagships) {
      const loc = await getLocalizedCalculator(calc.slug, locale)
      popular.push({
        title: (loc?.title || calc.title),
        href: `${localePrefix}/${hubSlug}/${calc.slug}`,
      })
    }
    if (popular.length >= 8) break
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="text-7xl sm:text-8xl font-black text-gray-200 dark:text-gray-700 leading-none select-none">
            404
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('heading')}
          </h1>
          <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
            {t('message')}
          </p>
        </div>

        <div className="mt-8">
          <SearchBar />
        </div>

        {popular.length > 0 && (
          <section className="mt-10" aria-labelledby="popular-heading">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-primary" aria-hidden="true" />
              <h2 id="popular-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('popularTitle')}
              </h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {popular.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="block px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition-colors"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10" aria-labelledby="hubs-heading">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id="hubs-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('browseHubTitle')}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {hubSlugs.map((hubSlug) => {
              const theme = getHubTheme(hubSlug)
              return (
                <Link
                  key={hubSlug}
                  href={`${localePrefix}/${hubSlug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition-colors"
                >
                  <span aria-hidden="true">{theme.emoji}</span>
                  {th(hubSlug)}
                </Link>
              )
            })}
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            href={localePrefix || '/'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
