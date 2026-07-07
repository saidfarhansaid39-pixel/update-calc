import { z } from 'zod';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export const TDEEInput = z.object({
  bmr: z.number().positive('BMR must be positive'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});
export type TDEEInput = z.infer<typeof TDEEInput>;

export interface TDEResult {
  tdee: number;
  activityMultiplier: number;
  maintenanceCalories: number;
}

/**
 * Total Daily Energy Expenditure
 * TDEE = BMR * activity multiplier
 * Source: WHO/FAO energy requirements for adults
 */
export function calculateTDEE(input: TDEEInput): TDEResult {
  const { bmr, activityLevel } = TDEEInput.parse(input);
  const multiplier = getActivityMultiplier(activityLevel);

  return {
    tdee: Math.round(bmr * multiplier),
    activityMultiplier: multiplier,
    maintenanceCalories: Math.round(bmr * multiplier),
  };
}

/**
 * Activity multipliers based on lifestyle
 * Source: WHO/FAO/UNU Expert Consultation on Human Energy Requirements
 */
export function getActivityMultiplier(level: ActivityLevel): number {
  switch (level) {
    case 'sedentary': return 1.2;
    case 'light': return 1.375;
    case 'moderate': return 1.55;
    case 'active': return 1.725;
    case 'very_active': return 1.9;
  }
}
