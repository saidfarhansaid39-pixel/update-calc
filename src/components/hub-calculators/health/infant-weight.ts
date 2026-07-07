import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ageMonths: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.string().min(1,'Required'), birthWeight: z.string().min(1,'Required') }),
  fields: [{ name:'ageMonths', label:'Age (months)', type:'number', min:0, max:36, step:'0.5' }, { name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.01' }, { name:'gender', label:'Gender', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }, { name:'birthWeight', label:'Birth Weight (kg)', type:'number', min:0, step:'0.01' }],
  compute: (v) => { const a=parseFloat(v.ageMonths)||0; const w=parseFloat(v.weight)||3.5; const bw=parseFloat(v.birthWeight)||3.5; const gain=w-bw; const daily=a>0?gain*30/a*1000:0; const exp=a<=3?bw+a*0.8:a<=6?bw+2.4+(a-3)*0.5:a<=12?bw+3.9+(a-6)*0.3:bw+5.5+(a-12)*0.2; const pct=(w/exp)*100; return { result:w, label:'Weight', unit:'kg', steps:[{ label:'Current Weight', value:w.toFixed(2)+' kg' },{ label:'Birth Weight', value:bw.toFixed(2)+' kg' },{ label:'Weight Gain', value:gain.toFixed(2)+' kg' },{ label:'Daily Gain', value:daily.toFixed(0)+' g/day' },{ label:'% Expected', value:pct.toFixed(1)+'%' }] } },
  description: 'Infant weight growth assessment with birth weight trajectory, daily gain velocity, and age-expected norms.',
  formula: 'Expected weight: birth doubles at 5mo, triples at 12mo. Gain velocity: 20-30 g/day (0-3mo), 15-20 g/day (3-6mo), 8-12 g/day (6-12mo).',
  interpretation: 'Weight <3rd percentile or crossing >2 centiles: failure to thrive workup. Gain <10 g/day in 0-3mo, <5 g/day in 3-6mo requires evaluation.'
}

export default calcDef
