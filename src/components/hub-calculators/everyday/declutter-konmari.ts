import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalItems: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), keepPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), donatePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tossPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'totalItems', label: 'Total Items Counted', type: 'number', min: 1, step: '10' },
    { name: 'keepPct', label: 'Keep (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'donatePct', label: 'Donate/Sell (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'tossPct', label: 'Toss/Recycle (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => {
    const keep = Math.round(v.totalItems * (v.keepPct / 100))
    const donate = Math.round(v.totalItems * (v.donatePct / 100))
    const toss = Math.round(v.totalItems * (v.tossPct / 100))
    const total = keep + donate + toss
    const sparkJoy = keep
    const released = donate + toss
    return { result: sparkJoy, label: 'Items That Spark Joy', unit: '', steps: [{ label: 'Total Inventory', value: `${v.totalItems} items` }, { label: 'Keep (Sparks Joy)', value: `${keep} items (${v.keepPct}%)` }, { label: 'Donate/Sell', value: `${donate} items (${v.donatePct}%)` }, { label: 'Toss/Recycle', value: `${toss} items (${v.tossPct}%)` }, { label: 'Decluttered', value: `${released} items released` }] }
  },
  description: 'Apply the KonMari decluttering method to your belongings. Categorize items into keep, donate, and toss to simplify your space.',
  formula: 'Keep (Spark Joy) = Total × Keep% | Donate + Toss = Total × (Donate% + Toss%)',
  interpretation: 'The KonMari Method by Marie Kondo: declutter by category (clothing, books, papers, komono, sentimental) not by location. Keep only what sparks joy. Thank each item before releasing it. Typical result: discard 60-70% of belongings.'
}

export default calcDef
