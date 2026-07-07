import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ abundances: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated') }),
  fields: [{ name: 'abundances', label: 'Species abundances (comma-separated)', type: 'number' }],
  compute: (v) => { const counts = v.abundances.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const total = counts.reduce((a:number,b:number)=>a+b,0); const props = counts.map((c:number)=>c/total); const H = -props.map((p:number)=>p>0?p*Math.log(p):0).reduce((a:number,b:number)=>a+b,0); const S = counts.length; const Hmax = Math.log(S); const J = Hmax>0?H/Hmax:0; return { result: J, label: "Pielou's J'", unit: '', steps: [{ label: 'Species count (S)', value: `${S}` }, { label: "H'", value: H.toFixed(4) }, { label: "H'max = ln(S)", value: Hmax.toFixed(4) }, { label: "J'", value: J.toFixed(4) }] } },
  description: "Calculates Pielou's evenness index (J') measuring how evenly individuals are distributed among species.",
  formula: "J' = H' / ln(S)",
  interpretation: "J' = 1 when all species are equally abundant. J' = 0 when one species dominates. Values <0.5 indicate high dominance."
}

export default calcDef
