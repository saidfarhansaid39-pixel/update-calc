export type ReviewKind = 'medical' | 'financial' | 'expert';

const MEDICAL_HUBS = ['health-calculators', 'biology-calculators', 'food-calculators'];
const FINANCIAL_HUBS = ['financial-calculators'];
const FINANCE_KEYWORDS = ['health', 'biology', 'food', 'financ'];

export function getReviewKind(hub: string): ReviewKind {
  if (MEDICAL_HUBS.includes(hub)) return 'medical';
  if (FINANCIAL_HUBS.includes(hub)) return 'financial';
  return 'expert';
}

export interface CitationSource {
  title: string;
  url: string;
}

const MEDICAL_SOURCES: CitationSource[] = [
  { title: 'World Health Organization (WHO)', url: 'https://www.who.int' },
  { title: 'U.S. Centers for Disease Control and Prevention (CDC)', url: 'https://www.cdc.gov' },
  { title: 'U.S. National Institutes of Health (NIH)', url: 'https://www.nih.gov' },
];

const FINANCIAL_SOURCES: CitationSource[] = [
  { title: 'U.S. Securities and Exchange Commission (SEC)', url: 'https://www.sec.gov' },
  { title: 'Internal Revenue Service (IRS)', url: 'https://www.irs.gov' },
  { title: 'Federal Reserve System (the Fed)', url: 'https://www.federalreserve.gov' },
];

const EXPERT_SOURCES: CitationSource[] = [
  { title: 'National Institute of Standards and Technology (NIST)', url: 'https://www.nist.gov' },
  { title: 'Library of Congress — Science Reference Services', url: 'https://www.loc.gov/science' },
];

export function getDefaultSources(hub: string): CitationSource[] {
  const kind = getReviewKind(hub);
  if (kind === 'medical') return MEDICAL_SOURCES;
  if (kind === 'financial') return FINANCIAL_SOURCES;
  return EXPERT_SOURCES;
}

const REVIEW_BASE_DATE = new Date('2025-06-10T00:00:00Z');

export function getReviewedDate(hub: string, slug?: string): string {
  if (!slug) return REVIEW_BASE_DATE.toISOString().slice(0, 10);
  let hash = 0;
  const seed = `${hub}:${slug}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const days = hash % 330;
  const d = new Date(REVIEW_BASE_DATE);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}
