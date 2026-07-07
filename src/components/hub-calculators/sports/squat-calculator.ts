import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: oneRmSchema,
  fields: [
    { name: 'weight', label: 'Squat Weight', type: 'number', unit: 'kg', min: 1, step: '0.5' },
    { name: 'reps', label: 'Reps Performed', type: 'number', min: 1, max: 30, step: '1' },
  ],
  compute: (v) => {
    const epley = v.weight * (1 + v.reps / 30)
    const brzycki = v.weight * (36 / (37 - v.reps))
    const lander = (100 * v.weight) / (101.3 - 2.67123 * v.reps)
    const standards = epley < 100 ? 'Novice' : epley < 140 ? 'Intermediate' : epley < 180 ? 'Advanced' : epley < 220 ? 'Elite' : 'World-class'
    return {
      result: epley, label: 'Squat 1RM', unit: 'kg',
      steps: [
        { label: 'Squat weight', value: `${v.weight} kg` },
        { label: 'Reps performed', value: `${v.reps}` },
        { label: 'Epley (primary)', value: `${epley.toFixed(1)} kg` },
        { label: 'Brzycki', value: `${brzycki.toFixed(1)} kg` },
        { label: 'Lander', value: `${lander.toFixed(1)} kg` },
        { label: 'Strength level', value: standards },
      ]
}
  },
  description: 'Calculate your squat one-rep max. The squat is the primary lower body strength lift and key measure of overall leg power.'
}

export default calcDef
