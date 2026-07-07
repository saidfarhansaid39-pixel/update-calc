import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ species: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated numbers') }),
  fields: [{ name: 'species', label: 'Species abundances (comma-separated)', type: 'number' }],
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const total = counts.reduce((a:number,b:number)=>a+b,0); const D = counts.map((c:number)=>{const p=c/total;return p*p}).reduce((a:number,b:number)=>a+b,0); const inv = total>0?1/D:0; const oneMinus = 1-D; return { result: oneMinus, label: "Simpson's 1-D", unit: '', steps: [{ label: 'Total individuals', value: `${total}` }, { label: 'D = Σpᵢ²', value: D.toFixed(4) }, { label: '1-D (diversity)', value: oneMinus.toFixed(4) }, { label: '1/D (inv. Simpson)', value: inv.toFixed(2) }] } },
  description: "Calculates Simpson's Diversity Index and Inverse Simpson Index from abundance data.",
  formula: "D = Σpᵢ² | 1-D (diversity) | 1/D (effective species)",
  interpretation: '1-D ranges 0 (low diversity) to ~1. 1/D gives effective number of species for intuitive comparison.'
}

export default calcDef
