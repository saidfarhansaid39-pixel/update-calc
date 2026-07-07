import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ effect: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1') }),
  fields: [{ name: 'effect', label: 'Effect Size (d)', type: 'number', min: 0.01, step: '0.1' }, { name: 'n', label: 'Sample Size (n)', type: 'number', min: 2, step: '1' }, { name: 'alpha', label: 'Alpha (α)', type: 'number', min: 0.001, max: 0.1, step: '0.005' }],
  compute: (v) => { const d = n(v.effect); const nSize = Math.round(n(v.n)); const alpha = n(v.alpha); const ncp = d * Math.sqrt(nSize / 2); const df = nSize - 2; const zAlpha = 1.6449; const zBeta = ncp - zAlpha; const power = 1 - (zBeta > -4 ? Math.exp(-zBeta * zBeta / 2) / (Math.sqrt(2 * Math.PI) * (1 + 0.2316419 * zBeta)) : 0); return { result: Math.max(0, Math.min(1, power)), label: 'Statistical Power', unit: '', steps: [{ label: 'Effect size d', value: `${d}` }, { label: 'Sample size', value: `${nSize}` }, { label: 'α', value: `${alpha}` }, { label: 'Power', value: `${Math.max(0, Math.min(1, power)).toFixed(4)}` }] } },
  description: 'Power analysis calculates the probability of detecting a true effect (statistical power) given sample size, effect size, and alpha.',
  formula: 'Power = P(reject H₀ | H₁ true), depends on n, d, α',
  interpretation: 'Power ≥ 0.80 is conventional. Larger effect sizes and larger samples increase power. Lower alpha reduces power.'
}

export default calcDef
