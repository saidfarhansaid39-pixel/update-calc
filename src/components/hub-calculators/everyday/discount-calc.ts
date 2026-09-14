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
  defaults: { originalPrice: '50', discountPct: '20', quantity: '1', taxRate: '8' },
  presets: [
    { label: 'Black Friday TV', values: { originalPrice: '800', discountPct: '35', quantity: '1', taxRate: '8' } },
    { label: 'Bulk Office Supplies', values: { originalPrice: '25', discountPct: '15', quantity: '20', taxRate: '0' } },
    { label: 'Clearance Winter Coat', values: { originalPrice: '200', discountPct: '60', quantity: '1', taxRate: '6' } },
    { label: 'Grocery Coupon Stack', values: { originalPrice: '4', discountPct: '50', quantity: '10', taxRate: '2' } },
  ],
  compute: (v) => {
    const discountAmount = v.originalPrice * (v.discountPct / 100)
    const discountedPrice = v.originalPrice - discountAmount
    const subtotal = discountedPrice * v.quantity
    const tax = subtotal * (v.taxRate / 100)
    const totalDue = subtotal + tax
    const totalSaved = discountAmount * v.quantity
    const savingsPct = (discountAmount / v.originalPrice) * 100
    const postTaxUnit = totalDue / v.quantity
    return { result: totalDue, label: 'Total Due', unit: '$', steps: [
      { label: 'Discount per Item', value: `${v.discountPct}% of $${v.originalPrice.toFixed(2)} = $${discountAmount.toFixed(2)}` },
      { label: 'Price After Discount', value: `$${v.originalPrice.toFixed(2)} - $${discountAmount.toFixed(2)} = $${discountedPrice.toFixed(2)}` },
      { label: 'Subtotal', value: `$${discountedPrice.toFixed(2)} × ${v.quantity} = $${subtotal.toFixed(2)}` },
      { label: 'Sales Tax', value: `${v.taxRate}% of $${subtotal.toFixed(2)} = $${tax.toFixed(2)}` },
      { label: 'Total Due', value: `$${totalDue.toFixed(2)}` },
      { label: 'Cost per Item (incl. tax)', value: `$${postTaxUnit.toFixed(2)}` },
      { label: 'You Saved Total', value: `$${totalSaved.toFixed(2)} (${savingsPct.toFixed(0)}% off)` },
      { label: 'Effective Discount Rate', value: `${((1 - (totalDue / (v.originalPrice * v.quantity))) * 100).toFixed(1)}% after tax` },
    ] ,
    extras: [
      { label: "Stacking Strategies", value: "Stack manufacturer coupons + store coupons + cashback apps (Rakuten, Ibotta) for 50-80% combined savings. Target and CVS allow coupon stacking on same item." },
      { label: "Percent-Off vs Dollar-Off", value: "A 20% off $50 item saves $10. A $10 off $50 item saves $10 — same deal. But $10 off $25 (40% off) beats 20% off any day. Always calculate the effective rate." },
      { label: "Sales Tax Nuances", value: "Some states (DE, MT, NH, OR) have 0% sales tax. Others (CA, TN) exceed 9%. Discounts are applied before tax in most states, saving you tax on the discounted portion." },
      { label: "Buy One Get One", value: "BOGO free = 50% off per unit if you buy both. BOGO 50% off = 25% off per unit. Retailers use BOGO to move inventory fast — check if you actually need two." },
      { label: "Seasonal Calendar", value: "Best discount windows: Electronics (Black Friday/Cyber Monday), Furniture (MLK/President's Day), Apparel (end-of-season), Mattresses (holiday weekends), Cars (year-end/Oct-Dec)." },
      { label: "Price Matching", value: "Target, Best Buy, Walmart, and Costco offer price matching. Show a competitor's lower ad or online price at customer service. Some also match post-purchase within 14-30 days." },
      { label: "Membership Math", value: "Warehouse clubs (Costco, Sam's) offer 20-40% lower per-unit prices but the $60-120 annual membership requires $300-600 spend to break even. Factor membership cost into true savings." },
      { label: "Cashback Layers", value: "Use a cashback credit card (2-6% on categories) + portal (Rakuten 1-15%) + app (Ibotta $0.25-5/item) + store loyalty points. Layers compound: $100 purchase at 30% off + 5% cashback + $2 app = $68 net." },
    ]}
  },
  description: 'Determine the final price you pay after applying a percentage discount, with sales tax and quantity factored in. Break down savings per item, effective discount rate, and total out-the-door cost.',
  formula: 'Total = [Original Price × (1 - Discount%/100) × Qty] × (1 + Tax%/100) | Savings = Discount Amount × Qty',
  interpretation: 'Common discount tiers: 10-20% (standard sale), 30-50% (clearance), 50-75% (seasonal liquidation), 75-90% (fire sale). The real power move is stacking — combining a 20% store coupon, 5% cashback card, and 3% portal rebate yields a net 27.2% effective discount. Always check if the discount applies before or after tax in your jurisdiction.'
}

export default calcDef
