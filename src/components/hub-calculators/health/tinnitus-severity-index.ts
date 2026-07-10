import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ loudness: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=5,'1-5'), duration: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), sleepDisturb: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), concentration: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), hearingDiff: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), distress: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4') }),
  fields: [
    { name:'loudness', label:'Tinnitus Loudness (1=very faint, 5=very loud)', type:'number', min:1, max:5, step:'1' },
    { name:'duration', label:'Duration of Episodes (0=never, 1=occasional, 2=frequent, 3=constant, 4=continuous)', type:'number', min:0, max:4, step:'1' },
    { name:'sleepDisturb', label:'Sleep Disturbance (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'concentration', label:'Concentration Difficulty (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'hearingDiff', label:'Hearing Difficulty (0-4)', type:'number', min:0, max:4, step:'1' },
    { name:'distress', label:'Emotional Distress (0-4)', type:'number', min:0, max:4, step:'1' }
  ],
  compute: (v) => { const l=parseInt(v.loudness)||3; const d=parseInt(v.duration)||2; const s=parseInt(v.sleepDisturb)||0; const c=parseInt(v.concentration)||0; const h=parseInt(v.hearingDiff)||0; const e=parseInt(v.distress)||0; const score=l*2+d*3+s*3+c*2+h+3*e; let sev='Mild'; if(score>=46) sev='Catastrophic'; else if(score>=36) sev='Severe'; else if(score>=26) sev='Moderate'; else if(score>=16) sev='Mild-Moderate'; return { result:score, label:'Tinnitus Severity Index', unit:'/60', steps:[{ label:'Loudness', value:(l*2)+'/10' },{ label:'Duration', value:(d*3)+'/12' },{ label:'Sleep', value:(s*3)+'/12' },{ label:'Concentration', value:(c*2)+'/8' },{ label:'Hearing', value:h+'/4' },{ label:'Distress', value:(e*3)+'/12' },{ label:'Severity Level', value:sev }] } },
  description: 'Tinnitus Severity Index assessing loudness, duration, sleep, concentration, hearing, and distress.',
  formula: 'Weighted score = loudness×2 + duration×3 + sleep×3 + concentration×2 + hearing + distress×3. Range 0-60.',
  interpretation: '0-15 Mild, 16-25 Mild-Moderate, 26-35 Moderate, 36-45 Severe, 46-60 Catastrophic tinnitus impact.'
}
export default calcDef
