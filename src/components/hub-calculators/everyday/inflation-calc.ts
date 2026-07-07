import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ amount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), inflationRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), years: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'amount', label: 'Current Amount ($)', type: 'number', min: 1, step: '100' },
    { name: 'inflationRate', label: 'Annual Inflation Rate (%)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'years', label: 'Number of Years', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const a = parseFloat(v.amount)||0; const ir = parseFloat(v.inflationRate)||0 / 100; const y = parseFloat(v.years)||0; const adjusted = a * Math.pow(1 + ir, y); const lost = adjusted - a; return { result: adjusted, label: 'Future Value (Inflated)', unit: '$', steps: [{ label: 'Current Value', value: `$${a.toFixed(2)}` }, { label: 'Future Value Needed', value: `$${adjusted.toFixed(2)}` }, { label: 'Purchasing Power Lost', value: `$${lost.toFixed(2)}` }] } },
  description: 'Calculate how inflation erodes purchasing power over time. See what future dollars will be worth compared to today.',
  formula: 'Future Value = Present × (1 + Rate)^Years',
  interpretation: 'Historical avg inflation: ~3.2%/year (1913-2025). At 3% inflation, $100 becomes $134 in 10 years (need $134 to buy what $100 buys today). The Fed targets 2% annual inflation.'
}

export default calcDef
