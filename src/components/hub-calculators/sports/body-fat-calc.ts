import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: bodyFatSchema,
  fields: [
    { name: 'neck', label: 'Neck Circumference', type: 'number', unit: 'cm', min: 20, step: '0.1' },
    { name: 'waist', label: 'Waist Circumference', type: 'number', unit: 'cm', min: 40, step: '0.1' },
    { name: 'height', label: 'Height', type: 'number', unit: 'cm', min: 50, step: '0.1' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
    { name: 'hip', label: 'Hip Circumference (female only)', type: 'number', unit: 'cm', min: 40, step: '0.1' },
  ],
  compute: (v) => {
    const isMale = v.gender === 1
    const bf = isMale
      ? 495 / (1.0324 - 0.19077 * Math.log10(v.waist - v.neck) + 0.15456 * Math.log10(v.height)) - 450
      : 495 / (1.29579 - 0.35004 * Math.log10(v.waist + (v.hip || v.waist) - v.neck) + 0.221 * Math.log10(v.height)) - 450
    const cat = bf < 14 ? 'Essential fat / Athlete' : bf < 21 ? 'Fitness' : bf < 25 ? 'Acceptable' : 'Overweight'
    return {
      result: bf, label: 'Body Fat Percentage', unit: '%',
      steps: [
        { label: 'Neck', value: `${v.neck} cm` },
        { label: 'Waist', value: `${v.waist} cm` },
        { label: 'Height', value: `${v.height} cm` },
        ...((!isMale) ? [{ label: 'Hip', value: `${v.hip || v.waist} cm` }] : []),
        { label: 'Body fat (US Navy method)', value: `${bf.toFixed(1)}%` },
        { label: 'Category', value: cat },
      ]
}
  },
  description: 'Estimate body fat percentage using the US Navy circumference method. Neck, waist, and height are required for males; hip measurement is also needed for females.'
}

export default calcDef
