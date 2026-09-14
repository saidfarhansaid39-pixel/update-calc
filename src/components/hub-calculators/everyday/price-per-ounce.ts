import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ounces: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalPrice', label: 'Total Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'ounces', label: 'Net Weight (oz)', type: 'number', min: 0.1, step: '1' },
  ],
  defaults: { totalPrice: '5.99', ounces: '16' },
  presets: [
    { label: '16 oz Coffee Beans', values: { totalPrice: '12.99', ounces: '16' } },
    { label: '4 oz Artisan Cheese', values: { totalPrice: '7.99', ounces: '4' } },
    { label: '32 oz Yogurt Tub', values: { totalPrice: '6.49', ounces: '32' } },
    { label: '2 oz Spice Jar', values: { totalPrice: '4.99', ounces: '2' } },
  ],
  compute: (v) => {
    const perOz = v.totalPrice / v.ounces
    const perLb = perOz * 16
    const per100ml = perOz * 3.3814
    return { result: perOz, label: 'Price per Ounce', unit: '$/oz',
      steps: [
        { label: 'Total Price', value: `$${v.totalPrice.toFixed(2)}` },
        { label: 'Net Weight', value: `${v.ounces} oz (${(v.ounces / 16).toFixed(2)} lb)` },
        { label: 'Price per Ounce', value: `$${v.totalPrice.toFixed(2)} ÷ ${v.ounces} = $${perOz.toFixed(4)}/oz` },
        { label: 'Price per Pound', value: `$${perOz.toFixed(4)} × 16 = $${perLb.toFixed(2)}/lb` },
        { label: 'Price per 100 mL', value: `≈ $${per100ml.toFixed(2)} (for liquids)` },
        { label: 'Daily-use Cost (1 oz)', value: `$${perOz.toFixed(2)}/day` },
        { label: 'Monthly Cost (if used daily)', value: `$${(perOz * 30).toFixed(2)}/mo` },
        { label: 'Value Rating', value: perOz < 0.20 ? 'Excellent value' : perOz < 0.50 ? 'Good value' : perOz < 1.00 ? 'Moderate' : perOz < 3.00 ? 'Premium' : 'Luxury pricing' },
      ],
      extras: [
        { label: '📏 Ounce vs Fluid Ounce', value: 'Weight ounces (oz) measure mass. Fluid ounces (fl oz) measure volume. For water, 1 fl oz ≈ 1 oz. For oil (lighter), 1 fl oz ≈ 0.92 oz. For honey (heavier), 1 fl oz ≈ 1.5 oz.' },
        { label: '🏪 Shrinkflation Alert', value: 'Manufacturers often reduce package size (e.g., 16 oz → 14.5 oz) while keeping price the same. The per-ounce price catches this immediately. Check after every package redesign.' },
        { label: '🧴 Toiletries Pricing', value: 'Shampoo/conditioner averages $0.30-0.80/oz. Body wash: $0.25-0.60/oz. Lotion: $0.40-1.50/oz. Concentrated products may cost more per oz but last longer because you use less.' },
        { label: '🧀 Cheese Pricing Guide', value: 'Cheese per oz: Cheddar $0.30-0.50, Swiss $0.40-0.60, Parmesan $0.50-0.80, Artisan/Gourmet $1.00-3.00. Pre-shredded cheese costs 15-25% more per oz than block.' },
        { label: '☕ Coffee Cost per Cup', value: 'A 16 oz bag of coffee ($12.99) makes about 32 cups. Per-ounce price: $0.81. Per-cup cost: $0.41. Single-serve pods cost $0.50-0.80/cup — double the per-ounce price of ground.' },
        { label: '💵 The "Family Size" Trap', value: 'A "family size" (32 oz) item might cost $8.99 ($0.28/oz) vs regular (16 oz) at $4.99 ($0.31/oz). But if you waste half, effective cost doubles to $0.56/oz — worse than buying the smaller size.' },
        { label: '📊 Unit Price Labels Explained', value: 'US grocery stores are required to display unit price (price per oz, lb, or 100 count) on shelf labels. The smallest unit price is usually the best value — but only if you\'ll use the entire product.' },
        { label: '🔢 Quick Mental Math', value: 'To estimate per-oz price: round total to nearest dollar, divide by oz rounded down. Example: $5.99 ≈ $6, 16 oz → $6/16 = $0.37/oz. Actual: $0.37. Pretty close!' },
      ]
    }
  },
  description: 'Calculate the price per ounce of any product — groceries, toiletries, spices, and more. Includes per-pound and per-100mL conversions, daily cost estimates, and value ratings.',
  formula: 'Price/oz = Total Price ÷ Net Weight (oz) | Price/lb = Price/oz × 16 | For liquids: Price/100mL = Price/oz × 3.3814',
  interpretation: 'Price per ounce is the most common unit price for groceries and toiletries in the US. Use it to catch "shrinkflation" (smaller packages, same price). Store brands typically cost 20-30% less per ounce than national brands with comparable quality. Concentrated products (laundry detergent, cleaners) may cost more per ounce but require less per use — compare per-load or per-serving cost instead. Always check the unit price shelf label before buying.'
}

export default calcDef
