import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ priceA: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), qtyA: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), priceB: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), qtyB: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'priceA', label: 'Option A Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'qtyA', label: 'Option A Quantity', type: 'number', min: 1, step: '1' },
    { name: 'priceB', label: 'Option B Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'qtyB', label: 'Option B Quantity', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const unitPriceA = v.priceA / v.qtyA
    const unitPriceB = v.priceB / v.qtyB
    const betterDeal = unitPriceA <= unitPriceB ? 'A' : 'B'
    const savingsPct = Math.abs(unitPriceA - unitPriceB) / Math.max(unitPriceA, unitPriceB) * 100
    return { result: Math.min(unitPriceA, unitPriceB), label: 'Best Unit Price', unit: '$ per unit', steps: [{ label: 'Option A', value: `$${unitPriceA.toFixed(4)}/unit` }, { label: 'Option B', value: `$${unitPriceB.toFixed(4)}/unit` }, { label: 'Better Deal', value: `Option ${betterDeal}` }, { label: 'Savings vs Worse Deal', value: `${savingsPct.toFixed(1)}%` }] }
  },
  description: 'Compare two products or deals by calculating the unit price. Enter the price and quantity for each option to see which offers better value.',
  formula: 'Unit Price = Price / Quantity | Better Deal = Min(UnitA, UnitB)',
  interpretation: 'Larger packages are not always cheaper per unit. Store brands are typically 15-30% cheaper than name brands. Watch for "shrinkflation" where package size decreases but price stays the same.'
}

export default calcDef
