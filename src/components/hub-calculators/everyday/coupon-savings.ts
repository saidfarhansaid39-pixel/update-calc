import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ itemPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), couponValue: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), couponType: z.string().min(1), quantity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'itemPrice', label: 'Item Price ($)', type: 'number', min: 0.5, step: '1' },
    { name: 'couponValue', label: 'Coupon Value', type: 'number', min: 0, step: '0.5' },
    { name: 'couponType', label: 'Coupon Type', type: 'select', options: [{ label: 'Fixed Amount ($)', value: 'fixed' }, { label: 'Percentage (%)', value: 'pct' }] },
    { name: 'quantity', label: 'Quantity', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const discount = v.couponType === 'pct' ? v.itemPrice * (v.couponValue / 100) : v.couponValue
    const finalEach = Math.max(0, v.itemPrice - discount)
    const totalBefore = v.itemPrice * v.quantity
    const totalAfter = finalEach * v.quantity
    const saved = totalBefore - totalAfter
    const savedPct = ((v.itemPrice - finalEach) / v.itemPrice) * 100
    return { result: saved, label: 'Total Savings', unit: '$', steps: [{ label: 'Each After Coupon', value: `$${finalEach.toFixed(2)}` }, { label: 'Total Before', value: `$${totalBefore.toFixed(2)}` }, { label: 'Total After', value: `$${totalAfter.toFixed(2)}` }, { label: 'You Save', value: `$${saved.toFixed(2)} (${savedPct.toFixed(1)}%)` }] }
  },
  description: 'Calculate savings from coupons including fixed amount and percentage-off coupons. Stack coupons and see total savings on multiple items.',
  formula: 'Savings = (Price - Discount) × Qty | Discount = Fixed $ or Price × Pct%',
  interpretation: 'Stacking: use manufacturer coupon + store coupon + cashback app for maximum savings. Percentage-off is better for high-price items; fixed amount is better for low-price items.'
}

export default calcDef
