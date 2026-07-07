import { calculatorRegistry, type CalculatorEntry } from '@calcuniverse/calculator-registry'

type OverrideEntry = { title?: string; description?: string }
type OverrideMap = Record<string, OverrideEntry>

const overrideCache = new Map<string, OverrideMap>()

async function getOverrideMap(locale: string): Promise<OverrideMap> {
  if (locale === 'en') return {}
  if (overrideCache.has(locale)) return overrideCache.get(locale)!
  try {
    const mod = await import(`@/i18n/calculator-overrides/${locale}.json`)
    overrideCache.set(locale, mod as OverrideMap)
    return mod as OverrideMap
  } catch {
    return {}
  }
}

export async function getLocalizedCalculator(slug: string, locale: string): Promise<CalculatorEntry | undefined> {
  const original = calculatorRegistry.find(c => c.slug === slug)
  if (!original) return undefined
  if (locale === 'en') return original
  const overrideMap = await getOverrideMap(locale)
  const override = overrideMap[slug]
  if (!override) return original
  return {
    ...original,
    title: override.title ?? original.title,
    description: override.description ?? original.description,
  }
}

export async function getLocalizedCalculatorsByHub(hubSlug: string, locale: string): Promise<CalculatorEntry[]> {
  const prefix = hubSlug.replace('-calculators', '')
  const hubCalculators = calculatorRegistry.filter(c => c.category === prefix || c.hubSlug === hubSlug)
  const results = await Promise.all(
    hubCalculators.map(async calc => {
      const localized = await getLocalizedCalculator(calc.slug, locale)
      return localized ?? calc
    })
  )
  return results
}

export async function getLocalizedHubMeta(hubSlug: string, locale: string): Promise<{
  slug: string
  title: string
  description: string
  calculators: CalculatorEntry[]
}> {
  const calculators = await getLocalizedCalculatorsByHub(hubSlug, locale)
  const meta = calculatorRegistry.find(c => c.hubSlug === hubSlug)
  const title = hubSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    slug: hubSlug,
    title: title,
    description: meta?.description ?? '',
    calculators,
  }
}
