import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ generalizedCount: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), focalCount: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), absenceCount: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), daysTracked: z.string().min(1,'Required').refine(v=>parseInt(v)>=1,'>=1'), medAdherence: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=100,'0-100'), triggersIdentified: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0') }),
  fields: [
    { name:'generalizedCount', label:'Generalized Tonic-Clonic Seizures', type:'number', min:0, max:100, step:'1' },
    { name:'focalCount', label:'Focal Seizures', type:'number', min:0, max:100, step:'1' },
    { name:'absenceCount', label:'Absence Seizures', type:'number', min:0, max:100, step:'1' },
    { name:'daysTracked', label:'Days Tracked', type:'number', min:1, max:365, step:'1' },
    { name:'medAdherence', label:'Medication Adherence (%)', type:'number', min:0, max:100, step:'1' },
    { name:'triggersIdentified', label:'Triggers Identified (e.g. missed sleep, stress, alcohol)', type:'number', min:0, max:20, step:'1' }
  ],
  compute: (v) => { const gen=parseInt(v.generalizedCount)||0; const foc=parseInt(v.focalCount)||0; const abs=parseInt(v.absenceCount)||0; const days=parseInt(v.daysTracked)||30; const adh=parseInt(v.medAdherence)||80; const trig=parseInt(v.triggersIdentified)||0; const total=gen+foc+abs; const freqPerWeek=total/days*7; const severityScore=gen*3+foc*1.5+abs*1; const controlScore=Math.round(Math.max(0,100-(severityScore/days*100)+(adh/10)+(trig*2))); let control='Good'; if(controlScore<40) control='Poor'; else if(controlScore<60) control='Fair'; return { result:parseFloat(freqPerWeek.toFixed(1)), label:'Seizure Frequency (per week)', steps:[{ label:'Total Seizures', value:total+'' },{ label:'Frequency/Week', value:freqPerWeek.toFixed(1) },{ label:'Severity Score', value:severityScore.toFixed(1) },{ label:'Control Score', value:controlScore+'/100 ('+control+')' }] } },
  description: 'Seizure tracking calculator computing frequency, severity score, and control index.',
  formula: 'Weekly frequency = total/days×7. Severity = gen×3 + focal×1.5 + absence×1. Control = 100 - severity + adherence + triggers.',
  interpretation: 'Higher frequency and lower control score indicate need for medication review. Triggers reduction improves control.'
}
export default calcDef
