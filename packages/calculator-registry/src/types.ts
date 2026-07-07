import { z } from 'zod';

export const CalculatorTier = z.enum(['tier1', 'tier2', 'tier3']);
export type CalculatorTier = z.infer<typeof CalculatorTier>;

export const CategoryHub = z.enum([
  'financial',
  'health',
  'math',
  'construction',
  'engineering',
  'date-time',
  'everyday',
  'conversion',
  'statistics',
  'education',
  'physics',
  'chemistry',
  'food',
  'biology',
  'ecology',
  'sports',
]);
export type CategoryHub = z.infer<typeof CategoryHub>;

export const CalculatorEntrySchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: CategoryHub,
  tier: CalculatorTier,
  hubSlug: z.string(),
  hubName: z.string(),
  keywords: z.array(z.string()),
  formulaSource: z.string().optional(),
  dataDependent: z.boolean().optional(),
  dataRefreshCadence: z.string().optional(),
});
export interface CalculatorEntry {
  slug: string;
  title: string;
  description: string;
  category: 'financial' | 'health' | 'math' | 'conversion' | 'date-time' | 'construction' | 'statistics' | 'education' | 'physics' | 'chemistry' | 'engineering' | 'everyday' | 'food' | 'biology' | 'ecology' | 'sports';
  tier: 'tier1' | 'tier2' | 'tier3';
  hubSlug: string;
  hubName: string;
  keywords: string[];
  formulaSource?: string;
  dataDependent?: boolean;
  dataRefreshCadence?: string;
}

export const HubInfoSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string(),
  calculatorCount: z.number(),
});
export type HubInfo = z.infer<typeof HubInfoSchema>;
