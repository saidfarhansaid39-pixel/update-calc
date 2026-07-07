import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: tdeeSchema,
  fields: [
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'height', label: 'Height', type: 'number', unit: 'cm', min: 50, step: '0.1' },
    { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
    { name: 'activity', label: 'Activity Level', type: 'select', options: activityLevelOptions },
  ],
  compute: (v) => {
    const isMale = v.gender === 1
    const bmr = isMale ? 10 * v.weight + 6.25 * v.height - 5 * v.age + 5 : 10 * v.weight + 6.25 * v.height - 5 * v.age - 161
    const tdee = bmr * v.activity
    return {
      result: tdee, label: 'Total Daily Energy Expenditure', unit: 'kcal/day',
      steps: [
        { label: 'BMR (Mifflin-St Jeor)', value: `${bmr.toFixed(0)} kcal/day` },
        { label: 'Activity multiplier', value: `${v.activity.toFixed(1)}×` },
        { label: 'TDEE', value: `${tdee.toFixed(0)} kcal/day` },
        { label: 'Maintenance calories', value: `${tdee.toFixed(0)} kcal/day` },
        { label: 'Weight loss (-500 kcal)', value: `${(tdee - 500).toFixed(0)} kcal/day` },
        { label: 'Weight gain (+300 kcal)', value: `${(tdee + 300).toFixed(0)} kcal/day` },
      ]
}
  },
  description: 'Calculate Total Daily Energy Expenditure (TDEE) using Mifflin-St Jeor BMR × activity factor. Essential for weight management, muscle gain, and fat loss planning.'
}

export default calcDef
