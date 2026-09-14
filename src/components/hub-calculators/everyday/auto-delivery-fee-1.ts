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
  defaults: { ad2ItemTotal: '30', ad2DistKm: '5', ad2RushFee: '0', ad2BagFee: '0.5', ad2CouponDiscount: '0', ad2LoyaltyTier: 'none' },
  presets: [
    { label: 'Weekend Grocery Run', values: { ad2ItemTotal: '45', ad2DistKm: '3', ad2RushFee: '2', ad2BagFee: '0.75', ad2CouponDiscount: '5', ad2LoyaltyTier: 'silver' } },
    { label: 'Late Night Craving', values: { ad2ItemTotal: '18', ad2DistKm: '4', ad2RushFee: '4', ad2BagFee: '0.5', ad2CouponDiscount: '0', ad2LoyaltyTier: 'none' } },
    { label: 'Platinum Power User', values: { ad2ItemTotal: '60', ad2DistKm: '8', ad2RushFee: '0', ad2BagFee: '0.25', ad2CouponDiscount: '10', ad2LoyaltyTier: 'platinum' } },
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
    const feePercentage = ((effectiveTotal - v.ad2ItemTotal) / v.ad2ItemTotal) * 100
    return { result: effectiveTotal, label: 'Effective Total (after rewards)', unit: '$', steps: [{ label: 'Items Total', value: `$${v.ad2ItemTotal.toFixed(2)}` }, { label: 'Distance Fee', value: `${v.ad2DistKm} km × $0.50 = $${distanceFee.toFixed(2)}` }, { label: 'Rush + Bag Fees', value: `$${v.ad2RushFee.toFixed(2)} + $${v.ad2BagFee.toFixed(2)} = $${(v.ad2RushFee + v.ad2BagFee).toFixed(2)}` }, { label: 'Coupon Applied', value: `-$${v.ad2CouponDiscount.toFixed(2)}` }, { label: 'Subtotal after discount', value: `$${subtotal.toFixed(2)}` }, { label: 'Delivery Fee', value: `$${deliverySurcharge.toFixed(2)}` }, { label: 'Loyalty Cashback', value: `${cbPct}% of $${subtotal.toFixed(2)} = -$${cashback.toFixed(2)}` }, { label: 'Effective Total', value: `$${effectiveTotal.toFixed(2)} (${feePercentage.toFixed(0)}% above items)` }] ,
    extras: [
      { label: 'Fee Breakdown Summary', value: `Items: $${v.ad2ItemTotal.toFixed(2)} → Effective: $${effectiveTotal.toFixed(2)}. Fees add ${feePercentage.toFixed(0)}% to your base item cost. Distance accounts for $${distanceFee.toFixed(2)} of that.` },
      { label: 'Loyalty Tier Value', value: `Platinum saves $3.99 delivery + ${((15 - cbPct)).toFixed(0)}% extra cashback over your current tier. If you order ${(3).toFixed(0)}×/month, that is ~$${(3.99 * 3 + cashback * 3).toFixed(0)}/month.` },
      { label: 'Rush Fee Avoidance', value: `Rush fees of $${v.ad2RushFee.toFixed(2)} add ${v.ad2RushFee > 0 ? ((v.ad2RushFee / v.ad2ItemTotal) * 100).toFixed(0) + '% to your bill. Ordering 30 min earlier/later avoids peak pricing entirely.' : 'no extra cost this order — good timing!'}` },
      { label: 'Coupon Stacking Strategy', value: `Your $${v.ad2CouponDiscount.toFixed(2)} coupon saves you ${v.ad2CouponDiscount > 0 ? ((v.ad2CouponDiscount / v.ad2ItemTotal) * 100).toFixed(0) + '% of item cost.' : '0% this order. Look for promo codes before checkout — even $2 off covers the bag fee.'}` },
      { label: 'Minimum Order Trap', value: 'Many platforms push minimum orders ($12-15) to qualify for delivery. If you are ordering $' + `${v.ad2ItemTotal.toFixed(0)}` + ', check if adding $' + `${(15 - v.ad2ItemTotal).toFixed(0)}` + ' more triggers free delivery — often worth it.' },
      { label: 'Bag Fee Environmental Note', value: `Bag/packaging fees ($${v.ad2BagFee.toFixed(2)}) are charged per order. Request "no bag" or "minimal packaging" in delivery notes to save $0.25-1/order and reduce plastic waste.` },
      { label: 'Annual Subscription Math', value: 'Platform passes ($9.99-19.99/mo) include free delivery and reduced fees. If you order 4+ times/month at $' + `${effectiveTotal.toFixed(0)}` + '/order, a pass saves ~$' + `${((3.99 + distanceFee) * 4 - 14.99).toFixed(0)}` + '/month.' },
    ]}
  },
  description: 'Estimate the effective cost of a delivery order after distance fees, rush charges, bag fees, coupon discounts, delivery surcharges, and loyalty cashback. See exactly where your money goes and how to save.',
  formula: 'Effective Total = (Items + Distance Fee + Rush Fee + Bag Fee − Coupon) + Delivery Fee − (Loyalty % × Subtotal) | Cashback % = |fee% = (Effective − Items) ÷ Items × 100',
  interpretation: 'Distance fees add $0.50/km beyond a free radius. Rush/peak fees add $2-5 during busy hours — avoid by ordering off-peak. Loyalty programs return 5-15% in cashback; Platinum also waives the $3.99 delivery fee. Coupons stack on top of loyalty rewards. A $30 order can balloon to $40+ with all fees, or shrink to $25 with a coupon and Platinum tier. Platform subscriptions ($10-20/mo) are worth it for 4+ orders/month.'
}

export default calcDef
