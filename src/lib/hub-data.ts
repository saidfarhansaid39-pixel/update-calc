import { getLocalizedCalculator, getLocalizedHubMeta as getLocalizedHubMetaFromRegistry } from '@/lib/localized-registry'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

export interface HubMeta {
  slug: string
  title: string
  description: string
  calculators: CalculatorEntry[]
}

const HUB_SLUGS = [
  'financial-calculators',
  'health-calculators',
  'math-calculators',
  'conversion-calculators',
  'date-time-calculators',
  'construction-calculators',
  'statistics-calculators',
  'education-calculators',
  'physics-calculators',
  'chemistry-calculators',
  'engineering-calculators',
  'everyday-calculators',
  'food-calculators',
  'biology-calculators',
  'ecology-calculators',
  'sports-calculators',
] as const

const HUB_DEFS: Omit<HubMeta, 'calculators'>[] = [
  { slug: 'financial-calculators', title: 'Financial Calculators', description: 'Free financial calculators for mortgage, loans, investments, retirement, taxes and more. Plan your finances with precision.' },
  { slug: 'health-calculators', title: 'Health & Fitness Calculators', description: 'Free health calculators for BMI, calories, body fat, pregnancy, heart rate, and more. Track your fitness journey.' },
  { slug: 'math-calculators', title: 'Math Calculators', description: 'Free math calculators for algebra, geometry, trigonometry, statistics, and more. Solve complex problems instantly.' },
  { slug: 'conversion-calculators', title: 'Conversion Calculators', description: 'Free conversion calculators for length, weight, volume, temperature, currency, and more. Convert between units instantly.' },
  { slug: 'date-time-calculators', title: 'Date & Time Calculators', description: 'Free date and time calculators for duration, age, week numbers, and more. Calculate dates and times with precision.' },
  { slug: 'construction-calculators', title: 'Construction Calculators', description: 'Free construction calculators for concrete, roofing, paint, flooring, and more. Estimate materials and costs.' },
  { slug: 'statistics-calculators', title: 'Statistics Calculators', description: 'Free statistics calculators for mean, median, mode, standard deviation, and more. Analyze data with ease.' },
  { slug: 'education-calculators', title: 'Education Calculators', description: 'Free education calculators for grade, GPA, test scores, and more. Track academic performance.' },
  { slug: 'physics-calculators', title: 'Physics Calculators', description: 'Free physics calculators for velocity, acceleration, force, energy, and more. Solve physics problems instantly.' },
  { slug: 'chemistry-calculators', title: 'Chemistry Calculators', description: 'Free chemistry calculators for molar mass, pH, dilution, stoichiometry, and more. Master chemistry concepts.' },
  { slug: 'engineering-calculators', title: 'Engineering Calculators', description: 'Free engineering calculators for beam deflection, truss analysis, moment of inertia, and more. Design with confidence.' },
  { slug: 'everyday-calculators', title: 'Everyday Calculators', description: 'Free everyday calculators for tips, discounts, fuel, electricity, and more. Simplify daily decisions.' },
  { slug: 'food-calculators', title: 'Food Calculators', description: 'Free food calculators for recipes, nutrition, cooking conversions, and more. Cook and eat smarter.' },
  { slug: 'biology-calculators', title: 'Biology Calculators', description: 'Free biology calculators for cell division, genetics, population growth, and more. Explore life sciences.' },
  { slug: 'ecology-calculators', title: 'Ecology Calculators', description: 'Free ecology calculators for carbon footprint, biodiversity, water usage, and more. Understand your environmental impact.' },
  { slug: 'sports-calculators', title: 'Sports & Fitness Calculators', description: 'Free sports calculators for pace, heart rate, VO2 max, training zones, and more. Optimize your performance.' },
]

const REGISTRY_KEY_MAP: Record<string, string> = {
  'financial-calculators': 'financialCalculators',
  'health-calculators': 'healthCalculators',
  'math-calculators': 'mathCalculators',
  'conversion-calculators': 'conversionCalculators',
  'date-time-calculators': 'dateTimeCalculators',
  'construction-calculators': 'constructionCalculators',
  'statistics-calculators': 'statisticsCalculators',
  'education-calculators': 'educationCalculators',
  'physics-calculators': 'physicsCalculators',
  'chemistry-calculators': 'chemistryCalculators',
  'engineering-calculators': 'engineeringCalculators',
  'everyday-calculators': 'everydayCalculators',
  'food-calculators': 'foodCalculators',
  'biology-calculators': 'biologyCalculators',
  'ecology-calculators': 'ecologyCalculators',
  'sports-calculators': 'sportsCalculators',
}

let _hubMap: Map<string, HubMeta> | null = null

async function ensureHubMap(): Promise<Map<string, HubMeta>> {
  if (!_hubMap) {
    const reg = await import('@calcuniverse/calculator-registry') as any
    _hubMap = new Map()
    for (const def of HUB_DEFS) {
      const key = REGISTRY_KEY_MAP[def.slug]
      _hubMap.set(def.slug, { ...def, calculators: reg[key] })
    }
  }
  return _hubMap
}

let _calculatorRegistry: CalculatorEntry[] | null = null

async function ensureCalculatorRegistry(): Promise<CalculatorEntry[]> {
  if (!_calculatorRegistry) {
    const reg = await import('@calcuniverse/calculator-registry') as any
    _calculatorRegistry = reg.calculatorRegistry
  }
  return _calculatorRegistry!
}

export function isValidHubSlug(slug: string): boolean {
  return HUB_SLUGS.includes(slug as any)
}

export function getAllHubSlugs(): string[] {
  return [...HUB_SLUGS]
}

export async function getHubMeta(hubSlug: string, locale?: string): Promise<HubMeta | undefined> {
  const map = await ensureHubMap()
  const meta = map.get(hubSlug)
  if (!meta) return undefined
  if (locale && locale !== 'en') {
    const localized = await getLocalizedHubMetaFromRegistry(hubSlug, locale)
    return {
      ...meta,
      title: localized.title,
      description: localized.description,
      calculators: localized.calculators,
    }
  }
  return meta
}

export async function findCalculatorInAllHubs(slug: string): Promise<CalculatorEntry | undefined> {
  const registry = await ensureCalculatorRegistry()
  return registry.find(c => c.slug === slug)
}

export async function findCalculator(slug: string, hubSlug: string, locale?: string): Promise<CalculatorEntry | undefined> {
  if (locale && locale !== 'en') {
    return getLocalizedCalculator(slug, locale)
  }
  const map = await ensureHubMap()
  const meta = map.get(hubSlug)
  if (!meta) return undefined
  const found = meta.calculators.find(c => c.slug === slug)
  if (found) return found
  const registry = await ensureCalculatorRegistry()
  return registry.find(c => c.slug === slug)
}
