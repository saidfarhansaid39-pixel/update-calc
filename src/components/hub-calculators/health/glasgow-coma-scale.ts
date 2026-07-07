import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ eye: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), verbal: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), motor: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1') }),
  fields: [{ name:'eye', label:'Eye Opening (1-4)', type:'number', min:1, max:4, step:'1' }, { name:'verbal', label:'Verbal (1-5)', type:'number', min:1, max:5, step:'1' }, { name:'motor', label:'Motor (1-6)', type:'number', min:1, max:6, step:'1' }],
  compute: (v) => { const e=parseInt(v.eye)||4; const ve=parseInt(v.verbal)||5; const m=parseInt(v.motor)||6; const total=e+ve+m; const sev=total<=8?'Severe (GCS≤8)':total<=12?'Moderate (9-12)':'Mild (13-15)'; const intubation=total<=8; return { result:total, label:'GCS Score', unit:'', steps:[{ label:'Eye (1-4)', value:e.toString() },{ label:'Verbal (1-5)', value:ve.toString() },{ label:'Motor (1-6)', value:m.toString() },{ label:'Total (3-15)', value:total.toString() },{ label:'Severity', value:sev },{ label:'Intubation?', value:intubation?'Yes - airway protection':'No - monitor' }] } },
  description: 'Glasgow Coma Scale for consciousness level assessment in trauma and neuro emergencies.',
  formula: 'GCS = Eye (1-4) + Verbal (1-5) + Motor (1-6). Range 3-15. Best score used for serial assessment.',
  interpretation: '≤8: Severe, intubation indicated. 9-12: Moderate brain injury. 13-15: Mild/concussion.'
}

export default calcDef
