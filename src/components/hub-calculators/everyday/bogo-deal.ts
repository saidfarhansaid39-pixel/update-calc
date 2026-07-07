import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ itemPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), buyCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), freeCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'itemPrice', label: 'Price Per Item ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'buyCount', label: 'Items You Pay For', type: 'number', min: 1, step: '1' },
    { name: 'freeCount', label: 'Items You Get Free', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const totalItems = v.buyCount + v.freeCount
    const totalCost = v.itemPrice * v.buyCount
    const effectivePrice = totalCost / totalItems
    const savingsPct = (1 - v.buyCount / totalItems) * 100
    return { result: effectivePrice, label: 'Effective Price/Item', unit: '$', steps: [{ label: 'Total Items', value: `${totalItems}` }, { label: 'Total Paid', value: `$${totalCost.toFixed(2)}` }, { label: 'Effective Price', value: `$${effectivePrice.toFixed(2)} each` }, { label: 'Savings', value: `${savingsPct.toFixed(0)}% off` }] }
  },
  description: 'Calculate the effective per-item price on BOGO (Buy One Get One) and multi-buy deals. Enter price, items paid for, and items free.',
  formula: 'Effective Price = (Price × Paid) / (Paid + Free) | Savings = 1 - Paid/(Paid+Free)',
  interpretation: 'BOGO = 50% off per item. BOGO 2 = buy 2 get 1 free = 33% off. BOGO 50% off = 25% off total when buying 2. Always compare final per-unit price.'
}

export default calcDef
