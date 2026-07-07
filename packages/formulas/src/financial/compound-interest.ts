import { z } from 'zod';

export const CompoundInterestInput = z.object({
  principal: z.number().nonnegative(),
  annualRate: z.number().min(0).max(100),
  years: z.number().nonnegative(),
  compoundPerYear: z.number().int().positive().default(12),
  monthlyContribution: z.number().nonnegative().default(0),
});
export type CompoundInterestInput = z.infer<typeof CompoundInterestInput>;

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: { year: number; balance: number; contribution: number; interest: number }[];
}

/**
 * Compound interest formula: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
 * Source: SEC standard compound interest formula
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, annualRate, years, compoundPerYear, monthlyContribution } = CompoundInterestInput.parse(input);
  const ratePerPeriod = annualRate / 100 / compoundPerYear;
  const totalPeriods = years * compoundPerYear;

  const yearlyBreakdown: CompoundInterestResult['yearlyBreakdown'] = [];
  let balance = principal;
  let totalContributions = principal;

  for (let year = 1; year <= years; year++) {
    for (let p = 0; p < compoundPerYear; p++) {
      balance *= (1 + ratePerPeriod);
      balance += monthlyContribution;
      totalContributions += monthlyContribution;
    }
    yearlyBreakdown.push({
      year,
      balance: Math.round(balance * 100) / 100,
      contribution: Math.round(totalContributions * 100) / 100,
      interest: Math.round((balance - totalContributions) * 100) / 100,
    });
  }

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round((balance - totalContributions) * 100) / 100,
    yearlyBreakdown,
  };
}
