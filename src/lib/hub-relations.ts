// Cross-linking map of related hubs used on hub landing pages to help
// users discover adjacent categories ("Explore related hubs" section).
//
// Each hub maps to 3-4 sibling hubs that share topical overlap with it.

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

export function getRelatedHubs(hubSlug: string): string[] {
  return RELATED_HUBS[hubSlug] || []
}
