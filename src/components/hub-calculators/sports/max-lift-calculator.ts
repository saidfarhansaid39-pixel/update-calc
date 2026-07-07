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
    const epley = v.weight * (1 + v.reps / 30)
    const pctRM = 100 - v.reps * 2.5
    return {
      result: epley, label: 'Estimated Max Lift', unit: 'kg',
      steps: [
        { label: 'Weight lifted', value: `${v.weight} kg` },
        { label: 'Reps performed', value: `${v.reps}` },
        { label: 'Estimated 1RM', value: `${epley.toFixed(1)} kg` },
        { label: '~% of 1RM used', value: `${Math.max(50, Math.min(100, pctRM)).toFixed(0)}% 1RM` },
        { label: 'Training zone', value: epley > 0 ? `90%: ${(epley * 0.9).toFixed(1)} kg · 80%: ${(epley * 0.8).toFixed(1)} kg · 70%: ${(epley * 0.7).toFixed(1)} kg` : '—' },
      ]
}
  },
  description: 'Calculate your theoretical maximum lift from any submaximal set. The Epley formula is most accurate for reps up to 10.'
}

export default calcDef
