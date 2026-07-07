import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ adOrderAmount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), adDeliveryFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), adServiceFeePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), adTipPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), adSubscription: z.string().min(1) }),
  fields: [
    { name: 'adOrderAmount', label: 'Order Subtotal ($)', type: 'number', min: 5, step: '5' },
    { name: 'adDeliveryFee', label: 'Delivery Fee ($)', type: 'number', min: 0, step: '1' },
    { name: 'adServiceFeePct', label: 'Service Fee (%)', type: 'number', min: 0, max: 30, step: '1' },
    { name: 'adTipPct', label: 'Tip Percentage (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'adSubscription', label: 'Delivery Subscription', type: 'select', options: [{ label: 'None (pay per delivery)', value: 'none' }, { label: '$9.99/mo (free delivery)', value: 'premium' }, { label: '$4.99/mo (50% off fees)', value: 'lite' }] },
  ],
  compute: (v) => {
    const serviceFee = v.adOrderAmount * (v.adServiceFeePct / 100)
    let effectiveDelivery = v.adDeliveryFee
    if (v.adSubscription === 'premium') { effectiveDelivery = 0 }
    if (v.adSubscription === 'lite') { effectiveDelivery = v.adDeliveryFee * 0.5 }
    const tip = v.adOrderAmount * (v.adTipPct / 100)
    const total = v.adOrderAmount + serviceFee + effectiveDelivery + tip
    const surchargePct = ((total - v.adOrderAmount) / v.adOrderAmount) * 100
    return { result: total, label: 'Total Delivery Cost', unit: '$', steps: [{ label: 'Subtotal', value: `$${v.adOrderAmount.toFixed(2)}` }, { label: 'Service Fee', value: `$${serviceFee.toFixed(2)}` }, { label: 'Delivery Fee', value: `$${effectiveDelivery.toFixed(2)}` }, { label: 'Tip', value: `$${tip.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }, { label: 'Surcharge', value: `${surchargePct.toFixed(0)}% above subtotal` }] }
  },
  description: 'Calculate the true cost of food delivery including service fees, delivery fees, tips, and subscription discounts. Compare with takeout or dining in.',
  formula: 'Total = Subtotal + Fee + Delivery (adj) + Tip | Surcharge % = (Total - Subtotal) / Subtotal × 100%',
  interpretation: 'Delivery fees add 30-50% to the base order cost. A $20 meal becomes $27-30 with all fees. Delivery subscriptions save money if you order 3+ times/month. Tipping 15-20% is standard for good service.'
}

export default calcDef
