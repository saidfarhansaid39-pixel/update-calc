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
    const removed = v.totalItems - keep
    const freedPct = (removed / v.totalItems) * 100
    return { result: removed, label: 'Items to Remove', unit: '', steps: [{ label: 'Keep', value: `${keep} items (${v.keepPct}%)` }, { label: 'Donate/Sell', value: `${donate} items` }, { label: 'Toss/Recycle', value: `${toss} items` }, { label: 'Space Freed', value: `${freedPct.toFixed(0)}% decluttered` }] }
  },
  description: 'Plan your decluttering project: categorize items by keep, donate, and toss percentages. See how much space you will free up.',
  formula: 'Each category = Total Items × Category%',
  interpretation: 'The KonMari method suggests keep only items that spark joy. A 50% keep rate is typical for a first pass. Donated items may qualify for tax deductions ($0.10-1.00 per item).'
}

export default calcDef
