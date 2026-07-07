import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ volume: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), time: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), dropFactor: z.string().min(1,'Required'), timeUnit: z.string().min(1,'Required'), drugDose: z.string().min(1,'Required') }),
  fields: [{ name:'volume', label:'Volume (mL)', type:'number', min:0, step:'1' }, { name:'time', label:'Time', type:'number', min:0, step:'0.5' }, { name:'timeUnit', label:'Time Unit', type:'select', options:[{value:'minutes',label:'Minutes'},{value:'hours',label:'Hours'}] }, { name:'dropFactor', label:'Drop Factor (drops/mL)', type:'select', options:[{value:'10',label:'10 (macrodrip blood)'},{value:'15',label:'15 (macrodrip standard)'},{value:'20',label:'20 (macrodrip)'},{value:'60',label:'60 (microdrip pedi)'}] }, { name:'drugDose', label:'Drug Dose (mg)', type:'number', min:0, step:'0.1' }],
  compute: (v) => { const vol=parseFloat(v.volume)||500; const t=parseFloat(v.time)||1; const unit=v.timeUnit; const df=parseInt(v.dropFactor)||15; const dd=parseFloat(v.drugDose)||0; const min=unit==='hours'?t*60:t; const drip=Math.round(vol*df/min); const rate=vol/(min/60); const conc=vol>0?dd/vol*1000:0; const mcgMin=conc>0?rate*conc/60:0; return { result:drip, label:'Drip Rate', unit:'drops/min', steps:[{ label:'Volume', value:vol.toString()+' mL' },{ label:'Time', value:t.toString()+' '+unit },{ label:'Drop Factor', value:df.toString()+' gtt/mL' },{ label:'Drip Rate', value:drip.toString()+' gtt/min' },{ label:'Infusion Rate', value:rate.toFixed(1)+' mL/h' },{ label:'Drug Concentration', value:conc.toFixed(2)+' µg/mL' }] } },
  description: 'IV drip rate calculator for infusion pump settings and drop rate per minute for clinical fluid administration.',
  formula: 'Drip rate (gtt/min) = Volume (mL) × Drop factor (gtt/mL) ÷ Time (min). Infusion rate (mL/h) = Volume ÷ (Time in hours).',
  interpretation: 'Microdrip (60 gtt/mL): 1 gtt/min = 1 mL/h. Macrodrip (15 gtt/mL): 4 gtt/min = 1 mL/h. Verify rate double-check with independent calculation.'
}

export default calcDef
