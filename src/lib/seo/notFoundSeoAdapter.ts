import { SeoFactoryInput } from './seoFactory';

export function notFoundSeoAdapter(): SeoFactoryInput {
  return {
    type: 'not-found',
    category: 'Utility',
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    relatedCalculators: [],
  };
}