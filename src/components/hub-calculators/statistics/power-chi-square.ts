import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ w: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n: z.string().min(1).refine(v => parseInt(v) >= 5, '≥5'), df: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1') }),
  fields: [{ name: 'w', label: 'Effect Size w', type: 'number', min: 0.01, step: '0.05' }, { name: 'n', label: 'Total N', type: 'number', min: 5, step: '1' }, { name: 'df', label: 'Degrees of Freedom', type: 'number', min: 1, step: '1' }, { name: 'alpha', label: 'Alpha (α)', type: 'number', min: 0.001, max: 0.1, step: '0.005' }],
  compute: (v) => { const w = n(v.w); const N = Math.round(n(v.n)); const df = Math.round(n(v.df)); const alpha = n(v.alpha); const ncp = N * w * w; const crit = 3.84; const z = (ncp - df - 2) / Math.sqrt(2 * (df + 2 * ncp)); const power = 1 - (z > -4 ? 0.5 * Math.exp(-z * z / 2) / (0.5 + 0.5 * Math.sqrt(1 - Math.exp(-z * z * 2 / Math.PI))) : 1); return { result: Math.max(0.01, Math.min(0.99, power)), label: 'Power (χ²)', unit: '', steps: [{ label: 'Effect w', value: `${w}` }, { label: 'NCP = N × w²', value: `${ncp.toFixed(4)}` }, { label: 'Power', value: `${Math.max(0.01, Math.min(0.99, power)).toFixed(4)}` }] } },
  description: 'Power analysis for chi-square tests calculates the probability of detecting an association between categorical variables.',
  formula: 'NCP = N × w², where w = √(Σ(p₁ᵢ-p₀ᵢ)²/p₀ᵢ). Power = P(χ²_NCP > χ²_crit)',
  interpretation: 'Cohen\'s w: 0.1 (small), 0.3 (medium), 0.5 (large). For 2×2 tables, df=1, w=0.3 is medium effect.'
}

export default calcDef
