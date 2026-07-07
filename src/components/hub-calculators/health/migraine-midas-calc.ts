import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ missedWorkDays: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), missedHouseworkDays: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), missedNonworkDays: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), reducedWorkDays: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), reducedHouseworkDays: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'missedWorkDays', label:'Missed Work/School Days', type:'number', min:0, step:'1' }, { name:'reducedWorkDays', label:'Reduced Work/School Days (≥50%)', type:'number', min:0, step:'1' }, { name:'missedHouseworkDays', label:'Missed Household Work Days', type:'number', min:0, step:'1' }, { name:'reducedHouseworkDays', label:'Reduced Household Work Days (≥50%)', type:'number', min:0, step:'1' }, { name:'missedNonworkDays', label:'Missed Non-Work (family/social) Days', type:'number', min:0, step:'1' }],
  compute: (v) => { const w=parseFloat(v.missedWorkDays)||0; const rw=parseFloat(v.reducedWorkDays)||0; const h=parseFloat(v.missedHouseworkDays)||0; const rh=parseFloat(v.reducedHouseworkDays)||0; const nw=parseFloat(v.missedNonworkDays)||0; const score=w+rw+h+rh+nw; let grade='I (Minimal)'; let desc='Minimal disability'; if(score>=6){grade='II (Mild)';desc='Mild disability'} if(score>=11){grade='III (Moderate)';desc='Moderate disability'} if(score>=21){grade='IV (Severe)';desc='Severe disability'}; return { result:score, label:'MIDAS Score', unit:'', steps:[{ label:'Missed Work/School', value:w.toFixed(0) },{ label:'Reduced Work/School', value:rw.toFixed(0) },{ label:'Missed Housework', value:h.toFixed(0) },{ label:'Reduced Housework', value:rh.toFixed(0) },{ label:'Missed Non-work', value:nw.toFixed(0) },{ label:'Total MIDAS Score', value:score.toFixed(0) },{ label:'Grade', value:grade },{ label:'Disability Level', value:desc }] } },
  description: 'MIDAS (Migraine Disability Assessment) questionnaire quantifies headache-related disability over 3 months.',
  formula: 'MIDAS = sum of missed/reduced days across work, household, and non-work activities over past 3 months.',
  interpretation: 'Grade I (0-5): Minimal. Grade II (6-10): Mild. Grade III (11-20): Moderate. Grade IV (≥21): Severe disability.'
}

export default calcDef
