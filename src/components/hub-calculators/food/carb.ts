import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' },
      { name: 'carbPct', label: 'Carb %', type: 'select', options: [
        { label: '40% (low carb)', value: '40' }, { label: '45% (moderate)', value: '45' },
        { label: '50% (standard)', value: '50' }, { label: '55% (high carb)', value: '55' },
        { label: '60% (endurance)', value: '60' },
      ] },
    ],
    compute: (v) => ({ result: v.calories * (v.carbPct / 100) / 4, label: 'Daily Carbs', unit: 'g', steps: [
      { label: 'Daily calories', value: `${v.calories} kcal` },
      { label: 'Carb percentage', value: `${v.carbPct}%` },
      { label: 'Carbs at 4 kcal/g', value: `${(v.calories * (v.carbPct / 100) / 4).toFixed(0)} g` },
    ]}),
    description: 'Carbohydrate needs calculated as a percentage of total daily calories. Carbs provide 4 calories per gram and are the body\'s primary energy source.',
    example: { label: '2000 kcal, 50% carbs', value: '250g carbs/day' }
}

export default calcDef
