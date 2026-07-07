import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ stress: z.string().optional(), dimensions: z.string().optional() }),
  fields: [
    { name: 'stress', label: 'Stress value from NMDS output', type: 'number', min: 0, max: 1, step: '0.01' },
    { name: 'dimensions', label: 'Number of dimensions (k)', type: 'number', min: 1, max: 6, step: '1' },
  ],
  compute: (v) => { const s = parseFloat(v.stress)||0.2; const k = parseInt(v.dimensions)||2; const quality = s<0.05?'Excellent':s<0.1?'Good':s<0.2?'Fair':'Poor'; const maxAcceptable = 0.2 + (k-2)*0.02; return { result: s, label: 'NMDS Stress', unit: '', steps: [{ label: 'Dimensions (k)', value: `${k}` }, { label: 'Stress value', value: s.toFixed(3) }, { label: 'Interpretation', value: quality }, { label: 'Max acceptable stress', value: maxAcceptable.toFixed(3) }, { label: 'Acceptable?', value: s<=maxAcceptable?'Yes':'No — increase k or remove outliers' }] } },
  description: 'Non-metric multidimensional scaling stress evaluation. Lower stress indicates better ordination fit.',
  formula: 'Stress = √(Σ(d̂_ij - d_ij)² / Σ(d_ij)²)',
  interpretation: 'Stress < 0.1 = good ordination. Stress 0.1-0.2 = usable but some species poorly fit. Stress > 0.2 = unreliable.'
}

export default calcDef
