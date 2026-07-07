import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ species: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated numbers') }),
  fields: [{ name: 'species', label: 'Species abundances (comma-separated)', type: 'number' }],
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const total = counts.reduce((a:number,b:number)=>a+b,0); const proportions = counts.map((c:number)=>c/total); const H = -proportions.map((p:number)=>p>0?p*Math.log(p):0).reduce((a:number,b:number)=>a+b,0); const Hmax = Math.log(counts.length); const J = Hmax>0?H/Hmax:0; return { result: H, label: "Shannon-Wiener H'", unit: '', steps: [{ label: 'Total individuals', value: `${total}` }, { label: 'Species (S)', value: `${counts.length}` }, { label: "H'", value: H.toFixed(4) }, { label: "H'max = ln(S)", value: Hmax.toFixed(4) }, { label: "J' = H'/H'max", value: J.toFixed(4) }] } },
  description: "Calculates Shannon-Wiener diversity index (H') from species abundance data.",
  formula: "H' = -Σ(pᵢ × ln(pᵢ)) | J' = H'/ln(S)",
  interpretation: "H' ranges from 0 (single species) to ~4.5 (very diverse). Typical values: 1.5-3.5 for most ecological communities."
}

export default calcDef
