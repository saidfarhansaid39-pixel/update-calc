import { describe, it, expect } from 'vitest';
import { convert } from '../units';

// The unit library exposes a single `convert(value, from, to)` engine driven
// by per-dimension factor maps. These wrappers document the intent of the
// temperature / length conversions tested below.
function convertLength(value: number, from: string, to: string): number {
  return convert(value, from, to);
}
function convertTemp(value: number, from: string, to: string): number {
  return convert(value, from, to);
}

describe('unit conversion factor maps', () => {
  it('1 mile = 1609.34 m', () => {
    expect(convertLength(1, 'mi', 'm')).toBeCloseTo(1609.34, 2);
  });

  it('1 kg = 2.20462 lb', () => {
    expect(convertLength(1, 'kg', 'lb')).toBeCloseTo(2.20462, 4);
  });

  it('0°C = 32°F', () => {
    expect(convertTemp(0, 'C', 'F')).toBeCloseTo(32, 5);
  });

  it('100°C = 212°F', () => {
    expect(convertTemp(100, 'C', 'F')).toBeCloseTo(212, 5);
  });

  it('1 km = 1000 m (length dimension)', () => {
    expect(convertLength(1, 'km', 'm')).toBeCloseTo(1000, 5);
  });

  it('round-trip length conversion is stable', () => {
    const v = convertLength(5, 'ft', 'in');
    expect(convertLength(v, 'in', 'ft')).toBeCloseTo(5, 5);
  });
});
