import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ incomes: z.string().min(1, 'Required') }),
  fields: [{ name: 'incomes', label: 'Income Values (comma separated, >0)', type: 'number', step: 'any' }],
  compute: (v) => { const vals = parseList(v.incomes).filter(x => x >= 0).sort((a, b) => a - b); if (vals.length < 2) return { result: 'Need ≥2 values', label: '', unit: '', steps: [] ,
    extras: [
      { label: "Assumption check", value: "Verify your data meets the assumptions of this test before drawing conclusions." },
      { label: "Sample size note", value: "Larger samples provide more reliable estimates." },
      { label: "Effect size", value: "Consider reporting effect size alongside p-value for complete interpretation." }
    ]}; const total = vals.reduce((a, b) => a + b, 0); const n = vals.length; let cum = 0; const points = vals.map((x, i) => { cum += x; return `(${((i + 1) / n * 100).toFixed(1)}%,${(cum / total * 100).toFixed(1)}%)` }); return { result: points.join(' '), label: 'Lorenz Curve Points', unit: '', steps: [{ label: 'N', value: `${n}` }, { label: 'Bottom 20% share', value: `${(vals.slice(0, Math.max(1, Math.floor(n * 0.2))).reduce((a, b) => a + b, 0) / total * 100).toFixed(1)}%` }, { label: 'Top 20% share', value: `${(vals.slice(Math.floor(n * 0.8)).reduce((a, b) => a + b, 0) / total * 100).toFixed(1)}%` }] } },
  description: 'The Lorenz curve plots the cumulative share of income against the cumulative share of the population, ordered by income.',
  formula: 'L(p) = cumulative income share of bottom p% of population',
  interpretation: 'The 45° line represents perfect equality. The area between the curve and the line is the Gini coefficient.'
}

export default calcDef
