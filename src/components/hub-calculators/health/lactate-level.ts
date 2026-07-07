import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lactate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), venousOrArterial: z.string().min(1,'Required') }),
  fields: [{ name:'lactate', label:'Serum Lactate (mmol/L)', type:'number', min:0, step:'0.1' }, { name:'venousOrArterial', label:'Sample Type', type:'select', options:[{value:'venous',label:'Venous'},{value:'arterial',label:'Arterial'}] }],
  compute: (v) => { const lac=parseFloat(v.lactate)||1; const severity=lac<2?'Normal':lac<4?'Mildly Elevated':lac<6?'Moderately Elevated':'Severely Elevated'; return { result:lac, label:'Lactate Level', unit:'mmol/L', steps:[{ label:'Lactate', value:lac.toFixed(1)+' mmol/L' },{ label:'Severity', value:severity }] } },
  description: 'Serum lactate measures tissue hypoperfusion and is a key marker of sepsis and shock severity.',
  formula: 'Direct measurement via blood gas or chemistry analyzer. Normal: <2 mmol/L.',
  interpretation: '<2 mmol/L: Normal; 2-4: Mildly elevated (compensated); 4-6: Moderately elevated (sepsis concern); >6: Severe hyperlactatemia (high mortality risk).'
}

export default calcDef
