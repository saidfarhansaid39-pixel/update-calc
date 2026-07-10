import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ sleepHours: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0&&parseFloat(v)<=24,'0-24'), sleepLatency: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), nightWakes: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), restorative: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=5,'1-5'), daytimeDrowsiness: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=5,'1-5') }),
  fields: [{ name:'sleepHours', label:'Actual Sleep Duration (hours)', type:'number', min:0, max:24, step:'0.1' }, { name:'sleepLatency', label:'Time to Fall Asleep (min)', type:'number', min:0, max:180, step:'1' }, { name:'nightWakes', label:'Night Wakes', type:'number', min:0, max:20, step:'1' }, { name:'restorative', label:'Feeling Restored (1-5)', type:'number', min:1, max:5, step:'1' }, { name:'daytimeDrowsiness', label:'Daytime Drowsiness (1-5)', type:'number', min:1, max:5, step:'1' }],
  compute: (v) => { const h=parseFloat(v.sleepHours)||7; const lat=parseInt(v.sleepLatency)||15; const wakes=parseInt(v.nightWakes)||1; const rest=parseInt(v.restorative)||3; const drowsy=parseInt(v.daytimeDrowsiness)||3; const eff=((h/(h+lat/60))*100)*(1-wakes/20)*(rest/5)*((6-drowsy)/5); const score=Math.min(100,Math.round(eff*100)/100); let grade='Poor'; if(score>=80) grade='Excellent'; else if(score>=60) grade='Good'; else if(score>=40) grade='Fair'; return { result:score, label:'Sleep Quality Index', unit:'/100', steps:[{ label:'Efficiency Score', value:eff.toFixed(1) },{ label:'Sleep Quality', value:grade }] } },
  description: 'Multi-domain sleep quality index based on duration, latency, continuity, and restoration.',
  formula: 'Quality = efficiency × (1-wakes/20) × restoration × (1-drowsiness/5) scaled to 100.',
  interpretation: '≥80 Excellent, 60-79 Good, 40-59 Fair, <40 Poor sleep quality.'
}
export default calcDef
