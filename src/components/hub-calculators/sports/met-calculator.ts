import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: caloriesSchema,
  fields: [
    { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'met', label: 'MET Value', type: 'select', options: metActivityOptions },
    { name: 'duration', label: 'Duration', type: 'number', unit: 'min', min: 1, step: '1' },
  ],
  compute: (v) => {
    const kcal = v.weight * v.met * (v.duration / 60)
    return {
      result: v.met, label: 'MET Level Used', unit: 'METs',
      steps: [
        { label: 'Body weight', value: `${v.weight} kg` },
        { label: 'MET value', value: `${v.met} METs` },
        { label: 'Duration', value: `${v.duration} min` },
        { label: 'Calories burned', value: `${kcal.toFixed(0)} kcal` },
        { label: 'Classification', value: v.met < 3 ? 'Light intensity' : v.met < 6 ? 'Moderate intensity' : 'Vigorous intensity' },
      ]
}
  },
  description: 'Calculate the metabolic equivalent (MET) of your activity and calories burned. Light < 3 METs, Moderate 3-6 METs, Vigorous > 6 METs.'
}

export default calcDef
