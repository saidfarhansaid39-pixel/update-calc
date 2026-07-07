import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'mealsPerDay', label: 'Meals Per Day', type: 'number', min: 1, step: '1' },
      { name: 'days', label: 'Days', type: 'number', min: 1, step: '1' },
      { name: 'targetCal', label: 'Calories/Meal', type: 'select', options: [{ label: 'Light (400 kcal)', value: '400' }, { label: 'Moderate (500 kcal)', value: '500' }, { label: 'Generous (600 kcal)', value: '600' }] }
    ],
    compute: (v) => {
      const tm = v.mealsPerDay * v.days; const tc = tm * v.targetCal; return { result: tm, label: 'Total Meals', unit: 'meals', steps: [{ label: 'Per day', value: v.mealsPerDay + ' x ' + v.days + ' days' }, { label: 'Total meals', value: tm + ' meals' }, { label: 'Total calories', value: tc.toFixed(0) + ' kcal' }] }
    },
    description: 'Weekly meal planning with calorie targets. Batch cooking saves time and maintains consistent nutrition.',
    example: { label: '3 meals/day, 7 days, moderate', value: '21 meals, 10,500 kcal' }
}

export default calcDef
