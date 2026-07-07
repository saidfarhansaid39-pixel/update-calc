import { z } from 'zod';

export const USNavyBodyFatInput = z.object({
  waistCm: z.number().positive(),
  neckCm: z.number().positive(),
  heightCm: z.number().positive(),
  hipCm: z.number().nonnegative().default(0),
  sex: z.enum(['male', 'female']),
});
export type USNavyBodyFatInput = z.infer<typeof USNavyBodyFatInput>;

export interface BodyFatResult {
  bodyFatPercent: number;
  method: string;
}

/**
 * US Navy Circumference Method for body fat estimation
 * Source: US Navy Body Composition Assessment
 * Male:   495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
 * Female: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
 */
export function calculateUSNavyBodyFat(input: USNavyBodyFatInput): BodyFatResult {
  const { waistCm, neckCm, heightCm, hipCm, sex } = USNavyBodyFatInput.parse(input);

  let bodyFat: number;
  if (sex === 'male') {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
  }

  return {
    bodyFatPercent: Math.round(bodyFat * 10) / 10,
    method: 'US Navy',
  };
}

export const IdealWeightInput = z.object({
  heightCm: z.number().positive(),
  sex: z.enum(['male', 'female']),
});
export type IdealWeightInput = z.infer<typeof IdealWeightInput>;

export interface IdealWeightResult {
  bmiRange: { min: number; max: number };
  robinson: number;
  miller: number;
  devine: number;
  hamwi: number;
}

/**
 * Ideal weight calculations using multiple established formulas
 * Source: Robinson, Miller, Devine, Hamwi formulas
 */
export function calculateIdealWeight(input: IdealWeightInput): IdealWeightResult {
  const { heightCm, sex } = IdealWeightInput.parse(input);
  const heightInches = heightCm / 2.54;
  const inchesOver5Ft = heightInches > 60 ? heightInches - 60 : 0;
  const heightM = heightCm / 100;

  const bmiMin = Math.round(18.5 * (heightM * heightM) * 10) / 10;
  const bmiMax = Math.round(25 * (heightM * heightM) * 10) / 10;

  let robinson: number, miller: number, devine: number, hamwi: number;
  if (sex === 'male') {
    robinson = 52 + 1.9 * inchesOver5Ft;
    miller = 56.2 + 1.41 * inchesOver5Ft;
    devine = 50.0 + 2.3 * inchesOver5Ft;
    hamwi = 48.0 + 2.7 * inchesOver5Ft;
  } else {
    robinson = 49 + 1.7 * inchesOver5Ft;
    miller = 53.1 + 1.36 * inchesOver5Ft;
    devine = 45.5 + 2.3 * inchesOver5Ft;
    hamwi = 45.5 + 2.2 * inchesOver5Ft;
  }

  return {
    bmiRange: { min: bmiMin, max: bmiMax },
    robinson: Math.round(robinson * 10) / 10,
    miller: Math.round(miller * 10) / 10,
    devine: Math.round(devine * 10) / 10,
    hamwi: Math.round(hamwi * 10) / 10,
  };
}
