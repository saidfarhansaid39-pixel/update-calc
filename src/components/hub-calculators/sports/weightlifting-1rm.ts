import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: oneRmSchema,
  fields: [
    { name: 'weight', label: 'Lift Weight', type: 'number', unit: 'kg', min: 1, step: '0.5' },
    { name: 'reps', label: 'Reps Performed', type: 'number', min: 1, max: 30, step: '1' },
  ],
  compute: (v) => {
    const epley = v.weight * (1 + v.reps / 30); const brzycki = v.weight * (36 / (37 - v.reps)); const avg = (epley + brzycki) / 2
    return { result: epley, label: 'Estimated 1RM (Epley)', unit: 'kg', steps: [
      { label: 'Weight used', value: v.weight+' kg' }, { label: 'Reps', value: ''+v.reps },
      { label: 'Epley', value: epley.toFixed(1)+' kg' }, { label: 'Brzycki', value: brzycki.toFixed(1)+' kg' },
      { label: 'Average', value: avg.toFixed(1)+' kg' },
    ]}
  }, description: 'Estimate one-rep max from submaximal sets using Epley and Brzycki formulas. Accurate for reps up to 10.', formula: 'Epley: W × (1 + R/30); Brzycki: W × 36/(37-R)', interpretation: 'The Epley formula is most accurate for reps ≤ 10. For higher reps, use multiple formulas and average.'
}

export default calcDef
