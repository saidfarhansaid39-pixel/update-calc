import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), reps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sets: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), metValue: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'weight', label: 'Kettlebell Weight (lb)', type: 'number', min: 1, step: '5' },
    { name: 'reps', label: 'Reps per Set', type: 'number', min: 1, step: '5' },
    { name: 'sets', label: 'Number of Sets', type: 'number', min: 1, step: '1' },
    { name: 'metValue', label: 'MET Value', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => {
    const totalReps = v.reps * v.sets
    const totalVolume = v.weight * totalReps
    const caloriesPerRep = (v.metValue * 3.5 * 70) / 200 / 60 * 1.5
    const caloriesBurned = caloriesPerRep * totalReps
    return { result: totalVolume, label: 'Total Volume Lifted', unit: 'lb', steps: [{ label: 'Total Reps', value: `${totalReps}` }, { label: 'Total Volume', value: `${totalVolume.toFixed(0)} lb` }, { label: 'Estimated Calories', value: `${caloriesBurned.toFixed(0)} kcal` }] }
  },
  description: 'Calculate total kettlebell training volume (weight × reps) and estimate calories burned based on MET values.',
  formula: 'Volume = Weight × Reps × Sets | Calories = MET × 3.5 × Weight(kg) / 200 × Minutes',
  interpretation: 'MET values: 5.0 (light swings), 8.0 (moderate), 10.5 (vigorous). A 16kg kettlebell swing at MET 8 burns ~20 cal/min for a 70kg person.'
}

export default calcDef
