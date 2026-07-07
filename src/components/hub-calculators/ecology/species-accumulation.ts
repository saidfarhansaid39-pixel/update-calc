import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ samples: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV') }),
  fields: [{ name: 'samples', label: 'Species per sample (cumulative comma-separated)', type: 'number' }],
  compute: (v) => { const cumSpp = v.samples.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const rate = cumSpp.length>1?(cumSpp[cumSpp.length-1]-cumSpp[0])/(cumSpp.length-1):0; const maxVal = cumSpp[cumSpp.length-1]||0; const asymptote = maxVal + (rate>0?maxVal*0.1:0); return { result: maxVal, label: 'Total Species Accumulated', unit: '', steps: cumSpp.map((v:number,i:number)=>({label:`Sample ${i+1}`,value:`${v}`})).concat([{label:'Avg addition/sample',value:rate.toFixed(2)},{label:'Estimated asymptote',value:asymptote.toFixed(0)}]) } },
  description: 'Species accumulation curves show how species are discovered with increasing sampling effort, used to estimate sampling completeness.',
  formula: 'Accumulation = S(n) | Asymptote estimated by Clench model',
  interpretation: 'The curve approaches an asymptote representing total species pool. Still rising = incomplete sampling.'
}

export default calcDef
