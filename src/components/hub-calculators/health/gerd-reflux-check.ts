import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ heartburnFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), regurgitationFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), chestPainFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), dysphagiaFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), odynophagia: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), coughFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4') }),
  fields: [
    { name:'heartburnFreq', label:'Heartburn Frequency (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'regurgitationFreq', label:'Regurgitation Frequency (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'chestPainFreq', label:'Chest Pain Frequency (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'dysphagiaFreq', label:'Difficulty Swallowing (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'odynophagia', label:'Painful Swallowing (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'coughFreq', label:'Chronic Cough / Hoarseness (0-4)', type:'number', min:0, max:4, step:'1' }
  ],
  compute: (v) => { const s=parseInt(v.heartburnFreq||'0')+parseInt(v.regurgitationFreq||'0')+parseInt(v.chestPainFreq||'0')+parseInt(v.dysphagiaFreq||'0')+parseInt(v.odynophagia||'0')+parseInt(v.coughFreq||'0'); let sev='Low probability'; if(s>=15) sev='High probability GERD'; else if(s>=9) sev='Moderate probability GERD'; return { result:s, label:'GERD Symptom Score', unit:'/24', steps:[{ label:'Score', value:s+'/24' },{ label:'Assessment', value:sev }] } },
  description: 'GERD symptom assessment based on frequency and severity of reflux-related symptoms.',
  formula: 'Sum of 6 symptom domains scored 0-4. Range 0-24.',
  interpretation: '0-8 Low probability GERD, 9-14 Moderate probability, 15-24 High probability GERD.'
}
export default calcDef
