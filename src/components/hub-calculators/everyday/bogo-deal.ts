import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ itemPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), buyCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), freeCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'itemPrice', label: 'Price Per Item ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'buyCount', label: 'Items You Pay For', type: 'number', min: 1, step: '1' },
    { name: 'freeCount', label: 'Items You Get Free', type: 'number', min: 1, step: '1' },
  ],
  defaults: { itemPrice: '5', buyCount: '2', freeCount: '1' },
  presets: [
    { label: 'BOGO (Buy 1 Get 1 Free)', values: { itemPrice: '8', buyCount: '1', freeCount: '1' } },
    { label: 'B2G1 (Buy 2 Get 1 Free)', values: { itemPrice: '6', buyCount: '2', freeCount: '1' } },
    { label: 'B3G1 (Buy 3 Get 1 Free)', values: { itemPrice: '4', buyCount: '3', freeCount: '1' } },
    { label: 'BOGO 50% Off', values: { itemPrice: '10', buyCount: '2', freeCount: '0' } },
  ],
  compute: (v) => {
    const totalItems = v.buyCount + v.freeCount
    const totalCost = v.itemPrice * v.buyCount
    const effectivePrice = totalItems > 0 ? totalCost / totalItems : 0
    const savingsPct = totalItems > 0 ? (v.freeCount / totalItems) * 100 : 0
    const regularCost = v.itemPrice * totalItems
    const totalSavings = regularCost - totalCost
    return {
      result: effectivePrice, label: 'Effective Price/Item', unit: '$',
      steps: [
        { label: 'Items You Pay For', value: `${v.buyCount}` },
        { label: 'Items You Get Free', value: `${v.freeCount}` },
        { label: 'Total Items Received', value: `${totalItems}` },
        { label: 'Total Amount Paid', value: `$${totalCost.toFixed(2)}` },
        { label: 'Regular Price (no deal)', value: `$${regularCost.toFixed(2)}` },
        { label: 'Effective Price Per Item', value: `$${effectivePrice.toFixed(2)} each` },
        { label: 'Total Savings', value: `$${totalSavings.toFixed(2)}` },
        { label: 'Discount Percentage', value: `${savingsPct.toFixed(0)}% off` },
      ],
      extras: [
        { label: 'BOGO vs Percentage Off', value: 'Buy 1 Get 1 Free = 50% off each item (when buying in pairs). This is equivalent to a 50% discount, but only applies when you buy the required quantity.' },
        { label: 'Multi-Buy Math', value: 'Buy 2 Get 1 Free = 33% off each item. Buy 3 Get 1 Free = 25% off. Buy 1 Get 1 Half Off = 25% off total (75% of full price for 2 items).' },
        { label: 'Stacking Coupons Strategy', value: 'Many stores allow manufacturers coupons on BOGO deals. A $1 coupon on a BOGO item at $5 = pay $4 for 2 items = $2 each = 60% off total.' },
        { label: 'Per-Unit Price Check', value: 'Always compare the effective per-unit price against other sizes and brands. BOGO on a premium brand may still cost more per unit than a store brand at regular price.' },
        { label: 'Expiration and Limits', value: 'BOGO deals often have limits (e.g., "limit 4 per customer") and expiration dates. Stock up strategically for non-perishable items you regularly use.' },
        { label: 'Membership Programs', value: 'Warehouse clubs (Costco, Sam\'s Club) and loyalty programs often have exclusive BOGO deals for members. Factor in membership cost for annual savings.' },
        { label: 'BOGO on Clearance Items', value: 'The ultimate deal: BOGO on clearance/ markdown items. A $3 clearance item on BOGO = $1.50 each. Check clearance sections first before stock-up trips.' },
        { label: 'Online BOGO Caveats', value: 'Online BOGO deals may not auto-apply lowest-priced items as free. Check the cart before checkout. Some retailers discount the cheapest item rather than truly making it free.' },
      ]
    }
  },
  description: 'Calculate the effective per-item price on BOGO (Buy One Get One) and multi-buy deals. Compare savings across different buy/get ratios to find the best value.',
  formula: 'Effective Price = (Price × Paid) / (Paid + Free) | Savings% = Free / (Paid + Free) × 100',
  interpretation: 'BOGO = 50% off per item. B2G1 = 33% off. B3G1 = 25% off. BOGO 50% off = 25% off total. Always compare final per-unit price against other sizes and brands. Stock up on non-perishables during BOGO sales.'
}

export default calcDef
