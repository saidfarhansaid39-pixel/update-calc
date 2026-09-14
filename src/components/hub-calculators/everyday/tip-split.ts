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
  defaults: { tpsTotal: '75', tpsTipPct: '18', tpsPeople: '4', tpsRoundUp: 'no' },
  presets: [
    { label: 'Dinner for 4 ($85)', values: { tpsTotal: '85', tpsTipPct: '18', tpsPeople: '4', tpsRoundUp: 'no' } },
    { label: 'Large Group (8 people)', values: { tpsTotal: '320', tpsTipPct: '20', tpsPeople: '8', tpsRoundUp: 'yes' } },
    { label: 'Date Night ($60)', values: { tpsTotal: '60', tpsTipPct: '20', tpsPeople: '2', tpsRoundUp: 'no' } },
    { label: 'Business Lunch (3 people)', values: { tpsTotal: '120', tpsTipPct: '15', tpsPeople: '3', tpsRoundUp: 'yes' } },
  ],
  compute: (v) => {
    const tipAmount = v.tpsTotal * (v.tpsTipPct / 100)
    const totalWithTip = v.tpsTotal + tipAmount
    let perPerson = totalWithTip / v.tpsPeople
    if (v.tpsRoundUp === 'yes') { perPerson = Math.ceil(perPerson * 20) / 20 }
    return { result: perPerson, label: 'Per Person (with tip)', unit: '$', steps: [
      { label: 'Formula', value: 'Per Person = (Bill + Bill × Tip%) ÷ People' },
      { label: 'Tip Amount', value: v.tpsTipPct + '% of $' + v.tpsTotal.toFixed(2) + ' = $' + tipAmount.toFixed(2) },
      { label: 'Total with Tip', value: '$' + v.tpsTotal.toFixed(2) + ' + $' + tipAmount.toFixed(2) + ' = $' + totalWithTip.toFixed(2) },
      { label: 'Split', value: v.tpsPeople + ' ways' },
      { label: 'Per Person', value: '$' + totalWithTip.toFixed(2) + ' ÷ ' + v.tpsPeople + ' = $' + perPerson.toFixed(2) + (v.tpsRoundUp === 'yes' ? ' (rounded to $0.05)' : ' (exact)') },
    ] ,
    extras: [
      { label: 'Standard Tips', value: 'Restaurant: 15-20% pre-tax. Large parties (6+): 18-20% auto-gratuity often added. Always check the bill first' },
      { label: 'Round Up Etiquette', value: 'Rounding up to the nearest $0.25-1.00 per person is common and gives the server a small bonus. It\'s not required but appreciated' },
      { label: 'Uneven Splits', value: 'If one person ordered an appetizer or more drinks, use proportional split instead. This calculator does even split only' },
      { label: 'Tax Treatment', value: 'Tip on the pre-tax amount. Some suggest tipping on post-tax — it\'s a personal choice, not a rule. Servers pay tax on 8-10% of sales' },
      { label: 'Credit Card Fees', value: 'Restaurants pay 2-4% in CC processing fees. Cash tips ensure 100% goes to the server. Some restaurants deduct CC fees from tips' },
      { label: 'Tip Pooling', value: 'Many restaurants pool tips and redistribute. Your 20% tip may be shared with bussers, bartenders, and hosts' },
      { label: 'Tip Jars & Apps', value: 'Coffee shops: $0.50-1.00 or round up. Food delivery apps default to 15-20% — lower the tip if service is subpar' },
      { label: 'No-Tip Culture', value: 'Some restaurants (especially NYC/Bay Area) are going no-tip with higher menu prices to pay living wages. No tip expected' },
    ]}
  },
  description: 'Split a restaurant bill including tip evenly among any group size. Option to round up per person to the nearest $0.05 for convenience. Perfect for group dinners, business lunches, and celebrations.',
  formula: 'Per Person = (Bill Total + Bill Total × Tip%) ÷ Number of People. With rounding: ceil(Per Person × 20) ÷ 20 (rounds up to nearest $0.05). Example: $85 bill, 18% tip, 4 people = ($85 + $15.30) ÷ 4 = $25.08/person.',
  interpretation: 'Splitting evenly is the simplest and most common method for group dining. An $85 bill with 18% tip ($15.30) totals $100.30 — each of 4 people pays $25.08. Rounding up to $25.25/person gives the server an extra $0.68. For groups with wildly different orders, consider proportional splitting or just dividing by who ordered what.'
}

export default calcDef
