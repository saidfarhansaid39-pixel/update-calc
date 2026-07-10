import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ painScore: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=10,'0-10'), distensionScore: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=10,'0-10'), bowelDysfunction: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=10,'0-10'), qolImpact: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=10,'0-10') }),
  fields: [
    { name:'painScore', label:'Abdominal Pain (0=none, 10=worst)', type:'number', min:0, max:10, step:'1' },
    { name:'distensionScore', label:'Abdominal Distension (0=none, 10=severe)', type:'number', min:0, max:10, step:'1' },
    { name:'bowelDysfunction', label:'Bowel Dysfunction (0=normal, 10=severe)', type:'number', min:0, max:10, step:'1' },
    { name:'qolImpact', label:'Quality of Life Impact (0=none, 10=severe)', type:'number', min:0, max:10, step:'1' }
  ],
  compute: (v) => { const pain=parseInt(v.painScore)||5; const dist=parseInt(v.distensionScore)||5; const bowel=parseInt(v.bowelDysfunction)||5; const qol=parseInt(v.qolImpact)||5; const score=pain*3+dist*2+bowel*2+qol*3; let sev='Mild'; if(score>=300) sev='Severe'; else if(score>=175) sev='Moderate'; return { result:score, label:'IBS Severity Score', unit:'/500', steps:[{ label:'Pain Component', value:(pain*3)+'/150' },{ label:'Distension Component', value:(dist*2)+'/100' },{ label:'Bowel Component', value:(bowel*2)+'/100' },{ label:'QoL Component', value:(qol*3)+'/150' },{ label:'Total Score', value:score+'/500' }] } },
  description: 'IBS severity scoring system based on pain, distension, bowel dysfunction, and quality of life.',
  formula: 'Score = Pain×3 + Distension×2 + Bowel×2 + QoL×3. Range 0-500.',
  interpretation: '75-174 Mild, 175-299 Moderate, ≥300 Severe IBS. Higher scores warrant specialist referral.'
}
export default calcDef
