import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cco2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), cao2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), cvo2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'cco2', label:'Pulmonary Capillary O₂ Content (mL/dL)', type:'number', min:10, max:25, step:'0.1' }, { name:'cao2', label:'Arterial O₂ Content (mL/dL)', type:'number', min:10, max:22, step:'0.1' }, { name:'cvo2', label:'Venous O₂ Content (mL/dL)', type:'number', min:5, max:18, step:'0.1' }],
  compute: (v) => { const cc=parseFloat(v.cco2)||20; const ca=parseFloat(v.cao2)||18; const cv=parseFloat(v.cvo2)||13; const qsq=(cc-ca)/(cc-cv)*100; return { result:qsq, label:'Shunt Fraction (Qs/Qt)', unit:'%', steps:[{ label:'Capillary O₂', value:cc.toFixed(1)+' mL/dL' },{ label:'Arterial O₂', value:ca.toFixed(1)+' mL/dL' },{ label:'Venous O₂', value:cv.toFixed(1)+' mL/dL' },{ label:'Shunt Fraction', value:qsq.toFixed(1)+'%' }] } },
  description: 'Shunt fraction (Qs/Qt) quantifies the proportion of cardiac output that bypasses pulmonary gas exchange.',
  formula: 'Qs/Qt = (CcO₂ - CaO₂) / (CcO₂ - CvO₂) × 100%. Calculated via Berggren equation.',
  interpretation: 'Normal: <5%. Minimal shunt: 5-10%. Significant shunt: 10-20%. Severe shunt: >20%. Causes: ARDS, pneumonia, pulmonary edema, AV malformations. High shunt → refractory hypoxemia.'
}
export default calcDef
