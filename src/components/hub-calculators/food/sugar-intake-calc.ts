import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' },
      { name: 'limit', label: 'Guideline', type: 'select', options: [{ label: 'WHO (10% of calories)', value: '10' }, { label: 'AHA (6% — stricter)', value: '6' }, { label: 'WHO ideal (5%)', value: '5' }] }
    ],
    compute: (v) => {
      const p = parseFloat(v.limit); const r = v.calories * (p / 100) / 4; const tsp = r / 4.2; return { result: r, label: 'Max Added Sugar', unit: 'g', steps: [{ label: 'Calories', value: v.calories + ' kcal' }, { label: 'Guideline', value: p + '%' }, { label: 'Max sugar', value: r.toFixed(0) + ' g (' + tsp.toFixed(1) + ' tsp)' }] }
    },
    description: 'Recommended daily sugar limits based on health guidelines. WHO recommends added sugar below 10% of total calories (ideally 5%).',
    example: { label: '2000 kcal, WHO 10%', value: '50g sugar/day' }
}

export default calcDef
