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
    const brzycki = v.weight * (36 / (37 - v.reps))
    const lombardi = v.weight * Math.pow(v.reps, 0.1)
    const avg = (epley + brzycki + lombardi) / 3
    return {
      result: epley, label: 'Estimated 1RM (Epley)', unit: 'kg',
      steps: [
        { label: 'Weight used', value: `${v.weight} kg` },
        { label: 'Reps completed', value: `${v.reps}` },
        { label: 'Epley: W × (1 + R/30)', value: `${epley.toFixed(1)} kg` },
        { label: 'Brzycki: W × 36/(37-R)', value: `${brzycki.toFixed(1)} kg` },
        { label: 'Lombardi: W × R^0.1', value: `${lombardi.toFixed(1)} kg` },
        { label: 'Average estimate', value: `${avg.toFixed(1)} kg` },
      ]
}
  },
  description: 'Estimate your one-rep max using Epley, Brzycki, and Lombardi formulas. Essential for programming strength training based on your actual capacity.'
}

export default calcDef
