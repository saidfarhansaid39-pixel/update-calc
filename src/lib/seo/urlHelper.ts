/**
 * Returns the canonical URL path for a calculator based on its registry definition.
 * Format: /{category}/{type}-calculator
 */
export function urlFor(category: string, type: string): string {
  return `/${category}/${type}-calculator`;
}

/**
 * Returns the legacy URL path for a calculator.
 */
export function legacyUrlForType(type: string): string {
  if (type === 'random-number-generator') {
    return '/random-number-generator.html';
  }
  if (type === 'length' || type === 'weight') {
    return `/${type}-converter.html`;
  }
  return `/${type}-calculator.html`;
}
