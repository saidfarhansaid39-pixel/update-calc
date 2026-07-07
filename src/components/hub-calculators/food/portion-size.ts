import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'targetCalories', label: 'Target Calories', type: 'number', min: 50, step: '10' },
      { name: 'foodDensity', label: 'Calorie Density', type: 'select', options: [
        { label: 'Very low (~0.3 kcal/g) — leafy greens', value: '0.3' },
        { label: 'Low (~0.6 kcal/g) — non-starchy veg', value: '0.6' },
        { label: 'Medium (~1.5 kcal/g) — grains/legumes', value: '1.5' },
        { label: 'High (~3 kcal/g) — meat/cheese', value: '3' },
        { label: 'Very high (~5 kcal/g) — nuts/seeds', value: '5' },
        { label: 'Extreme (~9 kcal/g) — oils/butter', value: '9' },
      ] },
    ],
    compute: (v) => ({ result: v.targetCalories / v.foodDensity, label: 'Portion Size', unit: 'g', steps: [
      { label: 'Target calories', value: `${v.targetCalories} kcal` },
      { label: 'Calorie density', value: `${v.foodDensity} kcal/g` },
      { label: 'Portion weight', value: `${(v.targetCalories / v.foodDensity).toFixed(0)} g` },
      { label: 'Visual estimate', value: `~${((v.targetCalories / v.foodDensity) / 100).toFixed(1)} palm-sized portions` },
    ]}),
    description: 'Calculate portion sizes based on calorie targets and food density. Low-density foods (vegetables) allow larger portions for fewer calories than high-density foods (nuts, oil).',
    example: { label: '300 kcal target, medium density', value: '200 g portion' }
}

export default calcDef
