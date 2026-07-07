import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bsplTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bsplPeople: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), bsplTipPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bsplTaxPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bsplRoundUp: z.string().min(1) }),
  fields: [
    { name: 'bsplTotal', label: 'Bill Total ($)', type: 'number', min: 1, step: '10' },
    { name: 'bsplPeople', label: 'Number of People', type: 'number', min: 1, step: '1' },
    { name: 'bsplTipPct', label: 'Tip (%)', type: 'number', min: 0, max: 30, step: '1' },
    { name: 'bsplTaxPct', label: 'Tax Rate (%)', type: 'number', min: 0, max: 15, step: '0.5' },
    { name: 'bsplRoundUp', label: 'Round Up', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  compute: (v) => {
    const tax = v.bsplTotal * (v.bsplTaxPct / 100)
    const subtotal = v.bsplTotal + tax
    const tip = subtotal * (v.bsplTipPct / 100)
    const total = subtotal + tip
    let perPerson = total / v.bsplPeople
    if (v.bsplRoundUp === 'yes') { perPerson = Math.ceil(perPerson * 100) / 100 }
    return { result: perPerson, label: 'Per Person', unit: '$', steps: [{ label: 'Subtotal', value: '$' + v.bsplTotal.toFixed(2) }, { label: 'Tax', value: '$' + tax.toFixed(2) }, { label: 'Tip', value: '$' + tip.toFixed(2) }, { label: 'Total', value: '$' + total.toFixed(2) }, { label: 'Split ' + v.bsplPeople + ' Ways', value: '$' + perPerson.toFixed(2) + ' each' }] }
  },
  description: 'Split any bill evenly among a group including tax, tip, and optional round-up for convenience.',
  formula: 'Per Person = (Bill + Tax + Tip) / People | Round up to nearest cent if selected',
  interpretation: 'Standard tip: 15-20% pre-tax. Tax varies by location (0-13%). Splitting evenly is fair when everyone consumes roughly equal amounts. For uneven orders, use itemized splitting.'
}

export default calcDef
