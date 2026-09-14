import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gender: z.string().min(1), smoker: z.string().min(1), exerciseDays: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bmi: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  defaults: { age: '40', gender: 'male', smoker: 'no', exerciseDays: '3', bmi: '24' },
  presets: [
    { label: 'Healthy Non-Smoker', values: { age: '35', gender: 'female', smoker: 'no', exerciseDays: '5', bmi: '22' } },
    { label: 'Smoker Sedentary', values: { age: '50', gender: 'male', smoker: 'yes', exerciseDays: '0', bmi: '28' } },
    { label: 'Senior Active', values: { age: '65', gender: 'female', smoker: 'no', exerciseDays: '4', bmi: '24' } },
  ],
  fields: [
    { name: 'age', label: 'Current Age', type: 'number', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
    { name: 'smoker', label: 'Smoker?', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'exerciseDays', label: 'Exercise Days/Week', type: 'number', min: 0, max: 7, step: '1' },
    { name: 'bmi', label: 'BMI', type: 'number', min: 10, max: 50, step: '0.5' },
  ],
  compute: (v) => {
    const A = parseFloat(v.age)||0; const E = parseFloat(v.exerciseDays)||0; const B = parseFloat(v.bmi)||0
    const baseLifeExpectancy = v.gender === 'female' ? 80 : 75
    const ageAdj = Math.max(0, (A - 30) * 0.3)
    const smokerPenalty = v.smoker === 'yes' ? 10 : 0
    const exerciseBonus = E * 1.2
    const bmiPenalty = B < 18.5 || B > 30 ? 3 : B > 25 ? 1 : 0
    const remaining = baseLifeExpectancy - A + ageAdj - smokerPenalty + exerciseBonus - bmiPenalty
    const predictedAge = A + Math.max(0, remaining)
    return { result: predictedAge, label: 'Predicted Life Expectancy', unit: 'years', steps: [
      { label: '1. Base Expectancy', value: `${baseLifeExpectancy} years (US average for ${v.gender})` },
      { label: '2. Survivor Bonus', value: `Age ${A}: +${ageAdj.toFixed(1)} yr (surviving past 30 adds longevity credit)` },
      { label: '3. Smoking Penalty', value: v.smoker === 'yes' ? '-10 yr (reduces life by a decade on average)' : '0 yr (non-smoker)' },
      { label: '4. Exercise Benefit', value: `${E} days/wk × 1.2 = +${exerciseBonus.toFixed(1)} yr` },
      { label: '5. BMI Adjustment', value: `BMI ${B}: ${bmiPenalty > 0 ? `-${bmiPenalty} yr (${B < 18.5 ? 'underweight' : B > 30 ? 'obese' : 'overweight'})` : '0 yr (healthy range)'}` },
      { label: '6. Net Adjustment', value: `${ageAdj > 0 ? `+${ageAdj.toFixed(1)}` : '0'} ${smokerPenalty > 0 ? `- ${smokerPenalty}` : ''} ${exerciseBonus > 0 ? `+ ${exerciseBonus.toFixed(1)}` : ''} - ${bmiPenalty} = ${(ageAdj - smokerPenalty + exerciseBonus - bmiPenalty).toFixed(1)} yr` },
      { label: '7. Remaining Years', value: `${Math.max(0, remaining).toFixed(1)} years` },
      { label: '8. Predicted Age', value: `${predictedAge.toFixed(0)} years old` },
    ] ,
    extras: [
      { label: 'CDC Data Source', value: 'US life expectancy at birth: 77.5 years (2022 CDC). Female: 80.2, Male: 74.8. This calculator uses these baselines with lifestyle adjustments.' },
      { label: 'Smoking Impact', value: 'Smoking reduces life expectancy by 10-12 years on average. Quitting at age 40 adds 9 years. Quitting at 60 adds 3 years. It\'s never too late.' },
      { label: 'Exercise Guidelines', value: '150 min moderate or 75 min vigorous per week (WHO). Each hour of exercise adds ~2 hours of life expectancy. Active people live 3-7 years longer.' },
      { label: 'Healthy BMI Range', value: 'BMI 18.5-24.9 optimal. BMI 25-29.9: modest risk. BMI 30+: reduces life by 2-4 years. Extreme obesity (BMI 40+): reduces by 8-10 years.' },
      { label: 'Diet & Longevity', value: 'Mediterranean diet (olive oil, fish, vegetables, whole grains) reduces mortality 20-30%. Blue Zones (Okinawa, Sardinia) share plant-based, low-calorie diets.' },
      { label: 'Social Connection', value: 'Strong social ties add 5-7 years to life expectancy. Loneliness is as harmful as smoking 15 cigarettes per day (Surgeon General, 2023).' },
      { label: 'Sleep Duration', value: '7-9 hours is optimal. Sleeping <6 hours increases mortality risk by 12%. Sleeping >9 hours may indicate underlying issues.' },
      { label: 'Medical Care Access', value: 'Regular checkups and screenings add 3-5 years. Preventative care (flu shots, blood pressure, cholesterol, cancer screenings) saves 100,000+ lives/year in the US.' },
    ]}
  },
  description: 'Estimate life expectancy based on age, gender, lifestyle factors, and BMI. Uses actuarial baseline (CDC 2022) with lifestyle adjustments for smoking, exercise, and BMI health risks.',
  formula: 'Predicted Age = Age + (BaseExpectancy − Age + SurvivorBonus − SmokerPenalty + ExerciseBonus − BMIPenalty). Base: 80 (female) or 75 (male). Survivor: +0.3yr/yr over 30. Smoker: −10yr. Exercise: +1.2yr/day. BMI: −3yr if <18.5 or >30, −1yr if 25-30.',
  interpretation: 'This is a simplified estimate based on actuarial data, not a medical prediction. US average life expectancy (2022): 79 years (female), 73 years (male). Regular exercise adds 3-7 years. Smoking reduces by 10 years. Healthy BMI (18.5-24.9) and strong social connections independently add 5-7 years. Consult your doctor for personalized health assessment.'
}

export default calcDef
