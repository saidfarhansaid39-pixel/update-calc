import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:3, max:150, step:'0.5' }],
  compute: (v) => { const w=parseFloat(v.weight)||20; const dose5=w*5; const dose10=w*10; const max=w*40; const ml5=w*5/100; const ml10=w*10/100; return { result:dose10, label:'Usual Dose (10mg/kg)', unit:'mg', steps:[{ label:'Weight', value:w.toString()+' kg' },{ label:'5 mg/kg (mild)', value:dose5.toFixed(0)+' mg ('+ml5.toFixed(1)+' mL of 100mg/5mL)' },{ label:'10 mg/kg (moderate)', value:dose10.toFixed(0)+' mg ('+ml10.toFixed(1)+' mL)' },{ label:'Max Daily (40 mg/kg)', value:(w*40).toFixed(0)+' mg/day' }] } },
  description: 'Pediatric ibuprofen dosing (5-10 mg/kg/dose, max 40 mg/kg/day).',
  formula: 'Dose = weight × 5-10 mg/kg q6-8h. Max single: 400 mg. Max daily: 40 mg/kg (adult: 3200 mg).',
  interpretation: 'Use lowest effective dose. Contraindicated in dehydration, renal impairment, bleeding disorders.'
}

export default calcDef
