import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ad2ItemTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ad2DistKm: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ad2RushFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ad2BagFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ad2CouponDiscount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ad2LoyaltyTier: z.string().min(1) }),
  fields: [
    { name: 'ad2ItemTotal', label: 'Items Total ($)', type: 'number', min: 1, step: '5' },
    { name: 'ad2DistKm', label: 'Delivery Distance (km)', type: 'number', min: 0, step: '1' },
    { name: 'ad2RushFee', label: 'Rush/Peak Fee ($)', type: 'number', min: 0, step: '1' },
    { name: 'ad2BagFee', label: 'Bag/Packaging Fee ($)', type: 'number', min: 0, step: '0.25' },
    { name: 'ad2CouponDiscount', label: 'Coupon Discount ($)', type: 'number', min: 0, step: '1' },
    { name: 'ad2LoyaltyTier', label: 'Loyalty Program', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Silver (5% back)', value: 'silver' }, { label: 'Gold (10% back)', value: 'gold' }, { label: 'Platinum (15% back, free delivery)', value: 'platinum' }] },
  ],
  compute: (v) => {
    const distanceFee = v.ad2DistKm * 0.5
    let subtotal = v.ad2ItemTotal + distanceFee + v.ad2RushFee + v.ad2BagFee
    subtotal = subtotal - v.ad2CouponDiscount
    const cashbackPct: Record<string, number> = { none: 0, silver: 5, gold: 10, platinum: 15 }
    const cbPct = cashbackPct[v.ad2LoyaltyTier] || 0
    const cashback = subtotal * (cbPct / 100)
    let deliverySurcharge = 0
    if (v.ad2LoyaltyTier === 'platinum') { deliverySurcharge = 0 } else { deliverySurcharge = 3.99 }
    const totalWithDelivery = subtotal + deliverySurcharge
    const effectiveTotal = totalWithDelivery - cashback
    return { result: effectiveTotal, label: 'Effective Total (after rewards)', unit: '$', steps: [{ label: 'Items', value: `$${v.ad2ItemTotal.toFixed(2)}` }, { label: 'Distance Fee', value: `$${distanceFee.toFixed(2)}` }, { label: 'Surcharges', value: `$${(v.ad2RushFee + v.ad2BagFee).toFixed(2)}` }, { label: 'Coupon', value: `-$${v.ad2CouponDiscount.toFixed(2)}` }, { label: 'Delivery Fee', value: `$${deliverySurcharge.toFixed(2)}` }, { label: 'Cashback', value: `-$${cashback.toFixed(2)}` }, { label: 'Effective Total', value: `$${effectiveTotal.toFixed(2)}` }] }
  },
  description: 'Estimate total delivery cost with distance fees, rush charges, bag fees, coupon discounts, and loyalty cashback. See your effective cost after rewards.',
  formula: 'Effective Total = (Items + Distance Fee + Rush + Bag - Coupon) + Delivery Fee - Cashback',
  interpretation: 'Distance-based fees add $0.50-2/km beyond a free radius. Rush/peak fees add $2-5 during busy times. Loyalty programs save 5-15% over time. Combine coupons with loyalty rewards for maximum savings on delivery orders.'
}

export default calcDef
