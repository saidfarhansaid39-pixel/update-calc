import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tickAttachment: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), erythemaMigrans: z.string().min(1,'Required'), endemicArea: z.string().min(1,'Required') }),
  fields: [{ name:'tickAttachment', label:'Tick Attachment (hours)', type:'number', min:0, step:'1' }, { name:'erythemaMigrans', label:'Erythema Migrans Present?', type:'select', options:[{value:'yes',label:'Yes'},{value:'no',label:'No'}] }, { name:'endemicArea', label:'Endemic Area?', type:'select', options:[{value:'yes',label:'Yes'},{value:'no',label:'No'}] }],
  compute: (v) => { const hrs=parseFloat(v.tickAttachment)||0; const em=v.erythemaMigrans||'no'; const endemic=v.endemicArea||'no'; let risk='Low'; const riskVal=em==='yes'?3:hrs>72?2:hrs>36&&endemic==='yes'?1:0; if(em==='yes')risk='High - Active Lyme'; else if(hrs>36&&endemic==='yes')risk='Moderate - Prophylaxis Consider'; else if(hrs>72)risk='Moderate-High'; return { result:riskVal, label:risk, unit:'', steps:[{ label:'Attachment Duration', value:hrs.toFixed(0)+' hours' },{ label:'Risk Category', value:risk }] } },
  description: 'Lyme disease risk assessment based on tick attachment duration, symptoms, and geographic exposure.',
  formula: 'Risk scoring: EM rash = high risk; attachment >36h in endemic area = moderate risk (prophylaxis indicated).',
  interpretation: 'High: EM rash diagnostic, treat with doxycycline. Moderate (attachment >36h, endemic): single-dose doxycycline prophylaxis (200mg). Low: observe.'
}

export default calcDef
