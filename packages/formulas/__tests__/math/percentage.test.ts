import { describe, it, expect } from 'vitest';
import { calculatePercentage, percentageOf, percentageChange } from '../../src/math/percentage';

describe('percentage', () => {
  it('calculates what percent 25 is of 200', () => {
    expect(calculatePercentage(25, 200)).toBe(12.5);
  });

  it('calculates 15% of 200', () => {
    expect(percentageOf(15, 200)).toBe(30);
  });

  it('calculates percentage change from 50 to 75', () => {
    expect(percentageChange(50, 75)).toBe(50);
  });
});
