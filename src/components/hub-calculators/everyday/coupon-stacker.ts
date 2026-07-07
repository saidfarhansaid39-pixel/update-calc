import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ itemPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), storeCoupon: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), mfgCoupon: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), storePromoPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), quantity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'itemPrice', label: 'Item Price ($)', type: 'number', min: 0.5, step: '1' },
    { name: 'storeCoupon', label: 'Store Coupon ($)', type: 'number', min: 0, step: '0.5' },
    { name: 'mfgCoupon', label: 'Manufacturer Coupon ($)', type: 'number', min: 0, step: '0.5' },
    { name: 'storePromoPct', label: 'Store Promo (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'quantity', label: 'Quantity', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const afterStoreDiscount = v.itemPrice * (1 - v.storePromoPct / 100)
    const perItemAfterCoupons = Math.max(0, afterStoreDiscount - v.storeCoupon - v.mfgCoupon)
    const totalCost = perItemAfterCoupons * v.quantity
    const totalSaved = (v.itemPrice * v.quantity) - totalCost
    const savingsPct = (totalSaved / (v.itemPrice * v.quantity)) * 100
    return { result: totalCost, label: 'Total After Stacking', unit: '$', steps: [{ label: 'Original Total', value: `$${(v.itemPrice * v.quantity).toFixed(2)}` }, { label: 'Store Promo', value: `${v.storePromoPct}% off` }, { label: 'Store Coupon', value: `-$${(v.storeCoupon * v.quantity).toFixed(2)}` }, { label: 'Mfr Coupon', value: `-$${(v.mfgCoupon * v.quantity).toFixed(2)}` }, { label: 'Final Total', value: `$${totalCost.toFixed(2)}` }, { label: 'You Saved', value: `$${totalSaved.toFixed(2)} (${savingsPct.toFixed(0)}%)` }] }
  },
  description: 'Calculate total savings from stacking store promotions, store coupons, and manufacturer coupons on multiple items.',
  formula: 'Final Price = (Price × (1 - Promo%) - Store Coupon - Mfr Coupon) × Qty',
  interpretation: 'Coupon stacking policies vary: Target allows 1 store + 1 manufacturer per item. CVS allows multiple store coupons but not on sale items. Read the fine print. Digital coupons often don\'t stack with paper.'
}

export default calcDef
