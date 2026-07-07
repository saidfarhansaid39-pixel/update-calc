import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ratio: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n <= 1 }, '0-1') }),
  fields: [{ name: 'ratio', label: 'Remaining C-14 Fraction N/N₀', type: 'number', unit: '', min: 0.001, max: 1, step: '0.01' }],
  compute: (v) => { const halfLife = 5730 * 365.25 * 24 * 3600; const lambda = Math.LN2 / halfLife; const t = -Math.log(v.ratio) / lambda; const years = t / (365.25 * 24 * 3600); return { result: years, label: 'Age', unit: 'years', steps: [{ label: 'Formula', value: 't = -ln(N/N₀)/λ' }, { label: 'C-14 half-life', value: '5730 years' }, { label: 'Elapsed time', value: `${years.toFixed(0)} years` }] } },
  description: 'Radiocarbon dating measures the age of organic materials by comparing the remaining Carbon-14 fraction to the original atmospheric level.',
  formula: 't = -1/λ · ln(N/N₀), λ = ln(2)/5730 yr',
  interpretation: 'C-14 has a half-life of 5730 years. The method is reliable up to ~50,000 years. C-14 is constantly produced in the upper atmosphere by cosmic rays. After death, no new C-14 is absorbed.'
}

export default calcDef
