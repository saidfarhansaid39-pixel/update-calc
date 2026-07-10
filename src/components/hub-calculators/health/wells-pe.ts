import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dvtSymptoms: z.string().min(1,'Required'), peLikely: z.string().min(1,'Required'), hr: z.string().min(1,'Required'), immobilization: z.string().min(1,'Required'), hemoptysis: z.string().min(1,'Required'), malignancy: z.string().min(1,'Required'), altDiagnosis: z.string().min(1,'Required') }),
  fields: [{ name:'dvtSymptoms', label:'Clinical DVT Symptoms (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'peLikely', label:'PE is #1 Diagnosis (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'hr', label:'Heart Rate >100 bpm (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'immobilization', label:'Immobilization/Surgery >3 days (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'hemoptysis', label:'Hemoptysis (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'malignancy', label:'Active Malignancy (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'altDiagnosis', label:'Alternative Diagnosis Less Likely (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }],
  compute: (v) => { const dvt=parseFloat(v.dvtSymptoms)||0; const pe=parseFloat(v.peLikely)||0; const hr=parseFloat(v.hr)||0; const immob=parseFloat(v.immobilization)||0; const hemo=parseFloat(v.hemoptysis)||0; const mal=parseFloat(v.malignancy)||0; const alt=parseFloat(v.altDiagnosis)||0; const score=dvt*3+pe*3+hr*1.5+immob*1.5+hemo*1+mal*1+alt*3; return { result:score, label:'Wells Score for PE', steps:[{ label:'Clinical Components', value:score.toFixed(1) }] } },
  description: 'Wells criteria for pulmonary embolism estimate pre-test probability of PE based on clinical presentation.',
  formula: 'Score = DVT symptoms(3) + PE likely(3) + HR>100(1.5) + Immobilization(1.5) + Hemoptysis(1) + Malignancy(1) + Alt Dx less likely(3).',
  interpretation: 'Traditional: ≤4: PE unlikely. >4: PE likely. Simplified: PE unlikely if ≤4. D-dimer recommended for PE-unlikely group; CTPA for PE-likely group.'
}
export default calcDef
