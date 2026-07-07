import { z } from 'zod';

export const AmortizationInput = z.object({
  principal: z.number().positive(),
  annualRate: z.number().min(0).max(100),
  termYears: z.number().int().positive(),
});
export type AmortizationInput = z.infer<typeof AmortizationInput>;

export interface AmortizationRow {
  payment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface AmortizationResult {
  schedule: AmortizationRow[];
  monthlyPayment: number;
  totalInterest: number;
}

/**
 * Full amortization schedule (standard actuarial method)
 */
export function calculateAmortization(input: AmortizationInput): AmortizationResult {
  const { principal, annualRate, termYears } = AmortizationInput.parse(input);
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / numPayments;
  } else {
    const compoundFactor = Math.pow(1 + monthlyRate, numPayments);
    monthlyPayment = principal * (monthlyRate * compoundFactor) / (compoundFactor - 1);
  }

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let i = 0; i < numPayments; i++) {
    const interestPaid = balance * monthlyRate;
    let principalPaid = monthlyPayment - interestPaid;

    if (i === numPayments - 1) {
      principalPaid = balance;
    }

    balance -= principalPaid;
    totalInterest += interestPaid;

    schedule.push({
      payment: Math.round(monthlyPayment * 100) / 100,
      principalPaid: Math.round(principalPaid * 100) / 100,
      interestPaid: Math.round(interestPaid * 100) / 100,
      remainingBalance: Math.round(Math.max(0, balance) * 100) / 100,
    });
  }

  return {
    schedule,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}
