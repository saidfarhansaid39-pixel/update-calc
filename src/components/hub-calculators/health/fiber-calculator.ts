import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), gender: z.enum(['male','female']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:1, max:120, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const a=parseFloat(v.age)||30; const g=v.gender||'female'; let rec=25; if(a<=18) rec=g==='male'?38:26; else if(a<=50) rec=g==='male'?38:25; else rec=g==='male'?30:21; return { result:rec, label:'Daily Fiber', unit:'g', steps:[{ label:'Age-Based Recommendation', value:rec.toString()+' g/day' },{ label:'Current intake avg: 15g', value:'Most consume less than recommended' }] } },
  description: 'Daily dietary fiber recommendation per IOM/NASEM by age and gender.',
  formula: 'Men ≤50: 38g, >50: 30g. Women ≤50: 25g, >50: 21g. Children: 19-38g (age-dependent).',
  interpretation: 'Average intake: ~15g. High fiber reduces CVD, diabetes, colon cancer risk. Increase gradually with water.'
}

export default calcDef
