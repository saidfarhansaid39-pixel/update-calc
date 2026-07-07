import { describe, it, expect } from 'vitest';
import { calculateBMI } from '../../src/health/bmi';

describe('calculateBMI', () => {
  it('calculates BMI for metric input (70kg, 175cm)', () => {
    const result = calculateBMI({ weight: 70, height: 175, unit: 'metric' });
    expect(result.bmi).toBeCloseTo(22.9, 1);
    expect(result.category).toBe('Normal weight');
  });

  it('calculates BMI for US input (154lbs, 69in)', () => {
    const result = calculateBMI({ weight: 154, height: 69, unit: 'us' });
    expect(result.bmi).toBeCloseTo(22.7, 1);
  });

  it('classifies underweight correctly', () => {
    const result = calculateBMI({ weight: 50, height: 180, unit: 'metric' });
    expect(result.category).toBe('Underweight');
  });
});
