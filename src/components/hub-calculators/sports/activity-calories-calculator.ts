import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: caloriesDistanceSchema,
  fields: [
    { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'distance', label: 'Walking Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'met', label: 'Walking Pace', type: 'select', options: walkMetOptions },
  ],
  compute: (v) => {
    const walkingSpeed = v.met * 1.2
    const estHours = walkingSpeed > 0 ? v.distance / walkingSpeed : 0
    const kcal = v.weight * v.met * estHours
    const stepsEst = v.distance * 1300
    return {
      result: kcal, label: 'Walking Energy', unit: 'kcal',
      steps: [
        { label: 'Body weight', value: `${v.weight} kg` },
        { label: 'Walking distance', value: `${v.distance} km` },
        { label: 'MET level', value: `${v.met} METs` },
        { label: 'Estimated duration', value: `${(estHours * 60).toFixed(0)} min` },
        { label: 'Calories burned', value: `${kcal.toFixed(0)} kcal` },
        { label: 'Estimated steps', value: `${stepsEst.toFixed(0)} steps` },
      ]
}
  },
  description: 'Calculate calories burned during daily walking. Walking is a low-impact activity that contributes significantly to total daily energy expenditure.'
}

export default calcDef
