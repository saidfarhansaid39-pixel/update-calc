import { describe, it, expect } from 'vitest';
import { computeBmi } from '../bmi';

describe('BMI formula', () => {
  it('computes BMI for weight 70kg, height 1.75m → 22.86', () => {
    expect(computeBmi(70, 1.75)).toBeCloseTo(22.86, 2);
  });

  it('returns a rounded numeric BMI', () => {
    // 70 / (1.75^2) = 22.8571...
    expect(Number(computeBmi(70, 1.75).toFixed(2))).toBe(22.86);
  });

  it('throws on height 0', () => {
    expect(() => computeBmi(70, 0)).toThrow();
  });

  it('throws on negative height', () => {
    expect(() => computeBmi(70, -1)).toThrow();
  });

  it('throws on non-finite height', () => {
    expect(() => computeBmi(70, NaN)).toThrow();
  });
});
