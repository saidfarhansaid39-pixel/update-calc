import {
  calculatorRegistry,
  financialCalculators,
  healthCalculators,
  mathCalculators,
  conversionCalculators,
  dateTimeCalculators,
  constructionCalculators,
  statisticsCalculators,
  educationCalculators,
  physicsCalculators,
  chemistryCalculators,
  engineeringCalculators,
  everydayCalculators,
  foodCalculators,
  biologyCalculators,
  ecologyCalculators,
  sportsCalculators,
  type CalculatorEntry,
} from '@calcuniverse/calculator-registry'
import { getLocalizedCalculator, getLocalizedHubMeta as getLocalizedHubMetaFromRegistry } from '@/lib/localized-registry'

export interface HubMeta {
  slug: string
  title: string
  description: string
  calculators: CalculatorEntry[]
}

const hubMetaList: HubMeta[] = [
  { slug: 'financial-calculators', title: 'Financial Calculators', description: 'Free financial calculators for mortgage, loans, investments, retirement, taxes and more. Plan your finances with precision.', calculators: financialCalculators },
  { slug: 'health-calculators', title: 'Health & Fitness Calculators', description: 'Free health calculators for BMI, calories, body fat, pregnancy, heart rate, and more. Track your fitness journey.', calculators: healthCalculators },
  { slug: 'math-calculators', title: 'Math Calculators', description: 'Free math calculators for algebra, geometry, trigonometry, statistics, and more. Solve complex problems instantly.', calculators: mathCalculators },
  { slug: 'conversion-calculators', title: 'Conversion Calculators', description: 'Free conversion calculators for length, weight, volume, temperature, currency, and more. Convert between units instantly.', calculators: conversionCalculators },
  { slug: 'date-time-calculators', title: 'Date & Time Calculators', description: 'Free date and time calculators for duration, age, week numbers, and more. Calculate dates and times with precision.', calculators: dateTimeCalculators },
  { slug: 'construction-calculators', title: 'Construction Calculators', description: 'Free construction calculators for concrete, roofing, paint, flooring, and more. Estimate materials and costs.', calculators: constructionCalculators },
  { slug: 'statistics-calculators', title: 'Statistics Calculators', description: 'Free statistics calculators for mean, median, mode, standard deviation, and more. Analyze data with ease.', calculators: statisticsCalculators },
  { slug: 'education-calculators', title: 'Education Calculators', description: 'Free education calculators for grade, GPA, test scores, and more. Track academic performance.', calculators: educationCalculators },
  { slug: 'physics-calculators', title: 'Physics Calculators', description: 'Free physics calculators for velocity, acceleration, force, energy, and more. Solve physics problems instantly.', calculators: physicsCalculators },
  { slug: 'chemistry-calculators', title: 'Chemistry Calculators', description: 'Free chemistry calculators for molar mass, pH, dilution, stoichiometry, and more. Master chemistry concepts.', calculators: chemistryCalculators },
  { slug: 'engineering-calculators', title: 'Engineering Calculators', description: 'Free engineering calculators for beam deflection, truss analysis, moment of inertia, and more. Design with confidence.', calculators: engineeringCalculators },
  { slug: 'everyday-calculators', title: 'Everyday Calculators', description: 'Free everyday calculators for tips, discounts, fuel, electricity, and more. Simplify daily decisions.', calculators: everydayCalculators },
  { slug: 'food-calculators', title: 'Food Calculators', description: 'Free food calculators for recipes, nutrition, cooking conversions, and more. Cook and eat smarter.', calculators: foodCalculators },
  { slug: 'biology-calculators', title: 'Biology Calculators', description: 'Free biology calculators for cell division, genetics, population growth, and more. Explore life sciences.', calculators: biologyCalculators },
  { slug: 'ecology-calculators', title: 'Ecology Calculators', description: 'Free ecology calculators for carbon footprint, biodiversity, water usage, and more. Understand your environmental impact.', calculators: ecologyCalculators },
  { slug: 'sports-calculators', title: 'Sports & Fitness Calculators', description: 'Free sports calculators for pace, heart rate, VO2 max, training zones, and more. Optimize your performance.', calculators: sportsCalculators },
]

const hubMap = new Map(hubMetaList.map(h => [h.slug, h]))

export async function getHubMeta(hubSlug: string, locale?: string): Promise<HubMeta | undefined> {
  const meta = hubMap.get(hubSlug)
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

export function isValidHubSlug(slug: string): boolean {
  return hubMap.has(slug)
}

export function getAllHubSlugs(): string[] {
  return hubMetaList.map(h => h.slug)
}

export function findCalculatorInAllHubs(slug: string): CalculatorEntry | undefined {
  return calculatorRegistry.find(c => c.slug === slug)
}

export async function findCalculator(slug: string, hubSlug: string, locale?: string): Promise<CalculatorEntry | undefined> {
  if (locale && locale !== 'en') {
    return getLocalizedCalculator(slug, locale)
  }
  const meta = hubMap.get(hubSlug)
  if (!meta) return undefined
  return meta.calculators.find(c => c.slug === slug)
}
