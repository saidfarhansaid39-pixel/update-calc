import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const g=v.gender||'male'; const ibw=g==='male'?50+0.91*(h-152.4):45.5+0.91*(h-152.4); const abw=ibw+0.4*(w-ibw); return { result:abw, label:'Adjusted Body Weight', unit:'kg', steps:[{ label:'IBW', value:ibw.toFixed(1) },{ label:'ABW=IBW+0.4×(Actual-IBW)', value:abw.toFixed(1) }] } },
  description: 'Adjusted body weight for drug dosing in obese patients.',
  formula: 'IBW male: 50+0.91×(H-152.4); female: 45.5+0.91×(H-152.4); ABW = IBW+0.4×(W-IBW)',
  interpretation: 'ABW used for pharmacokinetic dosing to avoid overestimation from adipose tissue in obesity.'
}

export default calcDef
