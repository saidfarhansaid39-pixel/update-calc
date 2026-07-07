import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ jackpot: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lumpSumPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), federalRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), stateRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ticketCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ticketsBought: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'jackpot', label: 'Jackpot Amount ($)', type: 'number', min: 1000000, step: '1000000' },
    { name: 'lumpSumPct', label: 'Lump Sum % (typically 60-65)', type: 'number', min: 0, step: '5' },
    { name: 'federalRate', label: 'Federal Tax Rate (%)', type: 'number', min: 0, step: '5' },
    { name: 'stateRate', label: 'State Tax Rate (%)', type: 'number', min: 0, step: '2' },
    { name: 'ticketCost', label: 'Ticket Cost ($)', type: 'number', min: 0, step: '1' },
    { name: 'ticketsBought', label: 'Tickets Bought', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const lumpSum = v.jackpot * (v.lumpSumPct / 100); const federalTax = lumpSum * (v.federalRate / 100); const stateTax = lumpSum * (v.stateRate / 100); const afterTax = lumpSum - federalTax - stateTax; const spent = v.ticketCost * v.ticketsBought; const net = afterTax - spent; const annual30 = net / 30; return { result: afterTax, label: 'After-Tax Lump Sum', unit: '$', steps: [{ label: 'Jackpot', value: `$${v.jackpot.toFixed(0)}` }, { label: 'Lump Sum (est.)', value: `$${lumpSum.toFixed(0)}` }, { label: 'Federal Tax', value: `-$${federalTax.toFixed(0)} (${v.federalRate}%)` }, { label: 'State Tax', value: `-$${stateTax.toFixed(0)} (${v.stateRate}%)` }, { label: 'Net After Tax', value: `$${afterTax.toFixed(0)}` }, { label: 'Annual Income (30yr)', value: `$${annual30.toFixed(0)}/yr` }] } },
  description: 'Calculate lottery winnings after federal and state taxes, comparing lump sum payout to actual take-home amount.',
  formula: 'Net = Jackpot × (LumpSum%/100) × (1 − Fed%/100 − State%/100) − (Ticket Cost × Tickets)',
  interpretation: 'Top federal bracket is 37%. State rates vary from 0-10.9%. Most winners take lump sum (about 60-65% of advertised jackpot). Financial advisors recommend annuity for most winners.'
}

export default calcDef
