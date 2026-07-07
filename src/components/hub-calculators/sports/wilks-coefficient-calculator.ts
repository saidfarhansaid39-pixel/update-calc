import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: wilksSchema,
  fields: [
    { name: 'bodyweight', label: 'Bodyweight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'total', label: 'Total Lifted', type: 'number', unit: 'kg', min: 1, step: '0.5' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender === 1
    const a = isMale ? [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8] : [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8]
    const x = v.bodyweight
    const coeff = 500 / (a.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0))
    const wilks = v.total * coeff
    return {
      result: wilks, label: 'Wilks Score', unit: '',
      steps: [
        { label: 'Bodyweight', value: `${v.bodyweight} kg` },
        { label: 'Total lifted', value: `${v.total} kg` },
        { label: 'Wilks coefficient', value: `${coeff.toFixed(4)}` },
        { label: 'Wilks score', value: `${wilks.toFixed(2)}` },
        { label: 'Classification', value: wilks > 400 ? 'Elite' : wilks > 350 ? 'Master' : wilks > 300 ? 'Advanced' : wilks > 250 ? 'Intermediate' : 'Novice' },
      ]
}
  },
  description: 'Calculate the Wilks Coefficient for powerlifting comparison. The Wilks formula normalizes strength across bodyweights to determine the strongest lifter.'
}

export default calcDef
