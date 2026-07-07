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
    const epley = v.weight * (1 + v.reps / 30); const pct = Math.max(50, Math.min(100, 100 - v.reps * 2.5))
    return { result: epley, label: 'Estimated Max', unit: 'kg', steps: [
      { label: 'Weight', value: v.weight+' kg × '+v.reps+' reps' }, { label: 'Est. 1RM', value: epley.toFixed(1)+' kg' },
      { label: 'Est. %1RM used', value: pct.toFixed(0)+'%' },
      { label: 'Training zones (90/80/70%)', value: (epley*0.9).toFixed(1)+' / '+(epley*0.8).toFixed(1)+' / '+(epley*0.7).toFixed(1)+' kg' },
    ]}
  }, description: 'Estimate your maximum lift capacity and training zones from any submaximal set.', formula: 'Epley 1RM = W × (1 + R/30)', interpretation: 'Use estimated 1RM to calculate training percentages for structured strength programming.'
}

export default calcDef
