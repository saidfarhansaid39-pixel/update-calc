import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ originalPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), discountPct: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), quantity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), taxRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'originalPrice', label: 'Original Price ($)', type: 'number', min: 1, step: '1' },
    { name: 'discountPct', label: 'Discount (%)', type: 'number', min: 1, max: 100, step: '5' },
    { name: 'quantity', label: 'Quantity', type: 'number', min: 1, step: '1' },
    { name: 'taxRate', label: 'Sales Tax (%)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const discountAmount = v.originalPrice * (v.discountPct / 100)
    const discountedPrice = v.originalPrice - discountAmount
    const subtotal = discountedPrice * v.quantity
    const tax = subtotal * (v.taxRate / 100)
    const totalDue = subtotal + tax
    const totalSaved = discountAmount * v.quantity
    return { result: totalDue, label: 'Total Due', unit: '$', steps: [{ label: 'Each After Discount', value: `$${discountedPrice.toFixed(2)}` }, { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` }, { label: 'Tax', value: `$${tax.toFixed(2)}` }, { label: 'You Saved', value: `$${totalSaved.toFixed(2)}` }, { label: 'Total Due', value: `$${totalDue.toFixed(2)}` }] }
  },
  description: 'Calculate final price after discount including sales tax and quantity. See exactly how much you save with percentage-off sales and promotions.',
  formula: 'Total = (Price × (1 - Discount%) × Qty) × (1 + Tax%)',
  interpretation: 'Common retail discount depths: 10-20% standard sale, 30-50% clearance, 50-75% seasonal liquidation. Stack store coupons with manufacturer coupons at stores that allow double couponing.'
}

export default calcDef
