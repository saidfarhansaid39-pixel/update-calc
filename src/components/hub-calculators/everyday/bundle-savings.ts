import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ individualTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bundlePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bundleItems: z.string().min(1).refine(v => parseFloat(v) >= 2, '>=2') }),
  fields: [
    { name: 'individualTotal', label: 'Individual Total ($)', type: 'number', min: 1, step: '5' },
    { name: 'bundlePrice', label: 'Bundle Price ($)', type: 'number', min: 1, step: '5' },
    { name: 'bundleItems', label: 'Items in Bundle', type: 'number', min: 2, step: '1' },
  ],
  compute: (v) => {
    const savings = v.individualTotal - v.bundlePrice
    const savingsPct = (savings / v.individualTotal) * 100
    const perItemBundle = v.bundlePrice / v.bundleItems
    const perItemIndividual = v.individualTotal / v.bundleItems
    return { result: savings, label: 'Bundle Savings', unit: '$', steps: [{ label: 'Individual Items', value: `$${v.individualTotal.toFixed(2)}` }, { label: 'Bundle Price', value: `$${v.bundlePrice.toFixed(2)}` }, { label: 'You Save', value: `$${savings.toFixed(2)} (${savingsPct.toFixed(1)}%)` }, { label: 'Per Item (bundle)', value: `$${perItemBundle.toFixed(2)} vs $${perItemIndividual.toFixed(2)}` }] }
  },
  description: 'Determine how much you save by buying a bundle versus purchasing items individually. Compare per-item costs across both options.',
  formula: 'Savings = Individual Total - Bundle Price | Savings% = (Savings / Individual) × 100',
  interpretation: 'Bundles typically save 10-30% vs individual purchase. Beware of bundles with items you don\'t need — a deal is only a deal if you use everything. Check per-unit pricing.'
}

export default calcDef
