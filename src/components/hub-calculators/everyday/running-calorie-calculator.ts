import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 50, '>50'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), minutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), incline: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'weight', label: 'Body Weight (lb)', type: 'number', min: 50, step: '5' },
    { name: 'distance', label: 'Distance Run (mi)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, step: '5' },
    { name: 'incline', label: 'Incline Grade (%)', type: 'number', min: 0, max: 30, step: '1' },
  ],
  compute: (v) => {
    const kg = v.weight / 2.205
    const totalMin = v.hours * 60 + v.minutes
    const met = 9.8 + v.incline * 0.7
    const hours = totalMin / 60
    const baseCal = met * kg * hours
    const distanceCal = v.distance * kg * 1.036
    const avgCal = (baseCal + distanceCal) / 2
    return { result: avgCal, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Weight', value: `${kg.toFixed(1)} kg` }, { label: 'Duration', value: `${totalMin} min` }, { label: 'Distance', value: `${v.distance} mi` }, { label: 'MET (with incline)', value: `${met.toFixed(1)}` }, { label: 'Calories Burned', value: `${avgCal.toFixed(0)} kcal` }] }
  },
  description: 'Calculate calories burned running based on weight, distance, time, and incline. Uses MET values calibrated to running intensity.',
  formula: 'Cal = MET × Weight(kg) × Hours | MET = 9.8 + Incline%×0.7 | or Miles × Weight(kg) × 1.036',
  interpretation: 'A 155-lb runner burns ~100-125 cal/mile on flat terrain. Each 1% incline adds ~10-15% more calories. Running burns 30-40% more calories per mile than walking at the same distance.'
}

export default calcDef
