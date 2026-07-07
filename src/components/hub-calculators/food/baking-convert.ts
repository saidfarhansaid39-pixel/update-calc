import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'Amount', type: 'number', min: 0, step: '0.25' },
      { name: 'ingredient', label: 'Ingredient', type: 'select', options: [
        { label: 'All-purpose flour (125g/cup)', value: '125' }, { label: 'Sugar (200g/cup)', value: '200' },
        { label: 'Brown sugar (220g/cup)', value: '220' }, { label: 'Butter (227g/cup)', value: '227' },
        { label: 'Honey (340g/cup)', value: '340' }, { label: 'Cocoa powder (100g/cup)', value: '100' },
        { label: 'Rolled oats (90g/cup)', value: '90' }, { label: 'Chopped nuts (120g/cup)', value: '120' },
        { label: 'Rice (200g/cup)', value: '200' }, { label: 'Coconut oil (220g/cup)', value: '220' },
      ] },
    ],
    compute: (v) => ({ result: v.amount * v.ingredient, label: 'Weight', unit: 'g', steps: [
      { label: 'Volume', value: `${v.amount} cup${v.amount > 1 ? 's' : ''}` },
      { label: 'Density', value: `${v.ingredient} g/cup` },
      { label: 'Weight', value: `${(v.amount * v.ingredient).toFixed(0)} g` },
    ]}),
    description: 'Convert baking ingredient volumes to weights. Baking by weight is more accurate than volume — a cup of flour weighs 125g, while a cup of honey weighs 340g.',
    example: { label: '2 cups all-purpose flour', value: '250g' }
}

export default calcDef
