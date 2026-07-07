import { keywordMap } from './keywordMap';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface RelatedCalculator {
  name: string;
  url: string;
}

// In-memory cache for memoization
const cache = new Map<string, any>();

function getCacheKey(fnName: string, ...args: any[]): string {
  return `${fnName}:${JSON.stringify(args)}`;
}

export function buildCanonicalUrl(category: string, type: string): string {
  const key = getCacheKey('buildCanonicalUrl', category, type);
  if (cache.has(key)) return cache.get(key);

  const url = `https://www.jdcalc.com/${category}/${type}-calculator`;
  cache.set(key, url);
  return url;
}

export function generateKeywords(category: string, type: string): string[] {
  const key = getCacheKey('generateKeywords', category, type);
  if (cache.has(key)) return cache.get(key);

  const baseKeywords = [type, `${type} calculator`, `${type} converter`, category, `${category} calculator`];
  const synonyms = keywordMap[type] || [];
  
  // Deduplicate and filter out empty strings
  const keywords = Array.from(new Set([...baseKeywords, ...synonyms])).filter(Boolean);
  cache.set(key, keywords);
  return keywords;
}

export function buildBreadcrumbs(category: string, type: string, title: string): BreadcrumbItem[] {
  const key = getCacheKey('buildBreadcrumbs', category, type, title);
  if (cache.has(key)) return cache.get(key);

  let categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  let categoryUrl = '/';

  if (category === 'finance') {
    categoryLabel = 'Financial';
  } else if (category === 'health') {
    categoryLabel = 'Fitness & Health';
  } else if (category === 'conversion') {
    categoryLabel = 'Conversion';
  } else if (category === 'math') {
    categoryLabel = 'Math';
  } else {
    categoryLabel = 'Other';
  }

  const items: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    { name: categoryLabel, url: categoryUrl },
    { name: title, url: `/${category}/${type}-calculator` },
  ];
  cache.set(key, items);
  return items;
}

interface CalculatorEntryLike {
  category: string;
  type: string;
  title: string;
}

export function getRelatedCalculators(
  category: string,
  type: string,
  registry: CalculatorEntryLike[]
): RelatedCalculator[] {
  const key = getCacheKey('getRelatedCalculators', category, type, registry.length);
  if (cache.has(key)) return cache.get(key);

  const related = registry
    .filter((entry) => entry.category === category && entry.type !== type)
    .map((entry) => ({
      name: entry.title,
      url: `/${entry.category}/${entry.type}-calculator`,
    }));

  cache.set(key, related);
  return related;
}

export function buildJsonLd(options: {
  title: string;
  description: string;
  canonicalUrl: string;
  category: string;
}) {
  const { title, description, canonicalUrl, category } = options;
  const key = getCacheKey('buildJsonLd', title, description, canonicalUrl, category);
  if (cache.has(key)) return cache.get(key);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': title,
    'description': description,
    'url': canonicalUrl,
    'applicationCategory': `${category}Calculator`,
    'operatingSystem': 'All',
    'browserRequirements': 'Requires JavaScript. Requires HTML5.',
  };

  cache.set(key, schema);
  return schema;
}
