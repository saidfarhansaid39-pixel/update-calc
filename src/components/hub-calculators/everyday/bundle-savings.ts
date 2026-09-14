import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ individualTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bundlePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bundleItems: z.string().min(1).refine(v => parseFloat(v) >= 2, '>=2') }),
  fields: [
    { name: 'individualTotal', label: 'Individual Total ($)', type: 'number', min: 1, step: '5' },
    { name: 'bundlePrice', label: 'Bundle Price ($)', type: 'number', min: 1, step: '5' },
    { name: 'bundleItems', label: 'Items in Bundle', type: 'number', min: 2, step: '1' },
  ],
  defaults: { individualTotal: '60', bundlePrice: '40', bundleItems: '3' },
  presets: [
    { label: 'Streaming Bundle', values: { individualTotal: '45', bundlePrice: '30', bundleItems: '3' } },
    { label: 'Software Suite', values: { individualTotal: '120', bundlePrice: '80', bundleItems: '4' } },
    { label: 'Meal Combo Deal', values: { individualTotal: '18', bundlePrice: '13', bundleItems: '3' } },
    { label: 'Gaming Collection', values: { individualTotal: '200', bundlePrice: '120', bundleItems: '5' } },
  ],
  compute: (v) => {
    const savings = v.individualTotal - v.bundlePrice
    const savingsPct = v.individualTotal > 0 ? (savings / v.individualTotal) * 100 : 0
    const perItemBundle = v.bundleItems > 0 ? v.bundlePrice / v.bundleItems : 0
    const perItemIndividual = v.bundleItems > 0 ? v.individualTotal / v.bundleItems : 0
    const perItemSavings = perItemIndividual - perItemBundle
    const bundleValueRatio = v.individualTotal > 0 ? v.bundlePrice / v.individualTotal : 0
    return {
      result: savings, label: 'Bundle Savings', unit: '$',
      steps: [
        { label: 'Individual Purchase Total', value: `$${v.individualTotal.toFixed(2)}` },
        { label: 'Bundle Price', value: `$${v.bundlePrice.toFixed(2)}` },
        { label: 'Items in Bundle', value: `${v.bundleItems}` },
        { label: 'Per-Item (Individual)', value: `$${perItemIndividual.toFixed(2)} each` },
        { label: 'Per-Item (Bundle)', value: `$${perItemBundle.toFixed(2)} each` },
        { label: 'Savings Per Item', value: `$${perItemSavings.toFixed(2)} each` },
        { label: 'Total Savings', value: `$${savings.toFixed(2)}` },
        { label: 'Savings Percentage', value: `${savingsPct.toFixed(1)}% | You pay ${(bundleValueRatio * 100).toFixed(0)}% of individual price` },
      ],
      extras: [
        { label: 'Bundle Value Threshold', value: 'A good bundle saves at least 20% vs individual pricing. Excellent bundles save 40%+. Premade bundles often include filler items — check if you need everything.' },
        { label: 'The Sunken Cost Trap', value: 'Bundles are only a deal if you use all items. A $100 bundle where you only use 60% of items has an effective cost of $167 for what you actually need.' },
        { label: 'Custom Bundle Strategy', value: 'Some retailers (e.g., Subway, Chipotle) let you build your own bundle. Compare build-your-own vs pre-made bundles to ensure you get the best value.' },
        { label: 'Software Bundles & Bloatware', value: 'Software bundles often include trials or limited versions. Check if each item provides full functionality. Unused software subscriptions from bundles still have renewal risk.' },
        { label: 'Loss Leader Bundles', value: 'Retailers sometimes bundle a popular item with slow-movers to clear inventory. The popular item alone may be cheaper at another store — verify individual prices.' },
        { label: 'Annual vs Monthly Bundles', value: 'Annual subscriptions often bundle 12 months for the price of 10. Calculate the effective monthly cost: annual price ÷ 12 vs monthly price. Typical annual savings: 15-25%.' },
        { label: 'Return Policy Check', value: 'Bundle return policies vary: some require returning all items for a refund, others allow partial returns at individual item prices. Check before buying — if a bundled item is defective, you may lose the bundle discount.' },
        { label: 'Cashback and Rewards', value: 'Stack bundle savings with cashback apps (Rakuten, Honey) and credit card rewards. Some cards offer 5% back on bundle purchases via shopping portals, adding another 3-5% savings.' },
      ]
    }
  },
  description: 'Determine how much you save by buying a bundle versus purchasing items individually. Compare per-item costs across both options to make informed purchasing decisions.',
  formula: 'Savings = Individual Total - Bundle Price | Savings% = (Savings / Individual) × 100 | Per-Item Bundle = Bundle Price / Items',
  interpretation: 'Bundles typically save 10-30% vs individual purchase. Beware of bundles with items you don\'t need — a deal only saves money if you use everything in it. Always check per-item pricing and compare with alternative retailers.'
}

export default calcDef
