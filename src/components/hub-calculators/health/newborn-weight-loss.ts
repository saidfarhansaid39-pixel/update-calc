import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ birthWeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), currentWeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), ageHours: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), feedingMethod: z.string().min(1) }),
  fields: [
    { name:'birthWeight', label:'Birth Weight (g)', type:'number', min:500, max:6000, step:'1' },
    { name:'currentWeight', label:'Current Weight (g)', type:'number', min:500, max:6000, step:'1' },
    { name:'ageHours', label:'Age (hours since birth)', type:'number', min:0, max:336, step:'1' },
    { name:'feedingMethod', label:'Feeding Method', type:'select', options:[{ label:'Breastfeeding', value:'breast' },{ label:'Formula', value:'formula' },{ label:'Mixed', value:'mixed' }] }
  ],
  compute: (v) => { const bw=parseFloat(v.birthWeight)||3000; const cw=parseFloat(v.currentWeight)||3000; const age=parseFloat(v.ageHours)||24; const pctLoss=(bw-cw)/bw*100; const expectedMax=age<24?3:age<48?5:age<72?7:age<96?8:age<120?9:10; const expectedMaxDetail=expectedMax+'%'; let concern='Within normal limits'; if(pctLoss>expectedMax) concern='Exceeds expected - monitor closely'; if(pctLoss>12) concern='Concerning - may require intervention'; return { result:parseFloat(pctLoss.toFixed(1)), label:'Weight Loss', unit:'%', steps:[{ label:'Weight Loss', value:pctLoss.toFixed(1)+'%' },{ label:'Expected Max Loss', value:expectedMaxDetail },{ label:'Assessment', value:concern }] } },
  description: 'Newborn weight loss assessment comparing actual loss to expected norms by hour of life.',
  formula: '% Weight Loss = (Birth Weight - Current Weight) / Birth Weight × 100. Expected: <3% @24h, <7% @72h, <10% @120h.',
  interpretation: 'Normal: 5-7% in first 72h. Maximum: <10% in term infants. >12% requires evaluation for dehydration.'
}
export default calcDef
