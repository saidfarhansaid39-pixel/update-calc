import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ageMonths: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), length: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.string().min(1,'Required'), birthLength: z.string().min(1,'Required') }),
  fields: [{ name:'ageMonths', label:'Age (months)', type:'number', min:0, max:36, step:'0.5' }, { name:'length', label:'Length (cm)', type:'number', min:0, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }, { name:'birthLength', label:'Birth Length (cm)', type:'number', min:0, step:'0.1' }],
  compute: (v) => { const a=parseFloat(v.ageMonths)||0; const l=parseFloat(v.length)||50; const bl=parseFloat(v.birthLength)||50; const g=l-bl; const rate=a>0?g/a:0; const exp=v.gender==='male'?a*2.5:a*2.4; const pct=(l/(bl+exp))*100; return { result:l, label:'Length', unit:'cm', steps:[{ label:'Current Length', value:l.toFixed(1)+' cm' },{ label:'Birth Length', value:bl.toFixed(1)+' cm' },{ label:'Growth Since Birth', value:g.toFixed(1)+' cm' },{ label:'Growth Rate', value:rate.toFixed(2)+' cm/month' },{ label:'% of Expected', value:pct.toFixed(1)+'%' }] } },
  description: 'Infant length growth assessment tracking longitudinal growth velocity and expected percentiles.',
  formula: 'Growth velocity: ~2.5 cm/month (M) / 2.4 cm/month (F) in first 6 months. Length doubles by 4 years. Expected length at age = birth length + age × rate.',
  interpretation: 'Length <3rd percentile: consider GH deficiency, hypothyroidism, skeletal dysplasia. Growth velocity <5 cm/year after age 2: evaluation warranted.'
}

export default calcDef
