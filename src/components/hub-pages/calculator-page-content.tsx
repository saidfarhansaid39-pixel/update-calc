import { notFound } from 'next/navigation'
import { getHubMeta, findCalculator } from '@/lib/hub-data'
import { CalculatorRenderer } from '@/components/hub-calculators/CalculatorRenderer'
import { getLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { ReviewedBadge } from '@/components/trust/ReviewedBadge'
import { CitationSources } from '@/components/trust/CitationSources'
import { getDefaultSources, getReviewedDate, getReviewKind } from '@/lib/trust'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'
import { softwareAppSchema } from '@/lib/seo/software-schema'

const siteUrl = 'https://www.jdcalc.com'

const REVIEWER_NAMES: Record<string, string> = {
  medical: 'JDCALC Medical Review Team',
  financial: 'JDCALC Financial Review Team',
  expert: 'JDCALC Editorial Team',
}

// Locale-aware page URL (English at root, others prefixed with /{locale}).
function pageUrl(locale: string, path: string): string {
  return locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`
}

// Emits locale-aware BreadcrumbList + WebPage JSON-LD for a calculator page.
function CalculatorPageSchema({ hubSlug, slug, hubTitle, title, description, locale }: {
  hubSlug: string
  slug: string
  hubTitle: string
  title: string
  description: string
  locale: string
}) {
  const url = pageUrl(locale, `/${hubSlug}/${slug}`)
  const reviewed = getReviewedDate(hubSlug, slug)
  const reviewer = REVIEWER_NAMES[getReviewKind(hubSlug)] || REVIEWER_NAMES.expert
  return (
    <>
      <SchemaMarkup
        type="BreadcrumbList"
        locale={locale}
        data={breadcrumbListSchema([
          { name: 'Home', url: pageUrl(locale, '') || pageUrl(locale, '/') },
          { name: hubTitle, url: pageUrl(locale, `/${hubSlug}`) },
          { name: title, url },
        ], locale)}
      />
      <SchemaMarkup
        type="WebApplication"
        locale={locale}
        data={{
          '@type': 'WebPage',
          name: title,
          description,
          url,
          dateModified: reviewed,
          datePublished: reviewed,
          lastReviewed: reviewed,
          lastReviewedBy: { '@type': 'Organization', name: reviewer },
          reviewedBy: { '@type': 'Organization', name: reviewer },
          isPartOf: { '@type': 'WebSite', name: 'JDCALC', url: siteUrl },
          breadcrumb: { '@type': 'BreadcrumbList' },
        }}
      />
      <SchemaMarkup
        type="SoftwareApplication"
        locale={locale}
        data={softwareAppSchema({ title, description, slug }, locale, url)}
      />
    </>
  )
}

let _seoClusters: any = null
async function seoClusters() {
  if (!_seoClusters) _seoClusters = await import('@/lib/seo-clusters')
  return _seoClusters
}

function buildHreflang(baseUrl: string) {
  const path = baseUrl.replace(siteUrl, '')
  const map: Record<string, string> = { 'x-default': `${siteUrl}${path}` }
  for (const l of routing.locales) {
    map[l] = l === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${l}${path}`
  }
  return map
}

function ogLocale(l: string): string {
  return l === 'en' ? 'en_US' : l === 'zh-CN' ? 'zh_CN' : `${l}_${l.toUpperCase()}`
}

// Open Graph alternate locales — every locale except the current one.
function ogAlternateLocales(current: string): string[] {
  return routing.locales.filter(l => l !== current).map(ogLocale)
}

