import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']), pregnant: z.enum(['yes','no']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:1, max:120, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }, { name:'pregnant', label:'Pregnant/Lactating', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }],
  compute: (v) => { const a=parseFloat(v.age)||30; const g=v.gender||'female'; const p=v.pregnant||'no'; let rec=1000; if(a<1) rec=260; else if(a<3) rec=700; else if(a<9) rec=1000; else if(a<19) rec=1300; else if(a>70) rec=1200; if(p==='yes') rec+=300; return { result:rec, label:'RDA Calcium', unit:'mg', steps:[{ label:'Age-Based', value:(p==='yes'?rec-300:rec).toString() },{ label:'Pregnancy Adj.', value:p==='yes'?'+300':'0' },{ label:'Total RDA', value:rec.toString() }] } },
  description: 'Daily calcium RDA per IOM/NASEM by age, gender, and pregnancy.',
  formula: '1-3yr:700, 4-8:1000, 9-18:1300, 19-70:1000, >70:1200. Pregnancy:+300. UL:2000-3000 mg.',
  interpretation: 'Critical for bone health. Vitamin D (600-800 IU) enhances absorption. >2500 mg may increase kidney stone risk.'
}

export default calcDef
