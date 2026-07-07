import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'mealType', label: 'Meal Type', type: 'select', options: [
        { label: 'Burger + fries + soda (avg)', value: '1100' }, { label: 'Chicken sandwich + side', value: '750' },
        { label: 'Pizza 2 slices', value: '600' }, { label: 'Tacos (3)', value: '700' },
        { label: 'Sub sandwich (12")', value: '800' }, { label: 'Chicken nuggets (6 pc) + fries', value: '650' },
        { label: 'Fish + chips', value: '900' }, { label: 'Salad with dressing', value: '450' },
        { label: 'Breakfast sandwich + hashbrown', value: '700' },
      ] },
      { name: 'count', label: 'Number of Meals', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => ({ result: v.mealType * v.count, label: 'Total Calories', unit: 'kcal', steps: [
      { label: 'Meal type', value: `${v.mealType} kcal each` },
      { label: 'Number of meals', value: `${v.count}` },
      { label: 'Total calories', value: `${v.mealType * v.count} kcal` },
      { label: 'Sodium estimate', value: `~${((v.mealType * v.count) * 0.0013).toFixed(0)} g sodium (limit: 2.3g/day)` },
    ]}),
    description: 'Estimate calories from common fast food meals. Values are averages — actual calories vary by restaurant and portion size. Most fast food meals contain 45-60% of daily recommended sodium.',
    example: { label: 'Burger meal, 1 serving', value: '~1,100 kcal' }
}

export default calcDef
