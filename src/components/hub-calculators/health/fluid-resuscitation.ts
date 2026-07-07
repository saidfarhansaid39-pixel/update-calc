import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), percentBurn: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:1, step:'0.1' }, { name:'percentBurn', label:'Total Burn Surface Area %', type:'number', min:0, max:100, step:'1' }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const p=parseFloat(v.percentBurn)||0; const total=4*w*p; const first8=total/2; const first24=total; return { result:total, label:'Parkland Total', unit:'mL/24h', steps:[{ label:'Total = 4mL × W(kg) × %TBSA', value:total.toFixed(0)+' mL' },{ label:'First 8h (half)', value:first8.toFixed(0)+' mL' },{ label:'Fluid Type', value:'Ringer Lactate' }] } },
  description: 'Parkland formula for burn fluid resuscitation in first 24 hours.',
  formula: 'Total = 4 mL × weight(kg) × %TBSA. Half in first 8h, half in next 16h. Use LR.',
  interpretation: 'Goal urine output: 0.5-1 mL/kg/hr. Titrate to maintain perfusion. Avoid over-resuscitation (abdominal compartment).'
}

export default calcDef
