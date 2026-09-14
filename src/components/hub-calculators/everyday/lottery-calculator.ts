import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ jackpot: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lumpSumPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), federalRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), stateRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ticketCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ticketsBought: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  defaults: { jackpot: '100000000', lumpSumPct: '62', federalRate: '37', stateRate: '5', ticketCost: '2', ticketsBought: '1' },
  presets: [
    { label: 'Powerball $500M', values: { jackpot: '500000000', lumpSumPct: '62', federalRate: '37', stateRate: '4', ticketCost: '2', ticketsBought: '1' } },
    { label: 'Mega Millions $100M', values: { jackpot: '100000000', lumpSumPct: '60', federalRate: '37', stateRate: '0', ticketCost: '2', ticketsBought: '1' } },
    { label: 'Annuity Comparison', values: { jackpot: '200000000', lumpSumPct: '65', federalRate: '37', stateRate: '8.82', ticketCost: '2', ticketsBought: '1' } },
  ],
  fields: [
    { name: 'jackpot', label: 'Jackpot Amount ($)', type: 'number', min: 1000000, step: '1000000' },
    { name: 'lumpSumPct', label: 'Lump Sum % (typically 60-65)', type: 'number', min: 0, step: '5' },
    { name: 'federalRate', label: 'Federal Tax Rate (%)', type: 'number', min: 0, step: '5' },
    { name: 'stateRate', label: 'State Tax Rate (%)', type: 'number', min: 0, step: '2' },
    { name: 'ticketCost', label: 'Ticket Cost ($)', type: 'number', min: 0, step: '1' },
    { name: 'ticketsBought', label: 'Tickets Bought', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const J = parseFloat(v.jackpot)||0; const L = parseFloat(v.lumpSumPct)||0; const F = parseFloat(v.federalRate)||0; const S = parseFloat(v.stateRate)||0; const T = parseFloat(v.ticketCost)||0; const B = parseFloat(v.ticketsBought)||1; const lumpSum = J * (L / 100); const federalTax = lumpSum * (F / 100); const stateTax = lumpSum * (S / 100); const afterTax = lumpSum - federalTax - stateTax; const spent = T * B; const net = afterTax - spent; const annual30 = net / 30; const annuityAnnual = J / 30; return { result: afterTax, label: 'After-Tax Lump Sum', unit: '$', steps: [
    { label: '1. Advertised Jackpot', value: `$${(J / 1000000).toFixed(0)}M (annuity over 30 years)` },
    { label: '2. Lump Sum Option', value: `$${J.toFixed(0)} × ${L}% = $${lumpSum.toFixed(0)}` },
    { label: '3. Federal Tax', value: `$${lumpSum.toFixed(0)} × ${F}% = -$${federalTax.toFixed(0)}` },
    { label: '4. State Tax', value: `$${lumpSum.toFixed(0)} × ${S}% = -$${stateTax.toFixed(0)}` },
    { label: '5. Net Lump Sum', value: `$${lumpSum.toFixed(0)} - $${federalTax.toFixed(0)} - $${stateTax.toFixed(0)} = $${afterTax.toFixed(0)}` },
    { label: '6. Ticket Cost', value: `$${T} × ${B} ticket${B > 1 ? 's' : ''} = -$${spent.toFixed(0)}` },
    { label: '7. Annual Annuity >', value: `$${(annuityAnnual / 1000000).toFixed(1)}M/yr before tax, ~$${(annual30 / 1000000).toFixed(1)}M/yr after tax` },
  ] ,
    extras: [
      { label: 'Annuity vs Lump Sum', value: 'Annuity pays over 30 years with 5% annual increases. Lump sum is ~60-65% of advertised. Most financial advisors recommend annuity for guaranteed income.' },
      { label: 'Federal Tax Brackets', value: 'Top federal bracket is 37% for income over $578,125. However, the IRS withholds only 24% upfront — you owe the rest at filing. Set aside 13%+.' },
      { label: 'State Tax Varies', value: 'No state tax: TX, FL, WA, NV, SD, WY, TN. Highest: NY 10.9%, NJ 10.75%, DC 10.75%, OR 9.9%. CA 13.3% on interest/dividends.' },
      { label: 'Lump Sum Math', value: 'Lump sum is the present value of future payments discounted at current interest rates. When rates are high (2023-24), lump sum % drops to 55-60%.' },
      { label: 'Payout Options', value: 'You can choose cash lump sum or annuity within 60 days of claiming. Once chosen, it\'s irrevocable. Some states allow changing annuity to lump sum later.' },
      { label: 'Anonymous Claiming', value: 'Only 11 states allow anonymous lottery claims. In others, your name, city, and prize amount become public record. Form a trust or LLC to claim.' },
      { label: 'Financial Planning', value: 'Most winners go bankrupt within 5 years. First steps: assemble a team (lawyer, accountant, financial advisor). Don\'t tell anyone. Wait 6 months before major purchases.' },
      { label: 'Lump Sum Investing', value: 'A $100M jackpot → ~$37M after tax. Invested at 7% returns ~$2.6M/year. Withdraw 4% = $1.5M/year indefinitely. You can\'t outspend that without trying.' },
    ]} },
  description: 'Calculate lottery winnings after federal and state taxes, comparing lump sum payout to actual take-home amount. Includes financial planning and claiming guidance.',
  formula: 'Net = [Jackpot × (LumpSum%/100)] × (1 - Fed%/100 - State%/100) - (Ticket × Tickets). Annuity Annual = Jackpot / 30.',
  interpretation: 'Top federal bracket is 37%. State rates vary from 0% (TX, FL, WA, NV) to 10.9% (NY). Most winners take lump sum (~60-65% of advertised). A $100M jackpot yields ~$37M after tax. Financial advisors recommend annuity for spending discipline. Set up a trust before claiming to protect your identity.'
}

export default calcDef
