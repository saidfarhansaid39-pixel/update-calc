import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ bedtimeHour: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=23,'0-23'), bedtimeMin: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=59,'0-59'), cycles: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=6,'1-6') }),
  fields: [{ name:'bedtimeHour', label:'Bedtime Hour (0-23)', type:'number', min:0, max:23, step:'1' }, { name:'bedtimeMin', label:'Bedtime Minute (0-59)', type:'number', min:0, max:59, step:'1' }, { name:'cycles', label:'Sleep Cycles', type:'number', min:1, max:6, step:'1' }],
  compute: (v) => { const h=parseInt(v.bedtimeHour)||22; const m=parseInt(v.bedtimeMin)||0; const c=parseInt(v.cycles)||5; const bedMin=h*60+m; const steps=[]; for(let i=1;i<=c;i++){ const w=bedMin+i*90; const wh=Math.floor(w/60)%24; const wm=w%60; steps.push({ label:'After '+i+' Cycle(s)', value:String(wh).padStart(2,'0')+':'+String(wm).padStart(2,'0') }) } return { result:steps[steps.length-1]?.value||'06:00', label:'Recommended Wake Time', steps } },
  description: 'Calculates optimal wake-up times based on 90-minute sleep cycles from bedtime.',
  formula: 'Wake time = Bedtime + (N × 90 min). Each cycle averages 90 minutes.',
  interpretation: 'Waking at cycle boundaries (multiples of 90 min) reduces sleep inertia. Aim for 5-6 cycles (7.5-9 h).'
}
export default calcDef
