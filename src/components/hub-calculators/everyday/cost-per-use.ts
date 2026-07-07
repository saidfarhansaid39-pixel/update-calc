import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ itemPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), uses: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yearsOwned: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'itemPrice', label: 'Item Price ($)', type: 'number', min: 1, step: '5' },
    { name: 'uses', label: 'Uses per Year', type: 'number', min: 1, step: '1' },
    { name: 'yearsOwned', label: 'Years Owned', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const totalUses = v.uses * v.yearsOwned
    const cpu = v.itemPrice / totalUses
    return { result: cpu, label: 'Cost per Use', unit: '$', steps: [{ label: 'Total Uses', value: `${totalUses}` }, { label: 'Cost per Use', value: `$${cpu.toFixed(2)}` }] }
  },
  description: 'Evaluate purchases by calculating the cost per use over the item lifetime. Make smarter buying decisions by comparing cost-per-use across alternatives.',
  formula: 'Cost per Use = Item Price / (Uses/Year × Years)',
  interpretation: 'High-quality items with higher upfront cost often have lower cost-per-use. Apply this to: clothing, appliances, tools, electronics. A $200 coat worn 100 times/yr for 5 years = $0.40/use.'
}

export default calcDef
