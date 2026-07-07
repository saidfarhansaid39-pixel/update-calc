import { SeoFactoryInput } from './seoFactory';

export function defaultSeoAdapter(input: Partial<SeoFactoryInput> = {}): SeoFactoryInput {
  return {
    type: input.type ?? 'default',
    category: input.category ?? 'General',
    title: input.title ?? 'Free Online Calculators',
    description: input.description ?? 'Collection of free online calculators for finance, health, math, and more.',
    relatedCalculators: input.relatedCalculators ?? [],
  };
}