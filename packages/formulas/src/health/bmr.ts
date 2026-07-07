import { z } from 'zod';

export const BMRInput = z.object({
  weight: z.number().positive(),
  height: z.number().positive(),
  age: z.number().int().min(0).max(150),
  sex: z.enum(['male', 'female']),
  unit: z.enum(['metric', 'us']),
});
export type BMRInput = z.infer<typeof BMRInput>;

export interface BMRResult {
  bmr: number;
  formula: string;
}

/**
 * Mifflin-St Jeor equation (most accurate general-purpose BMR formula)
 * Source: Journal of the Academy of Nutrition and Dietetics
 * Male:   10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 * Female: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 */
export function calculateBMR(input: BMRInput): BMRResult {
  const { weight, height, age, sex, unit } = BMRInput.parse(input);

  let weightKg: number;
  let heightCm: number;

  if (unit === 'us') {
    weightKg = weight * 0.453592;
    heightCm = height * 2.54;
  } else {
    weightKg = weight;
    heightCm = height;
  }

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === 'male' ? base + 5 : base - 161;

  return {
    bmr: Math.round(bmr),
    formula: `Mifflin-St Jeor (${sex === 'male' ? 'Male' : 'Female'})`,
  };
}

/**
 * Harris-Benedict equation (original BMR formula)
 * Source: Proceedings of the National Academy of Sciences, 1918
 */
export function calculateBMRHarrisBenedict(input: BMRInput): BMRResult {
  const { weight, height, age, sex, unit } = BMRInput.parse(input);

  let weightKg: number;
  let heightCm: number;

  if (unit === 'us') {
    weightKg = weight * 0.453592;
    heightCm = height * 2.54;
  } else {
    weightKg = weight;
    heightCm = height;
  }

  let bmr: number;
  if (sex === 'male') {
    bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
  }

  return {
    bmr: Math.round(bmr),
    formula: `Harris-Benedict (${sex === 'male' ? 'Male' : 'Female'})`,
  };
}

/**
 * Revised Harris-Benedict equation (Roza & Shizgal, 1984)
 * Source: American Journal of Clinical Nutrition, 1984
 * Male:   88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)
 * Female: 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)
 * Note: Same formula structure as original but with updated coefficients.
 */
export function calculateBMRHarrisBenedictRevised(input: BMRInput): BMRResult {
  const { weight, height, age, sex, unit } = BMRInput.parse(input);

  let weightKg: number;
  let heightCm: number;

  if (unit === 'us') {
    weightKg = weight * 0.453592;
    heightCm = height * 2.54;
  } else {
    weightKg = weight;
    heightCm = height;
  }

  let bmr: number;
  if (sex === 'male') {
    bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
  }

  return {
    bmr: Math.round(bmr),
    formula: 'Revised Harris-Benedict (Roza & Shizgal, 1984)',
  };
}
