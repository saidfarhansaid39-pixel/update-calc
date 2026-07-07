import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'Volume', type: 'number', min: 0, step: '0.25' },
      { name: 'fromUnit', label: 'From', type: 'select', options: [{ label: 'Cups', value: 'cup' }, { label: 'Tbsp', value: 'tbsp' }, { label: 'Tsp', value: 'tsp' }] },
      { name: 'ingredient', label: 'Ingredient', type: 'select', options: [{ label: 'Flour (125g/cup)', value: '125' }, { label: 'Sugar (200g/cup)', value: '200' }, { label: 'Brown sugar (220g/cup)', value: '220' }, { label: 'Butter (227g/cup)', value: '227' }, { label: 'Honey (340g/cup)', value: '340' }] }
    ],
    compute: (v) => {
      const tc: Record<string, number> = { cup: 1, tbsp: 1/16, tsp: 1/48 }; const cups = v.amount * (tc[v.fromUnit] || 1); const r = cups * parseFloat(v.ingredient); return { result: r, label: 'Weight', unit: 'g', steps: [{ label: 'Volume', value: v.amount + ' ' + v.fromUnit }, { label: 'Density', value: v.ingredient + ' g/cup' }, { label: 'Weight', value: r.toFixed(0) + ' g' }] }
    },
    description: 'Baking volume-to-weight conversions. Weighing is more accurate than volume measuring.',
    example: { label: '2 cups flour', value: '250g' }
}

export default calcDef
