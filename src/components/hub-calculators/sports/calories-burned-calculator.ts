import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: caloriesSchema,
  fields: [
    { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'met', label: 'Activity (MET)', type: 'select', options: metActivityOptions },
    { name: 'duration', label: 'Duration', type: 'number', unit: 'min', min: 1, step: '1' },
  ],
  compute: (v) => {
    const hours = v.duration / 60
    const kcal = v.weight * v.met * hours
    const kcalPerMin = v.weight * v.met / 60
    return {
      result: kcal, label: 'Calories Burned', unit: 'kcal',
      steps: [
        { label: 'Body weight', value: `${v.weight} kg` },
        { label: 'MET value', value: `${v.met} METs` },
        { label: 'Duration', value: `${v.duration} min (${hours.toFixed(2)} h)` },
        { label: 'Formula', value: `${v.weight} kg × ${v.met} MET × ${hours.toFixed(2)} h` },
        { label: 'Calories burned', value: `${kcal.toFixed(0)} kcal` },
        { label: 'Cal/min', value: `${kcalPerMin.toFixed(1)} kcal/min` },
      ]
}
  },
  description: 'Calculate calories burned during any activity using MET values from the Compendium of Physical Activities.'
}

export default calcDef
