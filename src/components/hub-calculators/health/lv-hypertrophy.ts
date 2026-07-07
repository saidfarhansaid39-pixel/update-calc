import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ravl: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), sv3: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), sex: z.string().min(1,'Required') }),
  fields: [{ name:'ravl', label:'R aVL Amplitude (mm)', type:'number', min:0, step:'1' }, { name:'sv3', label:'S V3 Amplitude (mm)', type:'number', min:0, step:'1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const r=parseFloat(v.ravl)||0; const s=parseFloat(v.sv3)||0; const sex=v.sex||'male'; const cornell=r+s; const threshold=sex==='male'?28:20; const present=cornell>=threshold; return { result:cornell, label:'Cornell Voltage', unit:'mm', steps:[{ label:'R aVL', value:r.toFixed(0)+' mm' },{ label:'S V3', value:s.toFixed(0)+' mm' },{ label:'Cornell Sum', value:cornell.toFixed(0)+' mm' },{ label:'LVH', value:present?'Probable':'Not Present' }] } },
  description: 'Left ventricular hypertrophy screening using Cornell voltage criteria on 12-lead ECG.',
  formula: 'Cornell Voltage = R aVL + S V3. LVH if ≥28 mm (male) or ≥20 mm (female).',
  interpretation: 'Positive Cornell criteria suggest LVH, which increases cardiovascular mortality risk. Confirm with echocardiography.'
}

export default calcDef
