import { z } from 'zod';

export const LoanInput = z.object({
  amount: z.number().positive('Loan amount must be positive'),
  annualRate: z.number().min(0).max(100, 'Rate must be between 0 and 100'),
  termMonths: z.number().int().positive('Term must be positive'),
});
export type LoanInput = z.infer<typeof LoanInput>;

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  apr: number;
}

/**
 * Standard loan amortization formula
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Source: Federal Reserve Regulation Z (Truth in Lending)
 */
export function calculateLoan(input: LoanInput): LoanResult {
  const { amount, annualRate, termMonths } = LoanInput.parse(input);
  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = amount / termMonths;
  } else {
    const compoundFactor = Math.pow(1 + monthlyRate, termMonths);
    monthlyPayment = amount * (monthlyRate * compoundFactor) / (compoundFactor - 1);
  }

  const totalPayment = monthlyPayment * termMonths;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round((totalPayment - amount) * 100) / 100,
    apr: annualRate,
  };
}
