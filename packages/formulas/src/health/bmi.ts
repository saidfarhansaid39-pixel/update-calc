import { z } from 'zod';

export const BMIInput = z.object({
  weight: z.number().positive('Weight must be positive'),
  height: z.number().positive('Height must be positive'),
  unit: z.enum(['metric', 'us']),
});
export type BMIInput = z.infer<typeof BMIInput>;

export interface BMIResult {
  bmi: number;
  category: string;
  healthyWeightRange: { min: number; max: number };
}

/**
 * BMI formula: weight(kg) / height(m)^2
 * Source: CDC/NIH standard BMI classification
 * Underweight: <18.5, Normal: 18.5-24.9, Overweight: 25-29.9, Obese: >=30
 */
export function calculateBMI(input: BMIInput): BMIResult {
  const { weight, height, unit } = BMIInput.parse(input);

  let weightKg: number;
  let heightM: number;

  if (unit === 'us') {
    weightKg = weight * 0.453592;
    heightM = height * 0.0254;
  } else {
    weightKg = weight;
    heightM = height / 100;
  }

  const bmi = weightKg / (heightM * heightM);

  let category: string;
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  const minHealthy = 18.5 * heightM * heightM;
  const maxHealthy = 24.9 * heightM * heightM;

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    healthyWeightRange: {
      min: Math.round(minHealthy * 10) / 10,
      max: Math.round(maxHealthy * 10) / 10,
    },
  };
}

/**
 * Lower-level BMI calculation (raw kg/m^2)
 */
export function rawBMI(weightKg: number, heightM: number): number {
  if (heightM <= 0) return 0;
  return weightKg / (heightM * heightM);
}

/**
 * Get detailed WHO BMI classification category
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 16) return 'Severe Thinness';
  if (bmi < 17) return 'Moderate Thinness';
  if (bmi < 18.5) return 'Mild Thinness';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III';
}
