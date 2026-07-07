import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hikerWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), packWeight: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'hikerWeight', label: 'Hiker Weight (lb)', type: 'number', min: 80, step: '5' },
    { name: 'hours', label: 'Hiking Duration (hours)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'packWeight', label: 'Backpack Weight (lb)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => { const w = parseFloat(v.hikerWeight)||0; const h = parseFloat(v.hours)||0; const pk = parseFloat(v.packWeight)||0; const totalWeight = w + pk; const met = 6.0; const cal = met * 3.5 * (totalWeight / 2.205) / 200 * h * 60; return { result: cal, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Total Load', value: `${totalWeight} lb` }, { label: 'Duration', value: `${h} hrs` }, { label: 'Estimated Burn', value: `${cal.toFixed(0)} kcal` }] } },
  description: 'Estimate calories burned hiking based on body weight, pack weight, and duration. Hiking burns more than walking due to elevation changes and load.',
  formula: 'Cal = MET × 3.5 × (Weight_kg) / 200 × Minutes | MET = 6.0 (hiking, general)',
  interpretation: 'A 180 lb hiker with 20 lb pack burns ~500-700 kcal/hr. Steep terrain adds 30-50%. Gain 1,000 ft elevation per mile = ~1,000 extra kcal. Carry 2L water + snacks for hikes over 2 hours.'
}

export default calcDef
