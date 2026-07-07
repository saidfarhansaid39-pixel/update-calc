import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ species: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV') }),
  fields: [{ name: 'species', label: 'Species abundances (comma-separated)', type: 'number' }],
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)).sort((a:number,b:number)=>b-a); const total = counts.reduce((a:number,b:number)=>a+b,0); const relAbund = counts.map((c:number)=>(c/total*100)); const dominant = counts[0]; const ratio = counts.length>1?counts[0]/counts[counts.length-1]:1; return { result: dominant/total*100, label: 'Dominant Species %', unit: '%', steps: counts.slice(0,5).map((c:number,i:number)=>({label:`Rank ${i+1}`,value:`${c} (${relAbund[i].toFixed(1)}%)`})).concat([{label:'Dominance ratio (max/min)',value:ratio.toFixed(2)},{label:'Total species',value:`${counts.length}`}]) } },
  description: 'Rank abundance diagrams plot species abundance rank against relative abundance to visualize community structure.',
  formula: 'Pi = ni/N as a function of rank | Whitaker plot',
  interpretation: 'Steep slope = high dominance by few species. Shallow slope = even distribution. Geometric series = strong niche preemption.'
}

export default calcDef
