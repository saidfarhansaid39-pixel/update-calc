import { calculatorRegistry, CalculatorEntry } from '@calcuniverse/calculator-registry';
import { SeoFactoryInput } from './seoFactory';

export function calculatorSeoAdapter(slug: string): SeoFactoryInput {
  const entry = calculatorRegistry.find((c: CalculatorEntry) => c.slug === slug);
  if (!entry) {
    throw new Error(`Calculator slug "${slug}" not found in calculator registry.`);
  }

  const relatedCalculators = calculatorRegistry
    .filter((c: CalculatorEntry) => c.category === entry.category && c.slug !== slug)
    .map((c: CalculatorEntry) => ({
      name: c.title,
      url: `/${c.hubSlug}/${c.slug}`,
    }));

  return {
    category: entry.category,
    type: slug,
    title: entry.title,
    description: entry.description,
    relatedCalculators
  };
}
