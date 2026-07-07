import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' },
      { name: 'goal', label: 'Diet Goal', type: 'select', options: [{ label: 'Standard (balanced)', value: 'standard' }, { label: 'Low carb / high protein', value: 'lowcarb' }, { label: 'High carb (endurance)', value: 'highcarb' }, { label: 'Keto', value: 'keto' }] },
    ],
    compute: (v) => {
      let pPct = 25, fPct = 25, cPct = 50
      if (v.goal === 'lowcarb') { pPct = 35; fPct = 35; cPct = 30 }
      else if (v.goal === 'highcarb') { pPct = 20; fPct = 15; cPct = 65 }
      else if (v.goal === 'keto') { pPct = 25; fPct = 70; cPct = 5 }
      const protein = v.calories * (pPct / 100) / 4
      const fat = v.calories * (fPct / 100) / 9
      const carbs = v.calories * (cPct / 100) / 4
      return { result: protein, label: 'Protein', unit: 'g/day', steps: [
        { label: 'Goal', value: v.goal.charAt(0).toUpperCase() + v.goal.slice(1) },
        { label: 'Protein', value: `${protein.toFixed(0)} g (${pPct}%) — 4 kcal/g` },
        { label: 'Carbs', value: `${carbs.toFixed(0)} g (${cPct}%) — 4 kcal/g` },
        { label: 'Fat', value: `${fat.toFixed(0)} g (${fPct}%) — 9 kcal/g` },
      ]}
    },
    description: 'Quick macronutrient split based on your diet goal. Choose from balanced, low carb, high carb, or keto. Each diet adjusts the protein/carb/fat ratios automatically.',
    example: { label: '2000 kcal, low carb', value: 'P:175g C:150g F:78g' }
}

export default calcDef
