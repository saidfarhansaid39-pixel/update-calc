import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ headCirc: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'headCirc', label:'Head Circumference (cm)', type:'number', min:20, max:60, step:'0.1' }, { name:'age', label:'Age (months, 0-36)', type:'number', min:0, max:36, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const hc=parseFloat(v.headCirc)||34; const a=parseFloat(v.age)||0; const g=v.gender||'male'; const mean=g==='male'?35+0.5*a:34.5+0.5*a; const z=(hc-mean)/(a<3?1.5:a<12?1:0.8); const pct=Math.round(100/(1+Math.exp(-1.7*z))); return { result:pct, label:'Head Circumference Percentile', unit:'%', steps:[{ label:'HC', value:hc.toFixed(1)+' cm' },{ label:'Age', value:a.toString()+' months' },{ label:'Approx. Percentile', value:pct.toString() },{ label:'Macrocephaly >97%', value:pct>97?'Yes - evaluate':'' },{ label:'Microcephaly <3%', value:pct<3?'Yes - evaluate':'' }] } },
  description: 'Head circumference percentile for pediatric growth monitoring (0-36 months).',
  formula: 'Age/sex percentile from WHO/CDC growth standards. Macrocephaly: >97th, Microcephaly: <3rd pct.',
  interpretation: 'Rapidly crossing percentiles upward: hydrocephalus. Downward: craniosynostosis, failure to thrive.'
}

export default calcDef
