/**
 * Body Mass Index calculation helper.
 *
 * BMI = weight (kg) / height (m)^2.
 * Throws on non-positive or non-finite inputs so callers can surface a
 * friendly validation error instead of producing NaN/Infinity.
 */
export function computeBmi(weightKg: number, heightM: number): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error('Weight must be a positive number');
  }
  if (!Number.isFinite(heightM) || heightM <= 0) {
    throw new Error('Height must be a positive number');
  }
  return weightKg / (heightM * heightM);
}

export default computeBmi;
