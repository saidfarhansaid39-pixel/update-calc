import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' },
      { name: 'pct', label: 'Fat % of Calories', type: 'select', options: [{ label: '20% (low fat)', value: '20' }, { label: '25% (moderate)', value: '25' }, { label: '30% (standard)', value: '30' }, { label: '35% (high fat)', value: '35' }, { label: '40% (keto)', value: '40' }] }
    ],
    compute: (v) => {
      const r = v.calories * (parseFloat(v.pct) / 100) / 9; return { result: r, label: 'Daily Fat', unit: 'g', steps: [{ label: 'Calories', value: v.calories + ' kcal' }, { label: 'Fat %', value: v.pct + '%' }, { label: 'Total fat (9 kcal/g)', value: r.toFixed(0) + ' g' }, { label: 'Sat fat (max 35%)', value: (r * 0.35).toFixed(0) + ' g' }] }
    },
    description: 'Daily fat requirements based on caloric intake. Fat provides 9 kcal/g and is essential for hormones and nutrient absorption.',
    example: { label: '2000 kcal, 30% fat', value: '67g fat/day' }
}

export default calcDef
