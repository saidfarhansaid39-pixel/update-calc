import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Weight on Scale', type: 'number', min: 0, step: '0.1' },
      { name: 'unit', label: 'Unit Displayed', type: 'select', options: [{ label: 'Grams (g)', value: 'g' }, { label: 'Ounces (oz)', value: 'oz' }, { label: 'Pounds (lb)', value: 'lb' }] },
      { name: 'ingredient', label: 'Ingredient Type', type: 'select', options: [
        { label: 'Flour (density varies)', value: 'flour' },
        { label: 'Sugar', value: 'sugar' },
        { label: 'Butter', value: 'butter' },
        { label: 'Rice (uncooked)', value: 'rice' },
        { label: 'Water / milk', value: 'liquid' },
      ] },
    ],
    compute: (v) => {
      const toGrams: Record<string, number> = { g: 1, oz: 28.3495, lb: 453.592 }
      const grams = v.weight * toGrams[v.unit]
      const densityMap: Record<string, number> = { flour: 0.593, sugar: 0.85, butter: 0.959, rice: 0.85, liquid: 1 }
      const volMl = Math.round(grams / (densityMap[v.ingredient] || 0.593))
      return { result: grams, label: 'Weight in Grams', unit: 'g', steps: [
        { label: 'Scale reading', value: `${v.weight} ${v.unit}` },
        { label: 'Converted to grams', value: `${grams.toFixed(1)} g` },
        { label: 'Ingredient', value: `${v.ingredient}` },
        { label: 'Approx. volume', value: `~${volMl} mL (${(volMl / 240).toFixed(2)} cups)` },
      ]}
    },
    description: 'Convert kitchen scale readings between units AND estimate volume for common ingredients. Handy when a recipe lists cups but you only have a scale.',
    example: { label: '250g flour on scale', value: '250g = ~421 mL (1.75 cups)' }
}

export default calcDef
