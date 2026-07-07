import { describe, it, expect } from 'vitest';
import { calculateMortgage } from '../../src/financial/mortgage';

describe('calculateMortgage', () => {
  it('calculates a $300k loan at 6% for 30 years', () => {
    const result = calculateMortgage({
      principal: 300000,
      annualRate: 6,
      termYears: 30,
    });
    expect(result.monthlyPayment).toBeCloseTo(1798.65, 1);
    expect(result.totalInterest).toBeGreaterThan(347500);
    expect(result.totalInterest).toBeLessThan(347600);
  });

  it('handles zero interest rate', () => {
    const result = calculateMortgage({
      principal: 120000,
      annualRate: 0,
      termYears: 10,
    });
    expect(result.monthlyPayment).toBe(1000);
    expect(result.totalInterest).toBe(0);
  });

  it('rejects negative principal', () => {
    expect(() => calculateMortgage({
      principal: -100,
      annualRate: 5,
      termYears: 30,
    })).toThrow();
  });
});
