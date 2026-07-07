import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ species: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV'), sample: z.string().optional() }),
  fields: [
    { name: 'species', label: 'Species abundances (comma-separated)', type: 'number' },
    { name: 'sample', label: 'Rarefaction sample size', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const N = counts.reduce((a:number,b:number)=>a+b,0); const n = parseInt(v.sample)||Math.floor(N/2); if (n>N) { return { result: N, label: 'Error', unit: '', steps: [{ label: 'Sample size exceeds total N', value: `Max: ${N}` }] } } const Sobs = counts.filter((c:number)=>c>0).length; const expected = Sobs - counts.filter((c:number)=>c>0).reduce((sum:number,c:number)=>{ const term = 1 - (c*(c-1))/(N*(N-1)); return sum + (n>1?1-term**n:0); }, 0); return { result: expected, label: 'Expected Species (Rarefied)', unit: '', steps: [{ label: 'Total individuals (N)', value: `${N}` }, { label: 'Sample size (n)', value: `${n}` }, { label: 'Observed species', value: `${Sobs}` }, { label: 'Expected species (rarefied)', value: expected.toFixed(2) }] } },
  description: 'Rarefaction estimates expected species richness at a standardized sampling effort for fair comparison across communities.',
  formula: 'E(S_n) = S_obs - Σ(1 - [N - Nᵢ choose n] / [N choose n])',
  interpretation: 'Rarefaction allows comparing richness across samples of different sizes. The curve flattens as sampling approaches completeness.'
}

export default calcDef
