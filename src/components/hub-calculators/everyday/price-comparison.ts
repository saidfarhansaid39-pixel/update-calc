import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ priceA: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), qtyA: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), priceB: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), qtyB: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'priceA', label: 'Option A Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'qtyA', label: 'Option A Quantity', type: 'number', min: 0.1, step: '1' },
    { name: 'priceB', label: 'Option B Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'qtyB', label: 'Option B Quantity', type: 'number', min: 0.1, step: '1' },
  ],
  compute: (v) => {
    const unitA = v.priceA / v.qtyA
    const unitB = v.priceB / v.qtyB
    const savings = Math.abs(unitA - unitB)
    const better = unitA < unitB ? 'A' : 'B'
    const savingsPct = ((Math.max(unitA, unitB) - Math.min(unitA, unitB)) / Math.max(unitA, unitB)) * 100
    return { result: Math.min(unitA, unitB), label: 'Best Unit Price', unit: '$/unit', steps: [{ label: 'Option A', value: `$${unitA.toFixed(4)} per unit` }, { label: 'Option B', value: `$${unitB.toFixed(4)} per unit` }, { label: `Option ${better} is Better`, value: `Save $${savings.toFixed(4)} per unit (${savingsPct.toFixed(1)}%)` }] }
  },
  description: 'Compare two product options by price and quantity to find the better value. Calculates unit price for direct comparison.',
  formula: 'Unit Price = Total Price ÷ Quantity | Savings = |UnitA - UnitB|',
  interpretation: 'Larger packages often have a lower unit price but not always. Check the unit price label on store shelves. Buying in bulk saves 10-40% when the item won\'t expire before use.'
}

export default calcDef
