import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), totalUnits: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalPrice', label: 'Total Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'totalUnits', label: 'Number of Units', type: 'number', min: 1, step: '1' },
  ],
  defaults: { totalPrice: '12.99', totalUnits: '24' },
  presets: [
    { label: '24-Pack Bottled Water', values: { totalPrice: '5.99', totalUnits: '24' } },
    { label: '36-Pack Toilet Paper', values: { totalPrice: '28.99', totalUnits: '36' } },
    { label: '12 Eggs (1 Dozen)', values: { totalPrice: '4.79', totalUnits: '12' } },
    { label: '100 Bulk Tea Bags', values: { totalPrice: '9.99', totalUnits: '100' } },
  ],
  compute: (v) => {
    const perUnit = v.totalPrice / v.totalUnits
    return { result: perUnit, label: 'Price per Unit', unit: '$/unit',
      steps: [
        { label: 'Total Package Price', value: `$${v.totalPrice.toFixed(2)}` },
        { label: 'Units in Package', value: `${v.totalUnits}` },
        { label: 'Price per Unit Formula', value: `$${v.totalPrice.toFixed(2)} ÷ ${v.totalUnits} = $${perUnit.toFixed(4)}` },
        { label: 'Rounded Price per Unit', value: `$${perUnit.toFixed(2)} ($${perUnit.toFixed(4)} exact)` },
        { label: 'Price per 10 Units', value: `$${(perUnit * 10).toFixed(2)}` },
        { label: 'Price per 100 Units', value: `$${(perUnit * 100).toFixed(2)}` },
        { label: 'Unit Savings Reference', value: perUnit < 0.50 ? 'Great deal — under $0.50/unit' : perUnit < 1.00 ? 'Reasonable — under $1.00/unit' : 'Premium pricing — over $1.00/unit' },
        { label: 'Compare to Single', value: `$${v.totalPrice} ÷ ${v.totalUnits} = $${perUnit.toFixed(2)} each` },
      ],
      extras: [
        { label: '📦 Bulk Savings Reality', value: 'Multi-pack savings range from 5-30% per unit compared to single items. However, 30-40% of bulk purchases are wasted if items expire before use. Only buy bulk for non-perishables.' },
        { label: '🏪 Store Brand vs Name Brand', value: 'Store brands typically cost 20-30% less per unit than national brands. For many staples (sugar, flour, salt), the quality difference is negligible — you\'re paying for packaging and marketing.' },
        { label: '🔄 Subscribe & Save Trap', value: 'Amazon Subscribe & Save offers 5-15% per-unit savings, but 60% of subscribers forget to cancel unused subscriptions. The convenience markup on auto-delivery often exceeds the savings.' },
        { label: '💰 The "Bulk" Illusion', value: 'Some "value packs" have worse per-unit pricing than regular sizes. Always check the unit price label on store shelves. US law requires unit pricing in most grocery stores.' },
        { label: '📐 Size Matters — Literally', value: 'A 32-oz jar may cost less than 16 oz but check per-unit price. Manufacturers sometimes use "shrinkflation" — same price, less product. The per-unit price catches this.' },
        { label: '♻️ Packaging Waste Factor', value: 'Bulk items use 40-60% less packaging per unit than individually wrapped items. Better for the environment and your wallet. But only if you\'ll use everything before expiry.' },
        { label: '🎯 Buy in Bulk Strategically', value: 'Best bulk candidates: rice, pasta, cleaning supplies, toilet paper, pet food, diapers. Worst: spices, fresh produce, condiments (expire before use), specialty items.' },
        { label: '📊 Price Tracking Apps', value: 'Use apps like Basket, Flipp, or Yucaipa to compare unit prices across stores. The same item can cost 2× more at a convenience store vs warehouse club per unit.' },
      ]
    }
  },
  description: 'Calculate price per unit for multi-pack and bulk items. Compare value across different package sizes with per-unit pricing breakdown and savings analysis.',
  formula: 'Price per Unit = Total Price ÷ Number of Units. Example: $12.99 ÷ 24 units = $0.54/unit. Lower unit price = better value, assuming you\'ll use all items before expiration.',
  interpretation: 'Multi-pack savings typically range from 5-30% per unit compared to single items. However, beware of "shrinkflation" — manufacturers reducing package size while keeping the price the same. Always check the unit price label on store shelves. Best bulk buys are non-perishable staples. Perishable items in bulk can lead to waste — 30-40% of bulk food purchases are thrown away. Store brands often deliver the same quality for 20-30% less per unit.'
}

export default calcDef
