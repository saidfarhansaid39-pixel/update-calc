import { z } from 'zod';
import type { ActivityLevel } from './tdee';
import { getActivityMultiplier } from './tdee';
import { calculateBMR, calculateBMRHarrisBenedict, type BMRInput } from './bmr';

export const CalorieInput = z.object({
  weight: z.number().positive(),
  height: z.number().positive(),
  age: z.number().int().min(0).max(150),
  sex: z.enum(['male', 'female']),
  unit: z.enum(['metric', 'us']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['lose', 'maintain', 'gain']).default('maintain'),
});
export type CalorieInput = z.infer<typeof CalorieInput>;

export interface CalorieResult {
  maintenanceCalories: number;
  goalCalories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}

/**
 * Calorie needs based on BMR, activity level, and goal
 * Source: Academy of Nutrition and Dietetics
 */
export function calculateCalorieNeeds(input: CalorieInput): CalorieResult {
  const { weight, height, age, sex, unit, activityLevel, goal } = CalorieInput.parse(input);

  const bmrInput: BMRInput = { weight, height, age, sex, unit };
  const { bmr } = calculateBMR(bmrInput);
  const multiplier = getActivityMultiplier(activityLevel);
  const maintenance = bmr * multiplier;

  let goalCalories: number;
  switch (goal) {
    case 'lose': goalCalories = maintenance - 500; break;
    case 'gain': goalCalories = maintenance + 500; break;
    default: goalCalories = maintenance;
  }

  // Macronutrient breakdown (standard macro split)
  const proteinG = Math.round((goalCalories * 0.30) / 4);
  const fatG = Math.round((goalCalories * 0.25) / 9);
  const carbsG = Math.round((goalCalories * 0.45) / 4);

  return {
    maintenanceCalories: Math.round(maintenance),
    goalCalories: Math.round(goalCalories),
    proteinG,
    fatG,
    carbsG,
  };
}
