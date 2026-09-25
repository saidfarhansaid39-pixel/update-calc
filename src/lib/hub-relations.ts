// Cross-linking map of related hubs used on hub landing pages to help
// users discover adjacent categories ("Explore related hubs" section).
//
// Each hub maps to 3-4 sibling hubs that share topical overlap with it.
//
// Additionally, this module provides calculator-level related calculators
// ranked by: same subject, same category, shared tags, shared input/output
// concepts, user intent, complementary calculation, language.
//
// Note: Calculator-level ranking requires access to the calculator registry.
// The getRelatedHubs() function below returns hub-level relationships
// as before. For calculator-level relationships, use getRelatedCalculators()
// within a calculator page or hub landing page.

/**
 * Static map of related hubs — each hub maps to 3-4 sibling hubs
 * that share topical overlap. Used for the "Explore related hubs" section.
 */
export const RELATED_HUBS: Record<string, string[]> = {
  'financial-calculators': [
    'everyday-calculators',
    'math-calculators',
    'education-calculators',
    'engineering-calculators',
  ],
  'health-calculators': [
    'sports-calculators',
    'food-calculators',
    'biology-calculators',
    'everyday-calculators',
  ],
  'math-calculators': [
    'statistics-calculators',
    'engineering-calculators',
    'education-calculators',
    'physics-calculators',
  ],
  'conversion-calculators': [
    'everyday-calculators',
    'math-calculators',
    'engineering-calculators',
    'food-calculators',
  ],
  'date-time-calculators': [
    'everyday-calculators',
    'education-calculators',
    'math-calculators',
    'conversion-calculators',
  ],
  'construction-calculators': [
    'engineering-calculators',
    'everyday-calculators',
    'math-calculators',
    'conversion-calculators',
  ],
  'statistics-calculators': [
    'math-calculators',
    'education-calculators',
    'physics-calculators',
    'sports-calculators',
  ],
  'education-calculators': [
    'math-calculators',
    'statistics-calculators',
    'everyday-calculators',
    'physics-calculators',
  ],
  'physics-calculators': [
    'math-calculators',
    'engineering-calculators',
    'chemistry-calculators',
    'statistics-calculators',
  ],
  'chemistry-calculators': [
    'physics-calculators',
    'biology-calculators',
    'food-calculators',
    'education-calculators',
  ],
  'engineering-calculators': [
    'physics-calculators',
    'math-calculators',
    'construction-calculators',
    'conversion-calculators',
  ],
  'everyday-calculators': [
    'financial-calculators',
    'conversion-calculators',
    'math-calculators',
    'food-calculators',
  ],
  'food-calculators': [
    'health-calculators',
    'chemistry-calculators',
    'everyday-calculators',
    'biology-calculators',
  ],
  'biology-calculators': [
    'chemistry-calculators',
    'health-calculators',
    'ecology-calculators',
    'food-calculators',
  ],
  'ecology-calculators': [
    'biology-calculators',
    'everyday-calculators',
    'chemistry-calculators',
    'food-calculators',
  ],
  'sports-calculators': [
    'health-calculators',
    'everyday-calculators',
    'physics-calculators',
    'statistics-calculators',
  ],
}

/**
 * Returns the list of related hub slugs for a given hub slug.
 * This is the same as the static RELATED_HUBS map, provided for consistency.
 */
export function getRelatedHubs(hubSlug: string): string[] {
  return RELATED_HUBS[hubSlug] || []
}

/**
 * Ranking factors for calculator-level related calculators.
 * Higher score = more related.
 */
