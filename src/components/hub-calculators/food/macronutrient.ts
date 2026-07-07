import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' },
      { name: 'proteinFactor', label: 'Protein Factor', type: 'select', options: [{ label: 'Standard (1.6 g/kg)', value: '1.6' }, { label: 'Athlete (2.0 g/kg)', value: '2' }, { label: 'Bodybuilder (2.2 g/kg)', value: '2.2' }] },
      { name: 'fatPct', label: 'Fat %', type: 'select', options: [{ label: '20%', value: '20' }, { label: '25%', value: '25' }, { label: '30%', value: '30' }, { label: '35%', value: '35' }] },
    ],
    compute: (v) => {
      const protein = v.weight * (v.proteinFactor || 1.6)
      const fat = v.calories * ((v.fatPct || 25) / 100) / 9
      const carbCal = v.calories - protein * 4 - fat * 9
      const carbs = Math.max(0, carbCal / 4)
      return { result: protein, label: 'Detailed Macros', unit: 'g', steps: [
        { label: 'Protein (weight-based)', value: `${protein.toFixed(0)} g (${v.proteinFactor} g/kg × ${v.weight} kg)` },
        { label: 'Fat', value: `${fat.toFixed(0)} g (${v.fatPct}% of calories)` },
        { label: 'Carbs (remaining)', value: `${carbs.toFixed(0)} g (${(carbCal / v.calories * 100).toFixed(0)}% of calories)` },
        { label: 'Total calories', value: `${(protein * 4 + fat * 9 + carbs * 4).toFixed(0)} kcal` },
      ]}
    },
    description: 'Detailed macronutrient calculation using weight-based protein recommendations and fat percentage. The remaining calories are allocated to carbohydrates for a complete profile.',
    example: { label: '70kg, 2000 kcal, athlete, 25% fat', value: 'P:140g C:235g F:56g' }
}

export default calcDef
