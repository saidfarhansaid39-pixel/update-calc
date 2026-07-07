import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bogo2Price: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bogo2Qty: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), bogo2DiscountType: z.string().min(1), bogo2DiscountValue: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'bogo2Price', label: 'Item Price ($)', type: 'number', min: 0.5, step: '1' },
    { name: 'bogo2Qty', label: 'Items You Want', type: 'number', min: 1, step: '1' },
    { name: 'bogo2DiscountType', label: 'Deal Type', type: 'select', options: [{ label: 'Buy 1 Get 1 Free', value: 'b1g1' }, { label: 'Buy 2 Get 1 Free', value: 'b2g1' }, { label: 'Buy 1 Get 1 50% Off', value: 'b1g1h' }, { label: 'Buy 2 Get 1 50% Off', value: 'b2g1h' }] },
    { name: 'bogo2DiscountValue', label: 'Additional Coupon ($)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    let paidItems = v.bogo2Qty
    if (v.bogo2DiscountType === 'b1g1') paidItems = Math.ceil(v.bogo2Qty / 2)
    else if (v.bogo2DiscountType === 'b1g1h') paidItems = Math.ceil(v.bogo2Qty * 0.75)
    else if (v.bogo2DiscountType === 'b2g1') paidItems = Math.ceil(v.bogo2Qty * 2 / 3)
    else if (v.bogo2DiscountType === 'b2g1h') paidItems = Math.ceil(v.bogo2Qty * 5 / 6)
    let total = paidItems * v.bogo2Price - v.bogo2DiscountValue
    if (total < 0) total = 0
    const fullPrice = v.bogo2Qty * v.bogo2Price
    const savings = fullPrice - total
    const pctSaved = fullPrice > 0 ? (savings / fullPrice) * 100 : 0
    const effPerItem = v.bogo2Qty > 0 ? total / v.bogo2Qty : 0
    return { result: total, label: 'Total After Deal', unit: '$', steps: [{ label: 'Items Wanted', value: '' + v.bogo2Qty }, { label: 'Items Paid For', value: '' + paidItems }, { label: 'Subtotal', value: '$' + (paidItems * v.bogo2Price).toFixed(2) }, { label: 'Coupon', value: '-$' + v.bogo2DiscountValue.toFixed(2) }, { label: 'Total', value: '$' + total.toFixed(2) }, { label: 'You Save', value: '$' + savings.toFixed(2) + ' (' + pctSaved.toFixed(0) + '%)' }] }
  },
  description: 'Calculate savings with buy-one-get-one deals including BOGO, B2G1, half-off variants, and additional coupons.',
  formula: 'Total = PaidItems x Price - Coupon | PaidItems varies by deal type | Savings = FullPrice - Total',
  interpretation: 'B1G1 Free = 50% off each when buying in pairs. B2G1 Free = 33% off. Stack with manufacturer coupons for maximum savings. Buy in even multiples to maximize BOGO value.'
}

export default calcDef
