import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n1: z.string().min(1).refine(v => parseInt(v) >= 10, '≥10'), n2: z.string().min(1).refine(v => parseInt(v) >= 10, '≥10'), interim: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1') }),
  fields: [{ name: 'n1', label: 'Stage 1 Sample Size', type: 'number', min: 10, step: '1' }, { name: 'n2', label: 'Stage 2 Sample Size', type: 'number', min: 10, step: '1' }, { name: 'interim', label: 'Interim Analysis Fraction', type: 'number', min: 0.1, max: 0.9, step: '0.05' }],
  compute: (v) => { const totalN = n(v.n1) + n(v.n2); const fraction = n(v.n1) / totalN; const adjAlpha = 0.05 / (1 + fraction); return { result: adjAlpha, label: 'Adjusted Alpha', unit: '', steps: [{ label: 'Total N', value: `${totalN}` }, { label: 'Fraction at interim', value: `${fraction.toFixed(3)}` }, { label: 'Adjusted α (Bonferroni)', value: `${adjAlpha.toExponential(4)}` }] } },
  description: 'Adaptive designs allow modifications to trial parameters based on interim analyses without undermining validity.',
  formula: 'α_adj = α / (1 + information_fraction) | O\'Brien-Fleming boundary adjustment',
  interpretation: 'Interim analyses reduce alpha to control Type I error. More looks need larger adjustments.'
}

export default calcDef
