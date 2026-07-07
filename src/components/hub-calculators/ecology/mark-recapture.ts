import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ marked: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), captured: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), recaptured: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [
    { name: 'marked', label: 'Initially marked (M)', type: 'number', min: 1, step: '1' },
    { name: 'captured', label: 'Second capture total (C)', type: 'number', min: 1, step: '1' },
    { name: 'recaptured', label: 'Recaptured marked (R)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const M = parseInt(v.marked); const C = parseInt(v.captured); const R = parseInt(v.recaptured); const N = R>0?Math.round(M*C/R):0; const se = R>0?Math.sqrt((M*C*(M-R)*(C-R))/(R**3)):0; return { result: N, label: 'Population Estimate N̂', unit: '', steps: [{ label: 'Marked (M)', value: `${M}` }, { label: 'Second capture (C)', value: `${C}` }, { label: 'Recaptured marked (R)', value: `${R}` }, { label: 'N̂ = M×C/R', value: `${N}` }, { label: 'SE', value: se.toFixed(1) }, { label: '95% CI', value: N>0?`[${Math.round(N-1.96*se)}, ${Math.round(N+1.96*se)}]`:'N/A' }] } },
  description: 'Lincoln-Petersen mark-recapture estimates population size from the proportion of marked individuals in a second sample.',
  formula: 'N̂ = M×C/R | SE = √(M×C×(M-R)×(C-R)/R³)',
  interpretation: 'Assumes closed population, no marks lost, random mixing. R should be ≥10 for reliable estimates. Bias when R is small (<7).'
}

export default calcDef
