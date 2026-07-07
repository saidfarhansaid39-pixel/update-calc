import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: fitnessAgeSchema,
  fields: [
    { name: 'age', label: 'Your Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'vo2max', label: 'Estimated VO2 Max', type: 'number', unit: 'mL/kg/min', min: 10, step: '0.1' },
  ],
  compute: (v) => {
    const avgVO2 = 45 - (v.age - 20) * 0.3
    const fitnessAge = v.age - (v.vo2max - avgVO2) / 0.3
    const rating = fitnessAge < v.age ? 'Younger than chronological age' : 'Older than chronological age'
    return {
      result: Math.max(15, Math.min(90, Math.round(fitnessAge))), label: 'Fitness Age', unit: 'years',
      steps: [
        { label: 'Chronological age', value: `${v.age} years` },
        { label: 'Your VO2 max', value: `${v.vo2max} mL/kg/min` },
        { label: `Average VO2 for ${v.age} yr`, value: `${avgVO2.toFixed(1)} mL/kg/min` },
        { label: 'Calculated fitness age', value: `${Math.max(15, Math.min(90, Math.round(fitnessAge)))} years` },
        { label: 'Assessment', value: rating },
      ]
}
  },
  description: 'Calculate your fitness age based on VO2 max compared to population averages. A fitness age lower than your chronological age indicates better cardiovascular health.'
}

export default calcDef
