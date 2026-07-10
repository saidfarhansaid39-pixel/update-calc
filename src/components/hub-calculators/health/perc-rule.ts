import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hr: z.string().min(1,'Required'), sat: z.string().min(1,'Required'), dvtSigns: z.string().min(1,'Required'), hemoptysis: z.string().min(1,'Required'), surgery: z.string().min(1,'Required'), priorDvt: z.string().min(1,'Required'), estrogen: z.string().min(1,'Required') }),
  fields: [{ name:'age', label:'Age >50 (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'hr', label:'HR ≥100 (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'sat', label:'SpO₂ <95% (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'dvtSigns', label:'Clinical DVT Signs (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'hemoptysis', label:'Hemoptysis (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'surgery', label:'Surgery/Fracture (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'priorDvt', label:'Prior DVT/PE (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'estrogen', label:'Estrogen Use (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }],
  compute: (v) => { const a=parseFloat(v.age)||0; const hr=parseFloat(v.hr)||0; const sat=parseFloat(v.sat)||0; const dvt=parseFloat(v.dvtSigns)||0; const hemo=parseFloat(v.hemoptysis)||0; const surg=parseFloat(v.surgery)||0; const prior=parseFloat(v.priorDvt)||0; const est=parseFloat(v.estrogen)||0; const total=a+hr+sat+dvt+hemo+surg+prior+est; const perc=total===0; return { result:perc?0:1, label:'PERC Rule', steps:[{ label:'Criteria Present', value:total.toFixed(0)+'/8' },{ label:'Assessment', value:perc?'PERC Negative (PE unlikely)':'PERC Positive (further testing needed)' }] } },
  description: 'PERC rule identifies patients with low enough PE risk that further testing can be safely withheld.',
  formula: 'PERC negative if ALL 8 criteria are absent: age>50, HR≥100, SpO₂<95%, DVT signs, hemoptysis, surgery, prior DVT/PE, estrogen.',
  interpretation: 'PERC negative (0/8): PE risk <2%, no further testing needed. PERC positive (≥1/8): D-dimer or CTPA indicated. Only apply when clinician already considers PE unlikely.'
}
export default calcDef
