import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servingSize', label: 'Serving Size', type: 'number', unit: 'g', min: 1, step: '1' },
      { name: 'calories', label: 'Calories per Serving', type: 'number', min: 0, step: '1' },
      { name: 'totalFat', label: 'Total Fat (g)', type: 'number', min: 0, step: '0.1' },
      { name: 'sodium', label: 'Sodium (mg)', type: 'number', min: 0, step: '1' },
      { name: 'totalCarbs', label: 'Total Carbs (g)', type: 'number', min: 0, step: '0.1' },
      { name: 'protein', label: 'Protein (g)', type: 'number', min: 0, step: '0.1' },
    ],
    compute: (v) => ({
      result: v.calories,
      label: 'Nutrition Facts (per serving)',
      unit: 'kcal',
      steps: [
        { label: 'Serving size', value: `${v.servingSize} g` },
        { label: 'Calories', value: `${v.calories} kcal` },
        { label: 'Total Fat', value: `${v.totalFat} g (${(v.totalFat / 65 * 100).toFixed(0)}% DV)` },
        { label: 'Sodium', value: `${v.sodium} mg (${(v.sodium / 2300 * 100).toFixed(0)}% DV)` },
        { label: 'Total Carbs', value: `${v.totalCarbs} g (${(v.totalCarbs / 300 * 100).toFixed(0)}% DV)` },
        { label: 'Protein', value: `${v.protein} g (${(v.protein / 50 * 100).toFixed(0)}% DV)` },
      ]}),
    description: 'Generate a nutrition facts label-style breakdown for any food item. Daily Values (DV) are based on a 2,000 kcal diet — your needs may vary.',
    example: { label: '100g serving, 250 kcal', value: '250 kcal, 20g protein, 8g fat per serving' }
}

export default calcDef
