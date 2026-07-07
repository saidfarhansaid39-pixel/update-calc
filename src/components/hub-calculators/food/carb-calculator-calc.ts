import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' },
      { name: 'pct', label: 'Carb % of Calories', type: 'select', options: [{ label: '40% (low carb)', value: '40' }, { label: '45% (moderate)', value: '45' }, { label: '50% (standard)', value: '50' }, { label: '55% (high carb)', value: '55' }, { label: '60% (endurance)', value: '60' }] }
    ],
    compute: (v) => {
      const carbCal = v.calories * (parseFloat(v.pct) / 100); const r = carbCal / 4; return { result: r, label: 'Total Carbs', unit: 'g', steps: [{ label: 'Calories', value: v.calories + ' kcal' }, { label: 'Carb %', value: v.pct + '%' }, { label: 'Total carbs (4 kcal/g)', value: r.toFixed(0) + ' g' }] }
    },
    description: 'Daily carbohydrate needs as percentage of total calories. Carbs provide 4 kcal/g and are the body\'s primary fuel source.',
    example: { label: '2000 kcal, 50%', value: '250g carbs/day' }
}

export default calcDef
