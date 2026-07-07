import { z } from 'zod';

export const MortgageInput = z.object({
  principal: z.number().positive('Loan amount must be positive'),
  annualRate: z.number().min(0).max(100, 'Rate must be between 0 and 100'),
  termYears: z.number().int().positive('Term must be positive'),
});
export type MortgageInput = z.infer<typeof MortgageInput>;

export interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  payOffDate: string;
}

/**
 * Standard amortization formula (CFPB methodology)
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * where P = principal, r = monthly rate, n = total months
 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  const { principal, annualRate, termYears } = MortgageInput.parse(input);
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) {
    const monthlyPayment = principal / numPayments;
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: principal,
      totalInterest: 0,
      payOffDate: new Date(Date.now() + termYears * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
  }

  const compoundFactor = Math.pow(1 + monthlyRate, numPayments);
  const monthlyPayment = principal * (monthlyRate * compoundFactor) / (compoundFactor - 1);
  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    payOffDate: new Date(Date.now() + termYears * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
}
