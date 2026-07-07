import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ calf: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'calf', label:'Calf Circumference (cm)', type:'number', min:10, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const c=parseFloat(v.calf)||35; const a=parseFloat(v.age)||40; const g=v.gender||'male'; const cutoff=g==='male'?34:33; return { result:c, label:'Calf Circumference', unit:'cm', steps:[{ label:'Measured', value:c.toFixed(1) },{ label:'Sarcopenia Cutoff', value:cutoff.toString() },{ label:'Status', value:c<cutoff?'Below cutoff - sarcopenia risk':'Normal muscle mass' }] } },
  description: 'Calf circumference for sarcopenia screening (EWGSOP2 criteria).',
  formula: 'Sarcopenia: <34 cm (male), <33 cm (female). Associated with functional decline.',
  interpretation: 'Low calf circumference correlates with reduced muscle mass, strength, and physical performance.'
}

export default calcDef
