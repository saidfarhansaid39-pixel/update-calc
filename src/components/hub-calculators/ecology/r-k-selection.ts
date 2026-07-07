import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fecundity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), survival: z.string().optional(), lifespan: z.string().optional() }),
  fields: [
    { name: 'fecundity', label: 'Average fecundity (offspring per year)', type: 'number', min: 1, step: '1' },
    { name: 'survival', label: 'Juvenile survival rate (0-1, optional)', type: 'number', min: 0, max: 1, step: '0.01' },
    { name: 'lifespan', label: 'Lifespan (years, optional)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const fec = parseFloat(v.fecundity); const surv = parseFloat(v.survival)||0.5; const life = parseInt(v.lifespan)||5; const rScore = Math.log(1 + fec*surv/life); const kScore = 1 / (fec*surv/life+1); const continuum = rScore > kScore ? 'r-selected' : 'K-selected'; return { result: rScore, label: 'r-selection Score', unit: '', steps: [{ label: 'Fecundity', value: `${fec}` }, { label: 'Juvenile survival', value: surv.toFixed(2) }, { label: 'Lifespan', value: `${life} yr` }, { label: 'r-score', value: rScore.toFixed(3) }, { label: 'K-score', value: kScore.toFixed(3) }, { label: 'Strategy', value: continuum }] } },
  description: 'r/K selection theory describes the trade-off between producing many small offspring (r-selected) versus few large offspring with high parental investment (K-selected).',
  formula: 'r-score ≈ ln(1 + birth rate × survival) | K-selected: large body, late maturity, few offspring',
  interpretation: 'r-selected: high fecundity, low parental care, unstable environments. K-selected: low fecundity, high care, stable environments.'
}

export default calcDef
