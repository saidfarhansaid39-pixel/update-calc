import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ captures: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0'), recaptures: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0'), marked: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0') }),
  fields: [
    { name: 'captures', label: 'Captured each session (CSV)', type: 'number' },
    { name: 'recaptures', label: 'Recaptured each session (CSV)', type: 'number' },
    { name: 'marked', label: 'Cumulatively marked before (CSV)', type: 'number' },
  ],
  compute: (v) => { const C = v.captures.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const R = v.recaptures.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const M = v.marked.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const n = Math.min(C.length,R.length,M.length); let sumCM = 0, sumR = 0; for(let i=0;i<n;i++){ sumCM += C[i]*M[i]; sumR += R[i]; } const N = sumR>0?Math.round(sumCM/sumR):0; return { result: N, label: 'Schnabel Population Estimate', unit: '', steps: [{ label: 'Sessions', value: `${n}` }, { label: 'Σ(C×M)', value: `${sumCM}` }, { label: 'Σ(R)', value: `${sumR}` }, { label: 'N̂ = Σ(C×M)/Σ(R)', value: `${N}` }] } },
  description: 'Schnabel method extends Lincoln-Petersen to multiple capture sessions, providing a more robust population estimate for closed populations.',
  formula: 'N̂ = Σ(Cₜ × Mₜ) / Σ(Rₜ) | Uses cumulative marked pool across sessions',
  interpretation: 'Schnabel yields more precise estimates than single Lincoln-Petersen. Requires closed population assumption. More sessions = better precision.'
}

export default calcDef
