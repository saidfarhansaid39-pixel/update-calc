import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.string().min(1), minPerLb: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), restTime: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'weight', label: 'Weight', type: 'number', min: 0.5, step: '0.5' },
    { name: 'unit', label: 'Weight Unit', type: 'select', options: [{ label: 'Pounds (lb)', value: 'lb' }, { label: 'Kilograms (kg)', value: 'kg' }] },
    { name: 'minPerLb', label: 'Minutes per lb/kg', type: 'number', min: 1, step: '1' },
    { name: 'restTime', label: 'Rest Time (min)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => {
    const w = v.weight * (v.unit === 'kg' ? 2.205 : 1)
    const cookMin = w * v.minPerLb
    const totalMin = cookMin + v.restTime
    return { result: totalMin, label: 'Total Time', unit: 'min', steps: [{ label: 'Cook Time', value: `${cookMin.toFixed(1)} min` }, { label: 'Rest Time', value: `${v.restTime} min` }, { label: 'Total Time', value: `${totalMin.toFixed(1)} min` }] }
  },
  description: 'Calculate cooking time for meat, poultry, and roasted dishes based on weight and minutes per pound. Includes rest time for proper carry-over cooking.',
  formula: 'Total Time = Weight(lb) × Min/lb + Rest Time',
  interpretation: 'Rest time is critical: roasts continue cooking (carry-over) by 5-10°F after removal. Always use a meat thermometer for safety: poultry 165°F, beef 145°F, pork 145°F.'
}

export default calcDef
