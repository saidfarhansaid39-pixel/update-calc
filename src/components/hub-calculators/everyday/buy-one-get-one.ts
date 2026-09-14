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
  defaults: { bogo2Price: '10', bogo2Qty: '4', bogo2DiscountType: 'b1g1', bogo2DiscountValue: '0' },
  presets: [
    { label: 'B1G1 Grocery Run', values: { bogo2Price: '6', bogo2Qty: '6', bogo2DiscountType: 'b1g1', bogo2DiscountValue: '0' } },
    { label: 'B2G1 Clothing Sale', values: { bogo2Price: '35', bogo2Qty: '6', bogo2DiscountType: 'b2g1', bogo2DiscountValue: '5' } },
    { label: 'B1G1 Half Off + Coupon', values: { bogo2Price: '12', bogo2Qty: '4', bogo2DiscountType: 'b1g1h', bogo2DiscountValue: '3' } },
    { label: 'B2G1 Half Off Electronics', values: { bogo2Price: '50', bogo2Qty: '6', bogo2DiscountType: 'b2g1h', bogo2DiscountValue: '10' } },
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
    const dealLabels: Record<string, string> = { b1g1: 'B1G1 Free', b2g1: 'B2G1 Free', b1g1h: 'B1G1 50% Off', b2g1h: 'B2G1 50% Off' }
    return {
      result: total, label: 'Total After Deal', unit: '$',
      steps: [
        { label: 'Deal Type', value: dealLabels[v.bogo2DiscountType] || v.bogo2DiscountType },
        { label: 'Items Wanted', value: `${v.bogo2Qty}` },
        { label: 'Items You Pay For', value: `${paidItems}` },
        { label: 'Subtotal Before Coupon', value: `$${(paidItems * v.bogo2Price).toFixed(2)}` },
        { label: 'Additional Coupon', value: `-$${v.bogo2DiscountValue.toFixed(2)}` },
        { label: 'Final Total', value: `$${total.toFixed(2)}` },
        { label: 'Effective Per-Item', value: `$${effPerItem.toFixed(2)} each` },
        { label: 'Total Savings', value: `$${savings.toFixed(2)} (${pctSaved.toFixed(0)}% off)` },
      ],
      extras: [
        { label: 'B1G1 True Discount', value: 'Buy 1 Get 1 Free = 50% off each item when purchased in pairs. To maximize value, always buy in even quantities. Buying an odd number means paying full price for the last item.' },
        { label: 'B2G1 Breakdown', value: 'Buy 2 Get 1 Free = 33.3% off each item. Ideal for 3, 6, or 9 items. A great middle-ground between BOGO and bulk discounts on mid-priced items.' },
        { label: 'Half-Off Variants Explained', value: 'Buy 1 Get 1 50% Off = effectively 25% off total (pay 150% of 1 item for 2 items). Buy 2 Get 1 50% Off = pay for 2.5 items out of 3 = 16.7% off total.' },
        { label: 'Coupon Stacking Strategy', value: 'Manufacturer coupons and store coupons can often be stacked on BOGO deals. A $2 coupon on a B1G1 $8 deal = pay $6 for 2 items = $3 each = 62.5% off total.' },
        { label: 'Buy-In Multiples Strategy', value: 'To maximize BOGO: Buy in multiples of 2 for B1G1, multiples of 3 for B2G1. For B1G1, buying 8 items = 4 paid + 4 free = 50% off everything.' },
        { label: 'Price Lookup Pitfall', value: 'Some retailers raise prices during BOGO promotions. A "$10 BOGO" item that was regularly $8 gives you effective price of $5 each — only $3 off per pair vs regular $8 each.' },
        { label: 'Digital Coupon Fine Print', value: 'Store apps often have BOGO digital coupons with exclusions: "Not valid on sale items," "Limit one per transaction," or "Excludes travel sizes." Read the terms before shopping.' },
        { label: 'Raincheck Policy', value: 'If a BOGO item is out of stock, most major retailers will issue a raincheck honored when stock returns. Some stores (e.g., Target, Walmart) offer substitutions at the same deal price.' },
      ]
    }
  },
  description: 'Calculate savings with buy-one-get-one deals including B1G1 Free, B2G1 Free, half-off variants, and additional coupons. Optimize your shopping by understanding effective per-item cost.',
  formula: 'Total = PaidItems × Price - Coupon | PaidItems depends on deal type (B1G1: ceil(Qty/2), B2G1: ceil(Qty×2/3), etc.) | Savings = FullPrice - Total',
  interpretation: 'B1G1 Free = 50% off when buying in pairs. B2G1 Free = 33% off. Stack with manufacturer coupons for maximum savings. Buy in multiples of the deal ratio to avoid paying full price for odd items. The best deals combine BOGO with coupons and loyalty rewards.'
}

export default calcDef
