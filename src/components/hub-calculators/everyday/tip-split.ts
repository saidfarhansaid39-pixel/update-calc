import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tpsTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tpsTipPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tpsPeople: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), tpsRoundUp: z.string().min(1) }),
  fields: [
    { name: 'tpsTotal', label: 'Bill Total ($)', type: 'number', min: 1, step: '10' },
    { name: 'tpsTipPct', label: 'Tip Percentage (%)', type: 'number', min: 0, max: 30, step: '1' },
    { name: 'tpsPeople', label: 'Number of People', type: 'number', min: 1, step: '1' },
    { name: 'tpsRoundUp', label: 'Round Up to Even Split', type: 'select', options: [{ label: 'No (exact split)', value: 'no' }, { label: 'Yes (round up per person)', value: 'yes' }] },
  ],
  compute: (v) => {
    const tipAmount = v.tpsTotal * (v.tpsTipPct / 100)
    const totalWithTip = v.tpsTotal + tipAmount
    let perPerson = totalWithTip / v.tpsPeople
    if (v.tpsRoundUp === 'yes') { perPerson = Math.ceil(perPerson * 20) / 20 }
    return { result: perPerson, label: 'Per Person (with tip)', unit: '$', steps: [{ label: 'Tip Amount', value: v.tpsTipPct + '% = $' + tipAmount.toFixed(2) }, { label: 'Total (bill+tip)', value: '$' + totalWithTip.toFixed(2) }, { label: 'Split', value: v.tpsPeople + ' ways' }, { label: 'Per Person', value: '$' + perPerson.toFixed(2) }] }
  },
  description: 'Split a bill including tip evenly among a group. Option to round up per person for convenience.',
  formula: 'Per Person = (Bill + Bill x Tip%) / People | Round up to nearest $0.05 if selected',
  interpretation: 'Splitting evenly is simplest when everyone ordered similarly. For uneven orders, use proportional splitting. Rounding up $0.05-0.25 per person is common for convenience and gives a slightly larger tip.'
}

export default calcDef
