import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ wakeHour: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=23,'0-23'), wakeMin: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=59,'0-59'), cycles: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=6,'1-6') }),
  fields: [{ name:'wakeHour', label:'Desired Wake Hour (0-23)', type:'number', min:0, max:23, step:'1' }, { name:'wakeMin', label:'Desired Wake Minute (0-59)', type:'number', min:0, max:59, step:'1' }, { name:'cycles', label:'Sleep Cycles', type:'number', min:1, max:6, step:'1' }],
  compute: (v) => { const wh=parseInt(v.wakeHour)||6; const wm=parseInt(v.wakeMin)||0; const c=parseInt(v.cycles)||5; const wakeMinTotal=wh*60+wm; const steps=[]; for(let i=1;i<=c;i++){ const b=wakeMinTotal-i*90; const bh=((Math.floor(b/60)%24)+24)%24; const bm=b%60; steps.push({ label:'Bedtime -'+i+' Cycle(s)', value:String(bh).padStart(2,'0')+':'+String(bm).padStart(2,'0') }) } return { result:steps[steps.length-1]?.value||'22:30', label:'Recommended Bedtime', steps } },
  description: 'Calculates optimal bedtimes based on desired wake time and 90-minute sleep cycles.',
  formula: 'Bedtime = Wake time - (N × 90 min). Count backward in 90-min cycle increments.',
  interpretation: 'Adjust bedtime to wake at a cycle boundary for refreshed feeling. 5-6 cycles recommended.'
}
export default calcDef