export async function generateCalculatorMetadata(hubSlug: string, slug: string) {
  const locale = await getLocale()

  const { isClusterSlug: _isClusterSlug, getClusterBySlug: _getClusterBySlug, generateClusterMetadata: _generateClusterMetadata } = await seoClusters()
  if (_isClusterSlug(slug)) {
    const cluster = _getClusterBySlug(slug)
    const meta = _generateClusterMetadata(slug, locale)
    if (meta) {
      if (cluster) {
        const ct = await getTranslations('clusters')
        const variantTitle = ct(`${slug}_title`) !== `${slug}_title` ? ct(`${slug}_title`) : cluster.variant.title
        const variantDesc = ct(`${slug}_description`) !== `${slug}_description` ? ct(`${slug}_description`) : cluster.variant.description
        const seoTitle = variantTitle.length > 45 ? variantTitle : `${variantTitle} | JDCALC`
        const seoDesc = variantDesc.length > 155 ? variantDesc.substring(0, 152).replace(/\s+\S*$/, '') + '...' : variantDesc
        return {
          ...meta,
          title: seoTitle,
          description: seoDesc,
          openGraph: { ...meta.openGraph, title: seoTitle, description: seoDesc },
          twitter: { ...meta.twitter, title: seoTitle, description: seoDesc },
        }
      }
      return meta
    }
  }

  const hubMeta = await getHubMeta(hubSlug, locale)
  const calc = await findCalculator(slug, hubSlug, locale) || (await import('@calcuniverse/calculator-registry')).financialCalculators.find(c => c.slug === slug) || hubMeta?.calculators.find(c => c.slug === slug)
  if (!calc) return { title: 'Calculator Not Found' }

  const title = calc.title.length > 45 ? calc.title : `${calc.title} | JDCALC`
  const description = calc.description.length > 155 ? calc.description.substring(0, 152).replace(/\s+\S*$/, '') + '...' : calc.description
  const url = locale === 'en' ? `${siteUrl}/${hubSlug}/${slug}` : `${siteUrl}/${locale}/${hubSlug}/${slug}`
  const localeStr = ogLocale(locale)
  const isAutoGenerated = /\d$/.test(slug)
  return {
    title,
    description,
    alternates: { canonical: url, languages: buildHreflang(`${siteUrl}/${hubSlug}/${slug}`) },
    openGraph: { title, description, url, siteName: 'JDCALC', type: 'website', locale: localeStr, alternateLocale: ogAlternateLocales(locale), images: [{ url: `${siteUrl}/api/og/${slug}?locale=${locale}`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${siteUrl}/api/og/${slug}?locale=${locale}`] },
    robots: isAutoGenerated ? { index: false, follow: true } : { index: true, follow: true },
    keywords: calc.keywords?.slice(0, 8).join(', ') || '',
  }
}

export async function CalculatorPageContent({ hubSlug, slug }: { hubSlug: string, slug: string }) {
  const locale = await getLocale()

  const { getClusterBySlug: _getClusterBySlug2 } = await seoClusters()
  const cluster = _getClusterBySlug2(slug)
  if (cluster) {
    const meta = await getHubMeta(hubSlug)
    if (!meta) notFound()
    const calc = meta.calculators.find(c => c.slug === cluster.primarySlug)
    if (!calc) notFound()
    const clusterCalc = { ...calc, title: cluster.variant.title, description: cluster.variant.description }
    return (
      <>
        <CalculatorPageSchema hubSlug={hubSlug} slug={slug} hubTitle={meta.title} title={clusterCalc.title} description={clusterCalc.description} locale={locale} />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">{clusterCalc.title}</h1>
        <ReviewedBadge hub={hubSlug} date={getReviewedDate(hubSlug, clusterCalc.slug)} />
        <CalculatorRenderer hubSlug={hubSlug} calculator={clusterCalc} />
        <CitationSources sources={getDefaultSources(hubSlug)} />
      </>
    )
  }

  const meta = await getHubMeta(hubSlug, locale)
  if (!meta) notFound()
  const calc = await findCalculator(slug, hubSlug, locale) || (await import('@calcuniverse/calculator-registry')).financialCalculators.find(c => c.slug === slug) || meta.calculators.find(c => c.slug === slug)
  if (!calc) notFound()

  return (
    <>
      <CalculatorPageSchema hubSlug={hubSlug} slug={slug} hubTitle={meta.title} title={calc.title} description={calc.description} locale={locale} />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">{calc.title}</h1>
      <ReviewedBadge hub={hubSlug} date={getReviewedDate(hubSlug, calc.slug)} />
      <CalculatorRenderer hubSlug={hubSlug} calculator={calc} />
      <CitationSources sources={getDefaultSources(hubSlug)} />
    </>
  )
}
