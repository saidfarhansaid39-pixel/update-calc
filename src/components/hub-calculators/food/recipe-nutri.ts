import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'totalCal', label: 'Total Calories', type: 'number', min: 0, step: '1' },
      { name: 'totalProtein', label: 'Total Protein (g)', type: 'number', min: 0, step: '0.1' },
      { name: 'totalFat', label: 'Total Fat (g)', type: 'number', min: 0, step: '0.1' },
      { name: 'totalCarbs', label: 'Total Carbs (g)', type: 'number', min: 0, step: '0.1' },
      { name: 'totalFiber', label: 'Total Fiber (g)', type: 'number', min: 0, step: '0.1' },
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => ({
      result: v.totalCal / v.servings,
      label: 'Nutrition Per Serving',
      unit: 'kcal',
      steps: [
        { label: 'Calories', value: `${(v.totalCal / v.servings).toFixed(0)} kcal` },
        { label: 'Protein', value: `${(v.totalProtein / v.servings).toFixed(1)} g` },
        { label: 'Fat', value: `${(v.totalFat / v.servings).toFixed(1)} g` },
        { label: 'Carbs', value: `${(v.totalCarbs / v.servings).toFixed(1)} g` },
        { label: 'Fiber', value: `${(v.totalFiber / v.servings).toFixed(1)} g` },
        { label: 'Calorie breakdown', value: `P:${((v.totalProtein / v.servings * 4 / (v.totalCal / v.servings)) * 100).toFixed(0)}% F:${((v.totalFat / v.servings * 9 / (v.totalCal / v.servings)) * 100).toFixed(0)}% C:${((v.totalCarbs / v.servings * 4 / (v.totalCal / v.servings)) * 100).toFixed(0)}%` },
      ]}),
    description: 'Complete nutritional breakdown per serving including fiber and calorie distribution. Enter total recipe values and divide by servings for accurate meal planning.',
    example: { label: '1600 kcal, 80g protein, 4 servings', value: '400 kcal, 20g protein/serving' }
}

export default calcDef
