import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: caloriesDistanceSchema,
  fields: [
    { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'distance', label: 'Running Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'met', label: 'Running Speed', type: 'select', options: runMetOptions },
  ],
  compute: (v) => {
    const estTime = v.distance / (v.met * 0.85)
    const kcal = v.weight * v.met * (estTime / 60)
    return {
      result: kcal, label: 'Calories Burned Running', unit: 'kcal',
      steps: [
        { label: 'Body weight', value: `${v.weight} kg` },
        { label: 'Running distance', value: `${v.distance} km` },
        { label: 'Estimated duration', value: `${(estTime * 60).toFixed(0)} min` },
        { label: 'MET value', value: `${v.met} METs` },
        { label: 'Calories burned', value: `${kcal.toFixed(0)} kcal` },
      ]
}
  },
  description: 'Calculate calories burned during running based on distance, weight, and running speed. Running burns approximately 50-70% more calories per km than walking.'
}

export default calcDef
