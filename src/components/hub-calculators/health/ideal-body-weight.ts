import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.string().min(1,'Required'), formula: z.string().min(1,'Required'), actualWeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'height', label:'Height (cm)', type:'number', min:0, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }, { name:'formula', label:'Formula', type:'select', options:[{value:'devine',label:'Devine'},{value:'robinson',label:'Robinson'},{value:'miller',label:'Miller'},{value:'hamwi',label:'Hamwi'}] }, { name:'actualWeight', label:'Actual Weight (kg)', type:'number', min:0, step:'0.1' }],
  compute: (v) => { const h=parseFloat(v.height)||170; const aw=parseFloat(v.actualWeight)||70; const hin=h/2.54; const m=v.gender==='male'; const ibw=({devine:m?50+2.3*(hin-60):45.5+2.3*(hin-60),robinson:m?52+1.9*(hin-60):49+1.7*(hin-60),miller:m?56.2+1.41*(hin-60):53.1+1.36*(hin-60),hamwi:m?48+2.7*(hin-60):45.5+2.2*(hin-60)} as Record<string, number>)[v.formula]; const pct=(aw/ibw)*100; return { result:ibw, label:'Ideal Body Weight', unit:'kg', steps:[{ label:'IBW', value:ibw.toFixed(1)+' kg' },{ label:'Actual', value:aw.toFixed(1)+' kg' },{ label:'% IBW', value:pct.toFixed(1)+'%' }] } },
  description: 'Ideal body weight estimation using Devine, Robinson, Miller, or Hamwi formulas for clinical dosing.',
  formula: 'Devine M: 50+2.3(in-60), F:45.5+2.3(in-60). Robinson M:52+1.9(in-60), F:49+1.7(in-60). Miller M:56.2+1.41(in-60), F:53.1+1.36(in-60). Hamwi M:48+2.7(in-60), F:45.5+2.2(in-60).',
  interpretation: 'IBW used for aminoglycoside and TPN dosing. ±20% IBW normal range. %IBW <80% underweight, >120% overweight.'
}

export default calcDef
