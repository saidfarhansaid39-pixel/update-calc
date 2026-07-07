import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ glucose: z.string().min(1,'Required').refine(v=>parseFloat(v)>=20,'≥20'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18') }),
  fields: [{ name:'glucose', label:'Fasting Plasma Glucose (mg/dL)', type:'number', min:20, max:600, step:'1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const g=parseFloat(v.glucose)||90; const a=parseFloat(v.age)||40; let status=''; if(g>=126) status='Diabetes - confirm with repeat/recheck HbA1c'; else if(g>=100) status='Prediabetes (IFG) - lifestyle intervention'; else if(g<70) status='Hypoglycemia - evaluate cause'; else status='Normal fasting glucose'; return { result:g, label:'Fasting Glucose', unit:'mg/dL', steps:[{ label:'FPG', value:g.toString() },{ label:'Category', value:status }] } },
  description: 'Fasting plasma glucose interpretation per ADA diabetes diagnostic criteria.',
  formula: 'Normal <100 mg/dL. IFG: 100-125 mg/dL. Diabetes: ≥126 mg/dL (two separate readings).',
  interpretation: 'Confirm elevated values with repeat testing. HbA1c ≥6.5% or 2h OGTT ≥200 also diagnostic.'
}

export default calcDef
