import { 
  calculatorRegistry,
  type CalculatorEntry,
} from '@calcuniverse/calculator-registry'
import { ClusterVariant, ClusterFlatEntry } from './types'
import { getPatternsForCategory, fill, calcVars, ClusterTemplate } from './patterns'
import { routing } from '@/i18n/routing'

const _hubSlugCache = new Map<string, string>()
function hubSlugForCalc(calc: CalculatorEntry): string {
  let s = _hubSlugCache.get(calc.slug)
  if (!s) {
    s = calc.hubSlug
    _hubSlugCache.set(calc.slug, s)
  }
  return s
}

function generateClusterVariants(calc: CalculatorEntry): ClusterVariant[] {
  const patterns = getPatternsForCategory(calc.category)
  const vars = calcVars(calc.slug, calc.title, calc.description)
  const variants: ClusterVariant[] = []

  const alwaysSkip = ['date-calculator', 'age-calculator']
  if (alwaysSkip.includes(calc.slug)) return variants

  for (const pattern of patterns) {
    if (pattern.applicableSlugPredicate && !pattern.applicableSlugPredicate(calc.slug, calc.title)) continue

    const suffix = pattern.suffix
    const slugSuffix = suffix

    const title = fill(pattern.titleTemplate, vars)
    const description = fill(pattern.descriptionTemplate, vars)
    const h1 = fill(pattern.h1Template, vars)
    const intro = fill(pattern.introTemplate, vars)
    const searchIntent = pattern.searchIntent
    const audience = pattern.audience
    const faqs = pattern.faqTemplates.map(f => ({ q: fill(f.q, vars), a: fill(f.a, vars) }))

    variants.push({ key: suffix, title, description, h1, intro, searchIntent, audience, faqs, slugSuffix })
  }

  return variants
}

const _clusterBySlug = new Map<string, ClusterFlatEntry>()
const _variantsByPrimary = new Map<string, ClusterVariant[]>()
const _generatedHubSlugs = new Set<string>()

function shouldGenerateClusters(calc: CalculatorEntry): boolean {
  if (process.env.CLUSTER_PASS !== 'true' && process.env.NEXT_PUBLIC_CLUSTER_PASS !== 'true') return false
  // Auto-generated calculators (slug ending with digit) are slow
  if (/\d$/.test(calc.slug)) return false
  // Fast hubs: all named calculators render fine
  // Slow hubs: biology, ecology, food, health, chemistry, education
  const FAST_HUBS = new Set([
    'financial-calculators', 'math-calculators', 'conversion-calculators',
    'date-time-calculators', 'construction-calculators', 'statistics-calculators',
    'physics-calculators', 'engineering-calculators', 'sports-calculators',
    'everyday-calculators',
  ])
  if (!FAST_HUBS.has(calc.hubSlug)) return false
  // Known-slow calculators within fast hubs — cluster page SSG takes >60s
  const SLOW_CLUSTER_CALCS = new Set([
    'dividend-growth-rate', 'payout-ratio', 'retention-ratio',
  ])
  if (SLOW_CLUSTER_CALCS.has(calc.slug)) return false
  return true
}

export function generateAllClusters(): void {
  if (_generatedHubSlugs.size > 0) return

  for (const calc of calculatorRegistry) {
    if (!shouldGenerateClusters(calc)) continue

    const variants = generateClusterVariants(calc)
    _variantsByPrimary.set(calc.slug, variants)
    const hubSlug = hubSlugForCalc(calc)

    for (const v of variants) {
      const slug = `${calc.slug}-${v.slugSuffix}`
      _clusterBySlug.set(slug, { slug, primarySlug: calc.slug, hubSlug, variant: v })
    }
  }

  registryCache.forEach((val, key) => _clusterBySlug.set(key, val))
  registryCache.clear()
  _generatedHubSlugs.add('all')
}

const registryCache = new Map<string, ClusterFlatEntry>()
export function registerClusterEntry(entry: ClusterFlatEntry): void {
  if (_generatedHubSlugs.size > 0) {
    _clusterBySlug.set(entry.slug, entry)
  } else {
    registryCache.set(entry.slug, entry)
  }
}

export function getClusterBySlug(slug: string): ClusterFlatEntry | undefined {
  generateAllClusters()
  return _clusterBySlug.get(slug)
}

export function getClustersForPrimary(primarySlug: string): ClusterVariant[] {
  generateAllClusters()
  return _variantsByPrimary.get(primarySlug) || []
}

export function getAllClusterSlugs(): string[] {
  generateAllClusters()
  return Array.from(_clusterBySlug.keys())
}

export function getClusterSlugsForHub(hubSlug: string): string[] {
  generateAllClusters()
  const slugs: string[] = []
  _clusterBySlug.forEach((entry, slug) => {
    if (entry.hubSlug === hubSlug) slugs.push(slug)
  })
  return slugs
}

export function isClusterSlug(slug: string): boolean {
  generateAllClusters()
  return _clusterBySlug.has(slug)
}

export function getPrimarySlugFromCluster(clusterSlug: string): string | undefined {
  generateAllClusters()
  return _clusterBySlug.get(clusterSlug)?.primarySlug
}

export function getPrimaryCalculatorForSlug(slug: string, hubCalculators: CalculatorEntry[]): CalculatorEntry | undefined {
  generateAllClusters()
  const primary = hubCalculators.find(c => c.slug === slug)
  if (primary) return primary
  const cluster = _clusterBySlug.get(slug)
  if (cluster) return hubCalculators.find(c => c.slug === cluster.primarySlug)
  return undefined
}

export function generateClusterStaticParams(hubSlug: string): { slug: string }[] {
  return getClusterSlugsForHub(hubSlug).map(slug => ({ slug }))
}

function buildHreflangCluster(baseUrl: string) {
  const map: Record<string, string> = {}
  for (const l of routing.locales) {
    map[l] = l === routing.defaultLocale ? baseUrl : `https://www.jdcalc.com/${l}${baseUrl.replace('https://www.jdcalc.com', '')}`
  }
  return map
}

export function generateClusterMetadata(slug: string, locale: string = 'en') {
  const cluster = getClusterBySlug(slug)
  if (!cluster) return null
  const { variant, primarySlug, hubSlug } = cluster
  const url = `https://www.jdcalc.com/${hubSlug}/${slug}`
  const localeStr = locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`
  return {
    title: `${variant.title}`,
    description: variant.description,
    alternates: { canonical: url, languages: buildHreflangCluster(url) },
    openGraph: {
      title: variant.title,
      description: variant.description,
      url,
      siteName: 'JDCALC.com',
      type: 'article' as const,
      locale: localeStr,
      images: [{ url: 'https://www.jdcalc.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' as const, title: variant.title, description: variant.description },
    robots: { index: true, follow: true },
    keywords: `${variant.title}, ${variant.audience}, ${primarySlug.replace(/-/g, ' ')}`,
  }
}
