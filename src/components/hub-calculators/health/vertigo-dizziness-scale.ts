import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ vertigoFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), vertigoSeverity: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), gaitDisturb: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), nystagmus: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), dailyActivity: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), anxiety: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4') }),
  fields: [
    { name:'vertigoFreq', label:'Vertigo Episode Frequency (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'vertigoSeverity', label:'Vertigo Severity (0=none, 4=severe, cannot stand)', type:'number', min:0, max:4, step:'1' },
    { name:'gaitDisturb', label:'Gait / Balance Disturbance (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'nystagmus', label:'Nystagmus / Oscillopsia (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'dailyActivity', label:'Impact on Daily Activities (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'anxiety', label:'Anxiety / Fear of Falling (0-4)', type:'number', min:0, max:4, step:'1' }
  ],
  compute: (v) => { const s=parseInt(v.vertigoFreq||'0')+parseInt(v.vertigoSeverity||'0')+parseInt(v.gaitDisturb||'0')+parseInt(v.nystagmus||'0')+parseInt(v.dailyActivity||'0')+parseInt(v.anxiety||'0'); let sev='Mild'; if(s>=18) sev='Severe'; else if(s>=11) sev='Moderate'; return { result:s, label:'Vertigo-Dizziness Score', unit:'/24', steps:[{ label:'Total Score', value:s+'/24' },{ label:'Severity', value:sev }] } },
  description: 'Vertigo and dizziness severity scale assessing frequency, severity, balance, and functional impact.',
  formula: 'Sum of 6 domains scored 0-4 each. Range 0-24.',
  interpretation: '0-5 Mild, 6-10 Mild-Moderate, 11-17 Moderate, 18-24 Severe vertigo/dizziness impact.'
}
export default calcDef
