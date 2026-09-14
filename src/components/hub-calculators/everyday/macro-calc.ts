import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), goal: z.string().min(1), activityLevel: z.string().min(1) }),
  defaults: { weight: '170', goal: 'maintain', activityLevel: 'moderate' },
  presets: [
    { label: 'Weight Loss', values: { weight: '200', goal: 'lose', activityLevel: 'light' } },
    { label: 'Muscle Gain', values: { weight: '160', goal: 'gain', activityLevel: 'active' } },
    { label: 'Maintain Weight', values: { weight: '145', goal: 'maintain', activityLevel: 'moderate' } },
  ],
  fields: [
    { name: 'weight', label: 'Body Weight (lb)', type: 'number', min: 50, step: '10' },
    { name: 'goal', label: 'Diet Goal', type: 'select', options: [{ label: 'Lose Weight', value: 'lose' }, { label: 'Maintain', value: 'maintain' }, { label: 'Gain Muscle', value: 'gain' }] },
    { name: 'activityLevel', label: 'Activity Level', type: 'select', options: [{ label: 'Sedentary', value: 'sedentary' }, { label: 'Light (1-3 days)', value: 'light' }, { label: 'Moderate (3-5 days)', value: 'moderate' }, { label: 'Active (6-7 days)', value: 'active' }, { label: 'Very Active (2x/day)', value: 'veryActive' }] },
  ],
  compute: (v) => {
    const wt = parseFloat(v.weight)||0
    const weightKg = wt * 0.453592
    const hVal = 175; const aVal = 30
    const bmr = 10 * weightKg + 6.25 * hVal - 5 * aVal + 5
    const activityMultipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }
    const actMul = activityMultipliers[v.activityLevel as keyof typeof activityMultipliers]
    const tdee = bmr * actMul
    const goalCalories = v.goal === 'lose' ? tdee - 500 : v.goal === 'gain' ? tdee + 300 : tdee
    const protein = weightKg * 2
    const fat = weightKg * 0.8
    const carbs = (goalCalories - protein * 4 - fat * 9) / 4
    return { result: goalCalories, label: 'Daily Calories', unit: 'kcal', steps: [
      { label: '1. Weight in kg', value: `${wt} lb × 0.4536 = ${weightKg.toFixed(1)} kg` },
      { label: '2. BMR (Mifflin-St Jeor)', value: `10×${weightKg.toFixed(1)} + 6.25×175 - 5×30 + 5 = ${bmr.toFixed(0)} kcal` },
      { label: '3. Activity Multiplier', value: `${v.activityLevel} = ×${actMul}` },
      { label: '4. TDEE', value: `${bmr.toFixed(0)} × ${actMul} = ${tdee.toFixed(0)} kcal` },
      { label: '5. Goal Adjustment', value: `${v.goal === 'lose' ? '-500' : v.goal === 'gain' ? '+300' : '0'} = ${goalCalories.toFixed(0)} kcal` },
      { label: '6. Protein (2g/kg)', value: `${protein.toFixed(0)}g = ${(protein * 4).toFixed(0)} kcal (${(protein * 4 / goalCalories * 100).toFixed(0)}%)` },
      { label: '7. Fat (0.8g/kg)', value: `${fat.toFixed(0)}g = ${(fat * 9).toFixed(0)} kcal (${(fat * 9 / goalCalories * 100).toFixed(0)}%)` },
      { label: '8. Carbs (remaining)', value: `${Math.max(0, carbs).toFixed(0)}g = ${(Math.max(0, carbs) * 4).toFixed(0)} kcal (${(Math.max(0, carbs) * 4 / goalCalories * 100).toFixed(0)}%)` },
    ] ,
    extras: [
      { label: 'Protein Timing', value: 'Spread protein across 3-4 meals (20-40g each). Post-workout window is 2 hours, not 30 minutes as once thought.' },
      { label: 'Fat Types Matter', value: 'Prioritize unsaturated fats (avocado, nuts, olive oil) over saturated. Aim for 15-20g of omega-3s per week from fatty fish.' },
      { label: 'Carb Cycling', value: 'On workout days, eat more carbs. On rest days, reduce carbs and increase fat slightly. This improves insulin sensitivity.' },
      { label: 'Fiber Requirements', value: 'Aim for 25-35g fiber daily. Each gram of fiber displaces ~2-3g of digestible carbs. Good sources: vegetables, legumes, whole grains.' },
      { label: 'Weight Loss Realistic Pace', value: '1-2 lb per week is sustainable = 500-1000 kcal deficit daily. Faster loss leads to muscle loss and metabolic adaptation.' },
      { label: 'Muscle Gain Surplus', value: 'A 300-500 kcal surplus is sufficient for muscle gain. Beyond that, the excess is stored as fat. Expect 0.5-2 lb muscle gain per month.' },
      { label: 'Hydration', value: 'Drink 35-50 ml per kg of body weight daily. Water is critical for metabolism — even 2% dehydration drops performance by 10-15%.' },
      { label: 'Tracking Accuracy', value: 'Use a food scale for accuracy. Studies show people underestimate portions by 30-50%. Track for at least 2 weeks to establish baseline.' },
    ]}
  },
  description: 'Calculate recommended daily macronutrients (protein, fat, carbs) based on weight, diet goal, and activity level. Uses Mifflin-St Jeor BMR with activity multipliers.',
  formula: 'TDEE = (10×kg + 6.25×ht - 5×age + 5) × Activity. Goal = TDEE ± 500(lose)/300(gain). Protein = 2g/kg, Fat = 0.8g/kg, Carbs = (remaining kcal)/4.',
  interpretation: 'Protein: 1.6-2.2 g/kg for muscle gain, 1.2-1.6 g/kg for maintenance. Fat: minimum 0.5 g/kg for hormone function. Carbs fill remaining calories. Adjust based on weekly weight trends — if not moving as expected, adjust calories by 10%.'
}

export default calcDef
