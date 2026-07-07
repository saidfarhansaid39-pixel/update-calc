import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'age', label:'Chronological Age', type:'number', min:1, max:18, step:'0.5' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'weight', label:'Weight (kg)', type:'number', min:5, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const ca=parseFloat(v.age)||10; const h=parseFloat(v.height)||140; const w=parseFloat(v.weight)||35; const g=v.gender||'male'; const ba=ca+(h-((g==='male'?80:75)+5*ca))/15; const baC=Math.max(1,Math.min(20,ba)); const diff=baC-ca; const ass=Math.abs(diff)<1?'Normal':diff>1?'Advanced by '+diff.toFixed(1)+'yr':'Delayed by '+Math.abs(diff).toFixed(1)+'yr'; return { result:baC, label:'Bone Age Est.', unit:'years', steps:[{ label:'CA', value:ca.toString() },{ label:'Est. Bone Age', value:baC.toFixed(1) },{ label:'Assessment', value:ass }] } },
  description: 'Skeletal bone age estimation approximating Greulich-Pyle atlas standards.',
  formula: 'Based on height-for-age. Official assessment requires left hand/wrist X-ray.',
  interpretation: '±1yr of CA is normal. Advanced: precocious puberty, obesity. Delayed: constitutional delay, GH deficiency.'
}

export default calcDef
