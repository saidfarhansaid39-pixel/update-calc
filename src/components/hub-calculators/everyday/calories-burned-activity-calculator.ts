import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weightCal: z.string().min(1).refine(v => parseFloat(v) > 50, '>50'), metValue: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), durationMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'weightCal', label: 'Body Weight (lbs)', type: 'number', min: 50, step: '5' },
    { name: 'metValue', label: 'MET Value of Activity', type: 'number', min: 1, max: 20, step: '0.5' },
    { name: 'durationMin', label: 'Duration (minutes)', type: 'number', min: 1, step: '5' },
  ],
  compute: (v) => {
    const kg = v.weightCal / 2.205
    const hours = v.durationMin / 60
    const calories = v.metValue * kg * hours
    return { result: calories, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Weight (kg)', value: `${kg.toFixed(1)} kg` }, { label: 'Duration', value: `${v.durationMin} min (${hours.toFixed(2)} hrs)` }, { label: 'Calories Burned', value: `${calories.toFixed(0)} kcal` }] }
  },
  description: 'Calculate calories burned during any physical activity using the MET (Metabolic Equivalent) method. Enter weight, MET value, and duration.',
  formula: 'Calories = MET × Weight(kg) × Duration(hrs) | MET values: walking 3.0, jogging 7.0, cycling 8.0, swimming 6.0',
  interpretation: 'MET values: 1.0 = resting, 3-6 = moderate activity, 7-10 = vigorous activity, >10 = very vigorous. To lose 1 lb of fat (~3500 kcal), create a 500 kcal/day deficit.'
}

export default calcDef
