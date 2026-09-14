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
  defaults: { adOrderAmount: '25', adDeliveryFee: '3.99', adServiceFeePct: '10', adTipPct: '15', adSubscription: 'none' },
  presets: [
    { label: 'Friday Night Dinner', values: { adOrderAmount: '35', adDeliveryFee: '4.99', adServiceFeePct: '12', adTipPct: '18', adSubscription: 'none' } },
    { label: 'Lunch Delivery', values: { adOrderAmount: '15', adDeliveryFee: '2.99', adServiceFeePct: '8', adTipPct: '15', adSubscription: 'premium' } },
    { label: 'Premium Subscriber', values: { adOrderAmount: '40', adDeliveryFee: '4.99', adServiceFeePct: '10', adTipPct: '20', adSubscription: 'premium' } },
    { label: 'Lite Saver', values: { adOrderAmount: '20', adDeliveryFee: '3.99', adServiceFeePct: '10', adTipPct: '15', adSubscription: 'lite' } },
  ],
  compute: (v) => {
    const serviceFee = v.adOrderAmount * (v.adServiceFeePct / 100)
    let effectiveDelivery = v.adDeliveryFee
    if (v.adSubscription === 'premium') { effectiveDelivery = 0 }
    if (v.adSubscription === 'lite') { effectiveDelivery = v.adDeliveryFee * 0.5 }
    const tip = v.adOrderAmount * (v.adTipPct / 100)
    const total = v.adOrderAmount + serviceFee + effectiveDelivery + tip
    const surchargePct = ((total - v.adOrderAmount) / v.adOrderAmount) * 100
    const baseFeeOnly = v.adOrderAmount + v.adDeliveryFee + serviceFee
    return { result: total, label: 'Total Delivery Cost', unit: '$', steps: [{ label: 'Order Subtotal', value: `$${v.adOrderAmount.toFixed(2)}` }, { label: 'Service Fee', value: `${v.adServiceFeePct}% of $${v.adOrderAmount.toFixed(2)} = $${serviceFee.toFixed(2)}` }, { label: 'Delivery Fee', value: `$${v.adDeliveryFee.toFixed(2)} → adjusted: $${effectiveDelivery.toFixed(2)}` }, { label: 'Tip', value: `${v.adTipPct}% of $${v.adOrderAmount.toFixed(2)} = $${tip.toFixed(2)}` }, { label: 'Total', value: `$${v.adOrderAmount.toFixed(2)} + $${serviceFee.toFixed(2)} + $${effectiveDelivery.toFixed(2)} + $${tip.toFixed(2)} = $${total.toFixed(2)}` }, { label: 'Surcharge', value: `$${(total - v.adOrderAmount).toFixed(2)} in fees = ${surchargePct.toFixed(0)}% above subtotal` }, { label: 'Effective Item %', value: `You pay ${((v.adOrderAmount / total) * 100).toFixed(0)}% for food, ${surchargePct.toFixed(0)}% for fees + tip` }, { label: 'Pickup Comparison', value: `Pickup saves ~$${(v.adDeliveryFee + serviceFee).toFixed(2)} in delivery + service fees` }] ,
    extras: [
      { label: 'True Cost of Convenience', value: `Your $${v.adOrderAmount.toFixed(2)} meal costs $${total.toFixed(2)} delivered — a ${surchargePct.toFixed(0)}% markup. That is $${(total - v.adOrderAmount).toFixed(2)} for the convenience of not picking it up.` },
      { label: 'Subscription Break-Even', value: `Premium ($9.99/mo) saves $${v.adDeliveryFee.toFixed(2)}/delivery. Break-even at ${Math.ceil(9.99 / v.adDeliveryFee)} orders/month. Lite ($4.99/mo) saves $${(v.adDeliveryFee * 0.5).toFixed(2)}/delivery — break-even at ${Math.ceil(4.99 / (v.adDeliveryFee * 0.5))} orders/month.` },
      { label: 'Tip on Subtotal vs Total', value: `At ${v.adTipPct}% on subtotal, you tip $${tip.toFixed(2)}. If you tipped on the total ($${(total * v.adTipPct / 100).toFixed(2)}), it would be $${((total * v.adTipPct / 100) - tip).toFixed(2)} more. Drivers prefer tip on total to cover their costs.` },
      { label: 'Service Fee Breakdown', value: `Service fees (${v.adServiceFeePct}% = $${serviceFee.toFixed(2)}) go to the platform, NOT the restaurant or driver. Restaurants often increase prices 10-15% on delivery apps — the real markup is ${(surchargePct + 10).toFixed(0)}-${(surchargePct + 15).toFixed(0)}%.` },
      { label: 'Order Size Sweet Spot', value: 'Larger orders spread the delivery fee over more items. A $' + `${v.adOrderAmount.toFixed(0)}` +       ' order pays ' + `${surchargePct.toFixed(0)}% in fees. A $` + `${(v.adOrderAmount * 2).toFixed(0)}` + ' order would pay ~' + `${((v.adDeliveryFee + v.adOrderAmount * 2 * v.adServiceFeePct / 100) / (v.adOrderAmount * 2) * 100).toFixed(0)}` + '% in fees — more efficient.' },
      { label: 'Weekly Delivery Budget', value: `Ordering ${(3).toFixed(0)}×/week at $${total.toFixed(2)} = $${(total * 3 * 4.33).toFixed(0)}/month on delivery. That's $${((total * 3 * 4.33) - (v.adOrderAmount * 3 * 4.33)).toFixed(0)}/month in fees and tips alone.` },
      { label: 'Dine-In vs Delivery', value: 'A $' + `${v.adOrderAmount.toFixed(0)}` + ' restaurant meal costs ~$' + `${(v.adOrderAmount * 0.85).toFixed(0)}` + ' dining in (no delivery/service fees) or $' + `${(v.adOrderAmount * 0.85).toFixed(0)}` + ' cooking at home (50-70% of restaurant price). Delivery is the most expensive option.' },
    ]}
  },
  description: 'Calculate the true cost of food delivery including service fees, delivery fees, tips, and subscription discounts. Compare delivery vs pickup vs dine-in to see how much convenience costs.',
  formula: 'Total = Subtotal + (Subtotal × Service Fee %) + Adjusted Delivery Fee + (Subtotal × Tip %) | Surcharge % = (Total − Subtotal) ÷ Subtotal × 100',
  interpretation: 'Delivery fees add 30-50% on top of the base food cost. A $25 meal becomes $33-38 delivered — that is $8-13 in fees and tip alone. Delivery subscriptions save money if you order 3+ times/month (Premium: $9.99/mo waives delivery fees). Tipping 15-20% on subtotal is standard but consider tipping on the total for driver fairness. Pickup saves $4-8/order in delivery and service fees. Cooking the same meal at home costs 50-70% less than delivery.'
}

export default calcDef
