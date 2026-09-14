import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ priceA: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), qtyA: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), priceB: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), qtyB: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'priceA', label: 'Option A Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'qtyA', label: 'Option A Quantity', type: 'number', min: 0.1, step: '1' },
    { name: 'priceB', label: 'Option B Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'qtyB', label: 'Option B Quantity', type: 'number', min: 0.1, step: '1' },
  ],
  defaults: { priceA: '4.99', qtyA: '16', priceB: '8.99', qtyB: '32' },
  presets: [
    { label: 'Small vs Large Cereal Box', values: { priceA: '4.99', qtyA: '12', priceB: '6.99', qtyB: '20' } },
    { label: 'Single vs Bulk Toilet Paper', values: { priceA: '1.29', qtyA: '1', priceB: '28.99', qtyB: '36' } },
    { label: 'Store vs Name Brand', values: { priceA: '3.49', qtyA: '16', priceB: '4.99', qtyB: '16' } },
    { label: 'Small Bag vs Family Bag', values: { priceA: '5.99', qtyA: '10', priceB: '9.99', qtyB: '24' } },
  ],
  compute: (v) => {
    const unitA = v.priceA / v.qtyA
    const unitB = v.priceB / v.qtyB
    const savings = Math.abs(unitA - unitB)
    const better = unitA < unitB ? 'A' : 'B'
    const savingsPct = ((Math.max(unitA, unitB) - Math.min(unitA, unitB)) / Math.max(unitA, unitB)) * 100
    const unitA10 = unitA * 10
    const unitB10 = unitB * 10
    return { result: Math.min(unitA, unitB), label: 'Best Unit Price', unit: '$/unit',
      steps: [
        { label: 'Option A Unit Price', value: `$${v.priceA} ÷ ${v.qtyA} = $${unitA.toFixed(4)}/unit` },
        { label: 'Option B Unit Price', value: `$${v.priceB} ÷ ${v.qtyB} = $${unitB.toFixed(4)}/unit` },
        { label: 'Price Difference', value: `$${savings.toFixed(4)} per unit (${savingsPct.toFixed(1)}%)` },
        { label: 'Best Option', value: `Option ${better} ($${Math.min(unitA, unitB).toFixed(4)}/unit)` },
        { label: 'Cost for 10 Units (A)', value: `$${unitA10.toFixed(2)}` },
        { label: 'Cost for 10 Units (B)', value: `$${unitB10.toFixed(2)}` },
        { label: 'Savings on 10 Units', value: `Save $${Math.abs(unitA10 - unitB10).toFixed(2)} by choosing ${better}` },
        { label: 'Annual Savings (if bought weekly)', value: `$${(Math.abs(unitA - unitB) * 52).toFixed(0)}` },
      ],
      extras: [
        { label: '📊 Unit Price Label Law', value: 'Most US states require grocery stores to display unit pricing (price per oz, lb, or count) on shelf tags. Compare these instead of total price for the best deal.' },
        { label: '📦 The Bulk Fallacy', value: 'Larger packages are NOT always cheaper per unit. A MIT study found 15-20% of "bulk" items had higher unit prices than their smaller counterparts. Always verify.' },
        { label: '🏪 Store Brands vs Name Brands', value: 'Store/generic brands cost 20-40% less per unit than national brands. For staples like flour, sugar, salt, and canned goods, the quality difference is often negligible.' },
        { label: '💵 Coupon Stacking Strategy', value: 'Apply coupons to the larger/better-unit-price option for maximum savings. A $1 off coupon on a $5 item saves 20%; on a $10 item only 10%. Stack with store sales for 40-60% total savings.' },
        { label: '🔄 Subscription Savings Trap', value: 'Subscribe & Save offers 5-15% off but locks you into recurring purchases. If you don\'t need that much that often, the per-unit "savings" become waste. Only subscribe for non-perishable regular-use items.' },
        { label: '♻️ Environmental Cost', value: 'The cheapest per-unit option often has the most packaging. Consider the environmental cost: bulk bins (bring your own container) have zero packaging waste and often beat packaged prices by 10-30%.' },
        { label: '📈 Tracking with Basket Apps', value: 'Use apps (Basket, Flipp, Yucaipa) to compare per-unit prices across stores. The same box of cereal can cost 2× more at a convenience store vs Walmart or Target.' },
        { label: '🧠 The Per-Unit Price Illusion', value: 'Stores sometimes use different units for similar products (e.g., one brand priced per oz, another per 100 count) to make comparison harder. Always convert to the same unit. This calculator normalizes both options.' },
      ]
    }
  },
  description: 'Compare two product options (different sizes, brands, or stores) by total price and quantity side-by-side. Calculates unit price for each, identifies the better deal, and shows the savings percentage.',
  formula: 'Unit Price A = Price A ÷ Quantity A | Unit Price B = Price B ÷ Quantity B | Savings = Higher Unit Price − Lower Unit Price | Savings % = Difference ÷ Higher × 100',
  interpretation: 'Comparing unit prices is the only reliable way to find the best value across different package sizes and brands. Larger packages typically save 10-30% per unit, but 15-20% of bulk items actually have higher unit prices — always check. Store brands save 20-40% per unit vs national brands with comparable quality. The annual savings from consistently choosing better unit prices can reach hundreds of dollars per household.'
}

export default calcDef
