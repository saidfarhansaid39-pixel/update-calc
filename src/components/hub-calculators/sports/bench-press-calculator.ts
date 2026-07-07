import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: oneRmSchema,
  fields: [
    { name: 'weight', label: 'Bench Press Weight', type: 'number', unit: 'kg', min: 1, step: '0.5' },
    { name: 'reps', label: 'Reps Performed', type: 'number', min: 1, max: 30, step: '1' },
  ],
  compute: (v) => {
    const epley = v.weight * (1 + v.reps / 30)
    const brzycki = v.weight * (36 / (37 - v.reps))
    const ratio = epley / 75
    const standards = epley < 60 ? 'Novice' : epley < 80 ? 'Intermediate' : epley < 100 ? 'Advanced' : epley < 140 ? 'Elite' : 'World-class'
    return {
      result: epley, label: 'Bench Press 1RM', unit: 'kg',
      steps: [
        { label: 'Bench press weight', value: `${v.weight} kg` },
        { label: 'Reps performed', value: `${v.reps}` },
        { label: 'Epley formula', value: `${v.weight} × (1 + ${v.reps}/30) = ${epley.toFixed(1)} kg` },
        { label: 'Brzycki formula', value: `${brzycki.toFixed(1)} kg` },
        { label: 'Strength level', value: standards },
        { label: 'Bodyweight ratio', value: `${ratio.toFixed(2)}× bodyweight` },
      ]
}
  },
  description: 'Estimate your bench press one-rep max. The bench press is the gold standard upper body strength exercise measured in powerlifting.'
}

export default calcDef