const rankingFactors = {
  // 1. Same subject (calculator title keywords)
  sameSubject: (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(a.toLowerCase()) ? 3 : 0,
  // 2. Same category
  sameCategory: (a: { categoryId: string }, b: { categoryId: string }) => a.categoryId === b.categoryId ? 3 : 0,
  // 3. Shared tags (calculator tags/keywords)
  sharedTags: (a: string[], b: string[]) => {
    const intersection = a.filter((x) => b.includes(x)).length
    return intersection > 0 ? intersection : 0
  },
  // 4. Shared input/output concepts
  sharedIO: (a: string[], b: string[]) => {
    const intersection = a.filter((x) => b.includes(x)).length
    return intersection > 0 ? intersection * 2 : 0
  },
  // 5. User intent (complementary calculations)
  complementary: (aTitle: string, bTitle: string) => {
    const complementaryPairs = [
      ['mortgage', 'affordability'],
      ['loan', 'calculator'],
      ['bmi', 'calorie'],
      ['bmi', 'body fat'],
      ['conversion', 'metric'],
      ['tip', 'discount'],
      ['tax', 'income'],
      ['compound', 'interest'],
      ['mortgage', 'refinance'],
      ['ideal', 'weight'],
    ]
    const aLower = aTitle.toLowerCase()
    const bLower = bTitle.toLowerCase()
    for (const [a, b] of complementaryPairs) {
      if (aLower.includes(a) && bLower.includes(b)) return 3
      if (aLower.includes(b) && bLower.includes(a)) return 3
    }
    return 0
  },
  // 6. Complementary calculation (different but related)
  complementaryCalc: (aTitle: string, bTitle: string) => {
    const complementaryPairs = [
      ['mortgage', 'interest'],
      ['loan', 'amortization'],
      ['bmi', 'body fat'],
      ['calorie', 'weight loss'],
      ['conversion', 'currency'],
      ['tip', 'total'],
      ['tax', 'deduction'],
      ['compound', 'annuity'],
    ]
    const aLower = aTitle.toLowerCase()
    const bLower = bTitle.toLowerCase()
    for (const [a, b] of complementaryPairs) {
      if (aLower.includes(a) && bLower.includes(b)) return 2
      if (aLower.includes(b) && bLower.includes(a)) return 2
    }
    return 0
  },
  // 7. Language (matching language preference)
  language: (aLocale: string, bLocale: string) => aLocale === bLocale ? 1 : 0,
}

/**
 * Get calculator-level related calculators within the same hub,
 * ranked by the seo.txt #22 ranking factors:
 * 1. Same subject
 * 2. Same category
 * 3. Shared tags
 * 4. Shared input/output concepts
 * 5. User intent (complementary calculations)
 * 6. Complementary calculation
 * 7. Language
 *
 * @param hubSlug The hub slug
 * @param calculatorSlug The current calculator slug (to exclude)
 * @param currentCalculator The current calculator entry (for category, inputs, outputs)
 * @param locale The current locale
 * @returns Array of related calculators sorted by relevance score (highest first)
 */
export async function getRelatedCalculators(
  hubSlug: string,
  calculatorSlug: string,
  currentCalculator: any,
  locale: string
): Promise<Array<{ calculator: any; score: number }>> {
  // Import registry here to avoid circular dependencies at module load time
  return import('@calcuniverse/calculator-registry').then((reg) => {
    const calculatorRegistry = reg.calculatorRegistry

    // Filter out the current calculator and calculators from different hubs
    const candidates = calculatorRegistry
      .filter((c: any) => c.hubSlug === hubSlug)
      .filter((c: any) => c.slug !== calculatorSlug)

    // If no candidates, return empty array
    if (candidates.length === 0) return []

    // Calculate relevance score for each candidate
    const scored = candidates.map((c: any) => {
      let score = 0
      const aTitle = (currentCalculator.title || '').toLowerCase()
      const bTitle = (c.title || '').toLowerCase()
      const aCategory = currentCalculator.categoryId || ''
      const bCategory = c.categoryId || ''

      // 1. Same subject (calculator title keywords)
      if (aTitle.includes(bTitle) || bTitle.includes(aTitle)) score += rankingFactors.sameSubject(aTitle, bTitle)

      // 2. Same category
      if (aCategory === bCategory) score += rankingFactors.sameCategory({ categoryId: aCategory }, { categoryId: bCategory })

      // 3. Shared tags (from calculator keywords)
      const aTags = (currentCalculator.keywords || []).map((k: string) => k.toLowerCase())
      const bTags = (c.keywords || []).map((k: string) => k.toLowerCase())
      const sharedTags = rankingFactors.sharedTags(aTags, bTags)
      score += sharedTags

      // 4. Shared input/output concepts
      const aIO = (currentCalculator.inputs || []).map((x: any) => x.label?.toLowerCase() || '').concat(
        (currentCalculator.outputs || []).map((x: any) => x.label?.toLowerCase() || '')
      )
      const bIO = (c.inputs || []).map((x: any) => x.label?.toLowerCase() || '').concat(
        (c.outputs || []).map((x: any) => x.label?.toLowerCase() || '')
      )
      const sharedIO = rankingFactors.sharedIO(aIO, bIO)
      score += sharedIO

      // 5. User intent (complementary calculations)
      score += rankingFactors.complementary(aTitle, bTitle)

      // 6. Complementary calculation
      score += rankingFactors.complementaryCalc(aTitle, bTitle)

      // 7. Language (matching locale)
      if (c.locale === locale || (c.locale === 'en' && locale !== 'en')) score += rankingFactors.language(c.locale, locale)

      return { calculator: c, score }
    })

    // Sort by score (highest first) and filter out zero-score items
    const result = scored
      .filter((s: any) => s.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 5) // Top 5 related calculators

    return result
  })
}