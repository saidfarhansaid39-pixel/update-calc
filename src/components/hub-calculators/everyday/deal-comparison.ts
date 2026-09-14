import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ priceA: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), qtyA: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), priceB: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), qtyB: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'priceA', label: 'Option A Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'qtyA', label: 'Option A Quantity', type: 'number', min: 1, step: '1' },
    { name: 'priceB', label: 'Option B Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'qtyB', label: 'Option B Quantity', type: 'number', min: 1, step: '1' },
  ],
  defaults: { priceA: '8.99', qtyA: '16', priceB: '5.49', qtyB: '8' },
  presets: [
    { label: 'Pasta Sauce Jars', values: { priceA: '3.99', qtyA: '24', priceB: '5.49', qtyB: '32' } },
    { label: 'Laundry Detergent', values: { priceA: '12.99', qtyA: '64', priceB: '9.49', qtyB: '40' } },
    { label: 'Paper Towel Rolls', values: { priceA: '6.49', qtyA: '6', priceB: '18.99', qtyB: '24' } },
    { label: 'Bulk vs Single Coffee', values: { priceA: '15.99', qtyA: '32', priceB: '9.49', qtyB: '12' } },
  ],
  compute: (v) => {
    const unitPriceA = v.priceA / v.qtyA
    const unitPriceB = v.priceB / v.qtyB
    const betterDeal = unitPriceA <= unitPriceB ? 'A' : 'B'
    const worseDeal = unitPriceA > unitPriceB ? 'A' : 'B'
    const savingsPct = Math.abs(unitPriceA - unitPriceB) / Math.max(unitPriceA, unitPriceB) * 100
    const worsePrice = Math.max(unitPriceA, unitPriceB)
    const betterPrice = Math.min(unitPriceA, unitPriceB)
    const annualUsage = 50
    const annualSavings = (worsePrice - betterPrice) * annualUsage
    return { result: betterPrice, label: 'Best Unit Price', unit: '$ per unit', steps: [{ label: 'Option A Unit Price', value: `$${unitPriceA.toFixed(4)}/unit ($${v.priceA} ÷ ${v.qtyA})` }, { label: 'Option B Unit Price', value: `$${unitPriceB.toFixed(4)}/unit ($${v.priceB} ÷ ${v.qtyB})` }, { label: 'Better Deal', value: `Option ${betterDeal} is ${savingsPct.toFixed(1)}% cheaper per unit` }, { label: 'Price Ratio', value: `Option A costs ${(unitPriceA / unitPriceB).toFixed(2)}× Option B per unit` }, { label: 'If You Buy 50/yr', value: `Choose Option ${betterDeal} to save ~$${annualSavings.toFixed(2)}/year` }, { label: 'Shrinkflation Check', value: `Option ${worseDeal} costs $${worsePrice.toFixed(4)}/unit vs $${betterPrice.toFixed(4)}` }] ,
    extras: [
      { label: "Bulk Isn't Always Cheaper", value: "Large 'economy' sizes can cost more per unit. Always check the unit price on the shelf tag—stores know many shoppers assume bigger = cheaper." },
      { label: "Store Brand vs Name Brand", value: "Store brands are typically 15-30% cheaper per unit for identical ingredients. Most store brands are manufactured by the same companies as name brands." },
      { label: "Shrinkflation Alert", value: "Manufacturers often reduce package size (16 oz → 14.5 oz) while keeping the price the same. This is a 9-10% price increase hidden behind the same shelf price." },
      { label: "Coupon Stacking Check", value: "Run the unit price comparison with and without coupons. A $1-off coupon on a small package can make it cheaper per unit than the bulk size without a coupon." },
      { label: "Mental Math Shortcut", value: "Price per oz/lb ≈ price ÷ count. For items in oz: price ÷ (oz × 16) = price/lb. For items over 32 oz, double the price and divide by oz to approximate." },
      { label: "Sale Cycles", value: "Stock up when unit price hits its low point. Most non-perishables cycle to their lowest price every 6-12 weeks. Track prices with apps like Flipp or Basket." },
      { label: "Warehouse Club Trap", value: "Costco/Sam's Club membership ($60/yr) requires 5-10% savings on $600-1,200/yr of purchases to break even. Compare unit prices—club sizes aren't always best." },
      { label: "Per-Use Cost", value: "For some items (detergent, cleaning products), the quantity label (64 loads) can be misleading. Concentrated formulas may use less per load, making a smaller bottle cheaper." },
    ]}
  },
  description: 'Compare two products or package sizes by calculating their true unit price. Reveal which option delivers the best value, spot shrinkflation, and see how much you could save annually by consistently choosing the better deal.',
  formula: 'Unit Price = Price ÷ Quantity | Better Deal = Min(Unit A, Unit B) | Savings % = |Unit A − Unit B| ÷ Max(Unit A, Unit B) × 100',
  interpretation: 'Larger packages are not always cheaper per unit—a phenomenon known as the "bulk illusion." Store brands consistently beat name brands by 15-30% per unit despite identical manufacturing facilities. The biggest trap is shrinkflation: when package sizes silently shrink (16 oz → 14.5 oz) while prices hold steady, that\'s a hidden price increase of 9-10%. For items you buy weekly (laundry detergent, pasta, coffee), a consistent $0.02-0.05/unit savings can add up to $50-150/year per item.'
}

export default calcDef
