import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' },
      { name: 'fatPct', label: 'Fat %', type: 'select', options: [
        { label: '20% (low fat)', value: '20' }, { label: '25% (moderate)', value: '25' },
        { label: '30% (standard)', value: '30' }, { label: '35% (high fat)', value: '35' },
        { label: '40% (keto)', value: '40' },
      ] },
    ],
    compute: (v) => ({ result: v.calories * (v.fatPct / 100) / 9, label: 'Daily Fat', unit: 'g', steps: [
      { label: 'Daily calories', value: `${v.calories} kcal` },
      { label: 'Fat percentage', value: `${v.fatPct}%` },
      { label: 'Fat at 9 kcal/g', value: `${(v.calories * (v.fatPct / 100) / 9).toFixed(0)} g` },
    ]}),
    description: 'Dietary fat needs as a percentage of total daily calories. Fat provides 9 kcal/g and is essential for hormone production and nutrient absorption.',
    example: { label: '2000 kcal, 30% fat', value: '67g fat/day' }
}

export default calcDef
