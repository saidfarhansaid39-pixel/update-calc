import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ammonia: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), symptoms: z.enum(['none','mild','moderate','severe']) }),
  fields: [{ name:'ammonia', label:'Plasma Ammonia (µmol/L)', type:'number', min:1, step:'1' }, { name:'age', label:'Age (years)', type:'number', min:1, max:110, step:'1' }, { name:'symptoms', label:'Neurologic Symptoms', type:'select', options:[{ label:'None', value:'none' },{ label:'Mild (lethargy)', value:'mild' },{ label:'Moderate (confusion)', value:'moderate' },{ label:'Severe (coma)', value:'severe' }] }],
  compute: (v) => { const am=parseFloat(v.ammonia)||0; const a=parseFloat(v.age)||30; const sym=v.symptoms||'none'; const uln=a<14?50:a<18?80:55; const elevated=am>uln; const risk=elevated&&sym!=='none'?'High - urgent':elevated?'Elevated - monitor':sym!=='none'?'Symptoms w/ normal ammonia - other causes':'Normal'; return { result:am, label:'Ammonia', unit:'µmol/L', steps:[{ label:'Ammonia Level', value:am.toFixed(1) },{ label:'Upper Limit Normal', value:uln.toString() },{ label:'Assessment', value:risk }] } },
  description: 'Plasma ammonia evaluation with age-specific norms and neurologic correlation.',
  formula: 'ULN: infants <50, children <80, adults <55 µmol/L. Hepatic encephalopathy grading.',
  interpretation: 'Elevated ammonia + neurologic sx suggests hepatic encephalopathy. Isolated elevation needs further workup.'
}

export default calcDef
