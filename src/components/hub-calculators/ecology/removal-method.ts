import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ catch1: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), catch2: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), catch3: z.string().optional() }),
  fields: [
    { name: 'catch1', label: 'Catch in first session', type: 'number', min: 0, step: '1' },
    { name: 'catch2', label: 'Catch in second session', type: 'number', min: 0, step: '1' },
    { name: 'catch3', label: 'Catch in third session (optional)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const c1 = parseInt(v.catch1); const c2 = parseInt(v.catch2); const c3 = parseInt(v.catch3)||0; const q = c2>0&&c1>0?c2/c1:0; const N = c3>0?Math.round(c2*c2/(c2-c3)):q<1?Math.round(c1/(1-q)):0; return { result: N, label: 'Population Estimate N̂', unit: '', steps: [{ label: 'Catch 1', value: `${c1}` }, { label: 'Catch 2', value: `${c2}` }, { label: 'Catch 3', value: `${c3}` }, { label: 'Catchability q', value: q.toFixed(3) }, { label: 'N̂ estimate', value: `${N}` }] } },
  description: 'Removal method (Zippin) estimates population size from successive removal catches where capture probability is constant.',
  formula: 'Catchability q = C₂/C₁ | N̂ = C₂²/(C₂-C₃) or N̂ = C₁/(1-q)',
  interpretation: 'Requires declining catches across sessions. Assumes equal catchability. Violation leads to underestimation of true population size.'
}

export default calcDef
