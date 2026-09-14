import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pamp: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), rap: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'pamp', label:'Pulmonary Artery Mean Pressure (mmHg)', type:'number', min:5, max:80, step:'1' }, { name:'rap', label:'Right Atrial Pressure (mmHg)', type:'number', min:0, max:20, step:'1' }],
  compute: (v) => { const pamp=parseFloat(v.pamp)||20; const rap=parseFloat(v.rap)||5; const w=pamp-0.6*(pamp-rap); return { result:w, label:'Estimated Pulmonary Capillary Wedge Pressure', unit:'mmHg', steps:[{ label:'PA Mean', value:pamp.toFixed(0)+' mmHg' },{ label:'RAP', value:rap.toFixed(0)+' mmHg' },{ label:'Estimated PCWP', value:w.toFixed(0)+' mmHg' }] ,
    extras: [
      { label: "Medical disclaimer", value: "This is for informational purposes only. Consult a healthcare provider." },
      { label: "Individual variation", value: "Results may vary by age, sex, ethnicity, and medical history." },
      { label: "Trend note", value: "Track measurements over time rather than relying on a single reading." }
    ]} },
  description: 'Pulmonary capillary wedge pressure estimates left atrial pressure and left ventricular filling pressure.',
  formula: 'PCWP ≈ PA Mean Pressure - 0.6 × (PA Mean - RAP)',
  interpretation: 'Normal: 6-12 mmHg. Elevated >18 mmHg indicates pulmonary edema risk (cardiogenic). >25 mmHg: severe left heart failure. Low <6 mmHg suggests hypovolemia.'
}
export default calcDef
