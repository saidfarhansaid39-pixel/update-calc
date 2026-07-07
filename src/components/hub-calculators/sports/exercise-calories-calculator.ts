import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: caloriesSchema,
  fields: [
    { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'met', label: 'HIIT Intensity', type: 'select', options: hiitMetOptions },
    { name: 'duration', label: 'HIIT Duration', type: 'number', unit: 'min', min: 1, step: '1' },
  ],
  compute: (v) => {
    const hours = v.duration / 60
    const activeKcal = v.weight * v.met * hours
    const epocKcal = activeKcal * 0.14
    const totalKcal = activeKcal + epocKcal
    return {
      result: totalKcal, label: 'Total HIIT Calories', unit: 'kcal',
      steps: [
        { label: 'Body weight', value: `${v.weight} kg` },
        { label: 'HIIT MET', value: `${v.met} METs` },
        { label: 'Active duration', value: `${v.duration} min` },
        { label: 'Active calories', value: `${activeKcal.toFixed(0)} kcal` },
        { label: 'EPOC bonus (~14%)', value: `+${epocKcal.toFixed(0)} kcal` },
        { label: 'Total with EPOC', value: `${totalKcal.toFixed(0)} kcal` },
      ]
}
  },
  description: 'Calculate calories burned during HIIT workouts. HIIT burns more calories per minute than steady-state cardio due to EPOC (Excess Post-Exercise Oxygen Consumption).'
}

export default calcDef
