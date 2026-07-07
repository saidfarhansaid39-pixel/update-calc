import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gender: z.string().min(1), smoker: z.string().min(1), exerciseDays: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bmi: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'age', label: 'Current Age', type: 'number', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
    { name: 'smoker', label: 'Smoker?', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'exerciseDays', label: 'Exercise Days/Week', type: 'number', min: 0, max: 7, step: '1' },
    { name: 'bmi', label: 'BMI', type: 'number', min: 10, max: 50, step: '0.5' },
  ],
  compute: (v) => {
    const baseLifeExpectancy = v.gender === 'female' ? 80 : 75
    const ageAdj = Math.max(0, (v.age - 30) * 0.3)
    const smokerPenalty = v.smoker === 'yes' ? 10 : 0
    const exerciseBonus = v.exerciseDays * 1.2
    const bmiPenalty = v.bmi < 18.5 || v.bmi > 30 ? 3 : v.bmi > 25 ? 1 : 0
    const remaining = baseLifeExpectancy - v.age + ageAdj - smokerPenalty + exerciseBonus - bmiPenalty
    const predictedAge = v.age + Math.max(0, remaining)
    return { result: predictedAge, label: 'Predicted Life Expectancy', unit: 'years', steps: [{ label: 'Base Expectancy', value: `${baseLifeExpectancy} years (${v.gender})` }, { label: 'Adjustments', value: `${ageAdj > 0 ? `+${ageAdj} (survivor)` : ''} ${smokerPenalty > 0 ? `-${smokerPenalty} (smoker)` : ''} +${exerciseBonus} (exercise) -${bmiPenalty} (BMI)` }, { label: 'Remaining Years', value: `${Math.max(0, remaining).toFixed(1)} years` }, { label: 'Predicted Age', value: `${predictedAge.toFixed(0)} years` }] }
  },
  description: 'Estimate life expectancy based on age, gender, lifestyle factors, and BMI. Uses actuarial baseline with lifestyle adjustments.',
  formula: 'Predicted = CurrentAge + (BaseExpectancy - Age + SurvivorBonus - SmokerPenalty + ExerciseBonus - BMIPenalty)',
  interpretation: 'This is a simplified estimate, not a medical prediction. US average: 79 years (female), 73 years (male). Regular exercise adds 3-7 years. Smoking reduces by 10 years.'
}

export default calcDef
