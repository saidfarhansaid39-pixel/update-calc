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
  defaults: { itemPrice: '39.99', storeCoupon: '3', mfgCoupon: '2', storePromoPct: '20', quantity: '2' },
  presets: [
    { label: 'Target Weekly Run', values: { itemPrice: '24.99', storeCoupon: '3', mfgCoupon: '2', storePromoPct: '15', quantity: '3' } },
    { label: 'CVS Beauty Haul', values: { itemPrice: '12.99', storeCoupon: '2', mfgCoupon: '1', storePromoPct: '10', quantity: '4' } },
    { label: 'Grocery Tri-Stack', values: { itemPrice: '6.49', storeCoupon: '1', mfgCoupon: '0.75', storePromoPct: '25', quantity: '6' } },
    { label: 'Back-to-School', values: { itemPrice: '49.99', storeCoupon: '10', mfgCoupon: '5', storePromoPct: '30', quantity: '2' } },
  ],
  compute: (v) => {
    const afterStoreDiscount = v.itemPrice * (1 - v.storePromoPct / 100)
    const perItemAfterCoupons = Math.max(0, afterStoreDiscount - v.storeCoupon - v.mfgCoupon)
    const totalCost = perItemAfterCoupons * v.quantity
    const totalSaved = (v.itemPrice * v.quantity) - totalCost
    const savingsPct = (totalSaved / (v.itemPrice * v.quantity)) * 100
    const promoValue = v.itemPrice * (v.storePromoPct / 100)
    return { result: totalCost, label: 'Total After Stacking', unit: '$', steps: [{ label: 'Original Total', value: `$${(v.itemPrice * v.quantity).toFixed(2)}` }, { label: 'Store Promo', value: `-$${(promoValue * v.quantity).toFixed(2)} (${v.storePromoPct}%)` }, { label: 'After Promo Each', value: `$${afterStoreDiscount.toFixed(2)}` }, { label: 'Minus Store Coupon', value: `-$${(v.storeCoupon * v.quantity).toFixed(2)}` }, { label: 'Minus Mfr Coupon', value: `-$${(v.mfgCoupon * v.quantity).toFixed(2)}` }, { label: 'Final Total', value: `$${totalCost.toFixed(2)}` }, { label: 'You Saved', value: `$${totalSaved.toFixed(2)} (${savingsPct.toFixed(0)}%)` }] ,
    extras: [
      { label: "Stacking Order", value: "Always apply % promos first, then fixed coupons—this maximizes the percentage discount before dollar deductions." },
      { label: "Policy Check", value: "Target: 1 store + 1 mfr per item. CVS: multiple store coupons but excludes sale items. Walmart: digital stacks with mfr paper." },
      { label: "Digital vs Paper", value: "Digital coupons (loaded to loyalty cards) often can't stack with other digital offers but can stack with paper manufacturer coupons." },
      { label: "Price Match Plus", value: "Some stores (Best Buy, Lowe's) price-match competitors AND let you stack coupons on the matched price—doubling savings." },
      { label: "Coupon Train", value: "Buy Sunday newspapers for high-value mfr coupons (typically $1-5 off). Digital-only stores like Amazon rarely offer stacking." },
      { label: "Overage Policy", value: "If a coupon exceeds the item price, most stores cap at $0. A few (Kroger, Publix) give overage toward other items." },
      { label: "Catalina Coupons", value: "These print at checkout based on your purchase. Factor them in as future savings—they're essentially money off your next trip." },
      { label: "Tax Savings", value: "Coupons reduce taxable subtotal in most states except where tax is calculated pre-coupon (rare). Stacking lowers sales tax too." },
    ]}
  },
  description: 'Maximize savings by stacking store promotions, store coupons, and manufacturer coupons on the same purchase. See the sequential impact of each layer and understand chain-specific stacking policies.',
  formula: 'Final Each = Max(0, Item Price × (1 − Promo%) − Store Coupon − Mfr Coupon) × Qty',
  interpretation: 'Stacking order matters: apply percentage-based promotions first to reduce the base, then subtract fixed-dollar coupons for maximum effect. Different retailers enforce unique stacking rules—Target allows one store + one manufacturer per item, while CVS permits multiple store coupons except on sale items. Paper manufacturer coupons from Sunday newspapers often stack with digital store coupons loaded to loyalty cards.'
}

export default calcDef
