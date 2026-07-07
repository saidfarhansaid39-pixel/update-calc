import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: oneRmSchema,
  fields: [
    { name: 'weight', label: 'Deadlift Weight', type: 'number', unit: 'kg', min: 1, step: '0.5' },
    { name: 'reps', label: 'Reps Performed', type: 'number', min: 1, max: 30, step: '1' },
  ],
  compute: (v) => {
    const epley = v.weight * (1 + v.reps / 30)
    const wathan = (100 * v.weight) / (48.8 + 53.8 * Math.exp(-0.075 * v.reps))
    const standards = epley < 140 ? 'Novice' : epley < 180 ? 'Intermediate' : epley < 230 ? 'Advanced' : epley < 280 ? 'Elite' : 'World-class'
    return {
      result: epley, label: 'Deadlift 1RM', unit: 'kg',
      steps: [
        { label: 'Deadlift weight', value: `${v.weight} kg` },
        { label: 'Reps performed', value: `${v.reps}` },
        { label: 'Epley formula', value: `${v.weight} × (1 + ${v.reps}/30) = ${epley.toFixed(1)} kg` },
        { label: 'Wathan formula', value: `${wathan.toFixed(1)} kg` },
        { label: 'Strength level', value: standards },
        { label: 'Total body strength', value: epley > 200 ? 'Elite posterior chain' : epley > 150 ? 'Strong posterior chain' : 'Developing posterior chain' },
      ]
}
  },
  description: 'Estimate your deadlift one-rep max. The deadlift is the ultimate test of total body strength, engaging the posterior chain and core.'
}

export default calcDef
