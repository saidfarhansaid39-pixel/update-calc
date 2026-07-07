import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mg: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), hoursElapsed: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'mg', label:'Caffeine Consumed (mg)', type:'number', min:0, max:2000, step:'10' }, { name:'hoursElapsed', label:'Hours Since', type:'number', min:0, max:72, step:'0.5' }],
  compute: (v) => { const mg=parseFloat(v.mg)||0; const h=parseFloat(v.hoursElapsed)||0; const rem=mg*Math.pow(0.5,h/5); const pct=mg>0?rem/mg*100:0; return { result:rem, label:'Caffeine Remaining', unit:'mg', steps:[{ label:'Initial', value:mg.toString() },{ label:'Hours', value:h.toString() },{ label:'Remaining (5h half-life)', value:rem.toFixed(1)+' mg ('+pct.toFixed(1)+'%)' }] } },
  description: 'Caffeine metabolism modeling using ~5-hour average half-life elimination.',
  formula: 'Remaining = Dose × 0.5^(hours/5). Half-life 3-7h (avg 5h).',
  interpretation: 'At 5h: 50% remains. At 10h: 25%. Evening caffeine can disrupt sleep 8-10h later.'
}

export default calcDef
