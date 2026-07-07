import { z } from 'zod';

export const InvestmentInput = z.object({
  initialInvestment: z.number().nonnegative(),
  annualReturn: z.number().min(0).max(100),
  years: z.number().nonnegative(),
  monthlyContribution: z.number().nonnegative().default(0),
});
export type InvestmentInput = z.infer<typeof InvestmentInput>;

export interface InvestmentResult {
  futureValue: number;
  totalContributions: number;
  totalEarnings: number;
  roi: number;
}

/**
 * Future value of an investment with compound growth
 * FV = PV(1 + r)^t + PMT * [((1 + r)^t - 1) / r]
 * Source: SEC standard investment return formula
 */
export function calculateInvestment(input: InvestmentInput): InvestmentResult {
  const { initialInvestment, annualReturn, years, monthlyContribution } = InvestmentInput.parse(input);
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;

  let futureValue = initialInvestment;
  let totalContributions = initialInvestment;

  for (let m = 0; m < totalMonths; m++) {
    futureValue *= (1 + monthlyRate);
    futureValue += monthlyContribution;
    totalContributions += monthlyContribution;
  }

  const totalEarnings = futureValue - totalContributions;
  const roi = totalContributions > 0 ? (totalEarnings / totalContributions) * 100 : 0;

  return {
    futureValue: Math.round(futureValue * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    roi: Math.round(roi * 100) / 100,
  };
}
