import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ u: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), v: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'u', label: 'Velocity u (in S\' frame)', type: 'number', unit: 'm/s', min: 0, step: '1e7' }, { name: 'v', label: 'Frame Velocity v (S\' relative to S)', type: 'number', unit: 'm/s', min: 0, step: '1e7' }],
  compute: (v) => { const c = 299792458; const w = (v.u + v.v) / (1 + v.u * v.v / (c * c)); return { result: w, label: 'Resultant Velocity w', unit: 'm/s', steps: [{ label: 'Formula', value: 'w = (u+v)/(1+uv/c²)' }, { label: 'Classical sum', value: `${(v.u + v.v).toExponential(4)} m/s` }, { label: 'Relativistic w', value: `${w.toExponential(4)} m/s` }, { label: 'w/c', value: `${(w / c).toFixed(6)}c` }] } },
  description: 'Relativistic velocity addition ensures the resultant velocity never exceeds the speed of light, unlike classical addition.',
  formula: 'w = (u + v) / (1 + uv/c²)',
  interpretation: 'If u = 0.9c and v = 0.9c, classical sum = 1.8c (impossible), but relativistic w = 0.9945c. If either velocity is c, the result is always c — consistent with light speed invariance.'
}

export default calcDef
