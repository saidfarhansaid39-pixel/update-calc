import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ itemPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), couponValue: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), couponType: z.string().min(1), quantity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'itemPrice', label: 'Item Price ($)', type: 'number', min: 0.5, step: '1' },
    { name: 'couponValue', label: 'Coupon Value', type: 'number', min: 0, step: '0.5' },
    { name: 'couponType', label: 'Coupon Type', type: 'select', options: [{ label: 'Fixed Amount ($)', value: 'fixed' }, { label: 'Percentage (%)', value: 'pct' }] },
    { name: 'quantity', label: 'Quantity', type: 'number', min: 1, step: '1' },
  ],
  defaults: { itemPrice: '24.99', couponValue: '20', couponType: 'pct', quantity: '2' },
  presets: [
    { label: 'Grocery Weekly Haul', values: { itemPrice: '5.49', couponValue: '1', couponType: 'fixed', quantity: '8' } },
    { label: 'Clothing Sale', values: { itemPrice: '49.99', couponValue: '30', couponType: 'pct', quantity: '3' } },
    { label: 'Electronics Bundle', values: { itemPrice: '129.99', couponValue: '25', couponType: 'fixed', quantity: '2' } },
    { label: 'Clearance Stack', values: { itemPrice: '14.99', couponValue: '50', couponType: 'pct', quantity: '5' } },
  ],
  compute: (v) => {
    const discount = v.couponType === 'pct' ? v.itemPrice * (v.couponValue / 100) : v.couponValue
    const finalEach = Math.max(0, v.itemPrice - discount)
    const totalBefore = v.itemPrice * v.quantity
    const totalAfter = finalEach * v.quantity
    const saved = totalBefore - totalAfter
    const savedPct = ((v.itemPrice - finalEach) / v.itemPrice) * 100
    const savedPerUnit = saved / v.quantity
    return { result: saved, label: 'Total Savings', unit: '$', steps: [{ label: 'Unit Price', value: `$${v.itemPrice.toFixed(2)}` }, { label: 'Coupon Applied', value: v.couponType === 'pct' ? `${v.couponValue}% off` : `$${v.couponValue} off` }, { label: 'Discounted Each', value: `$${finalEach.toFixed(2)}` }, { label: 'Total Before Coupon', value: `$${totalBefore.toFixed(2)}` }, { label: 'Total After Coupon', value: `$${totalAfter.toFixed(2)}` }, { label: 'Savings per Unit', value: `$${savedPerUnit.toFixed(2)}` }, { label: 'You Save', value: `$${saved.toFixed(2)} (${savedPct.toFixed(1)}%)` }] ,
    extras: [
      { label: "Best Strategy", value: "Percentage-off coupons beat fixed-dollar at higher price points; fixed-dollar wins on low-cost items." },
      { label: "Stacking Rule", value: "Most stores allow 1 manufacturer + 1 store coupon per item. Digital coupons often don't stack with paper." },
      { label: "Coupon Cycling", value: "Buy multiple with separate transactions to use the same coupon more than once if limits apply." },
      { label: "Cashback Layering", value: "Combine with a cashback app (Rakuten, Ibotta) for 2-15% additional savings on the post-coupon total." },
      { label: "Price Tracking", value: "Use CamelCamelCamel or Keepa to verify the item's price history—some retailers inflate MSRP before coupon events." },
      { label: "Expiration Watch", value: "Store coupons typically expire in 7-30 days. Manufacturer coupons last 30-90 days. Mark calendar reminders." },
      { label: "Bulk Threshold", value: "Free shipping thresholds ($25-50) often make adding one more item net-cheaper than paying shipping." },
      { label: "Tax Note", value: "Coupons reduce the taxable amount in most states. Fixed coupons reduce tax; percentage coupons reduce proportionally." },
    ]}
  },
  description: 'Calculate your exact savings when using fixed-dollar or percentage-off coupons on multiple quantities. See per-unit savings, total before and after, and the effective discount rate to make smarter shopping decisions.',
  formula: 'Savings = (Item Price × Qty) − (Max(0, Item Price − Discount) × Qty) where Discount = Fixed $ or Item Price × Pct',
  interpretation: 'Percentage-off coupons deliver greater dollar savings on expensive items, while fixed-dollar coupons perform better on budget items. Stacking a percentage coupon with a cashback app (2-15%) often beats a single fixed coupon on mid-to-high priced goods. Always compare the per-unit price after coupon to equivalent bulk or store-brand options.'
}

export default calcDef
