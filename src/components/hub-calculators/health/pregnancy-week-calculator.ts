import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ lmpDay: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=31,'1-31'), lmpMonth: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=12,'1-12'), lmpYear: z.string().min(1,'Required').refine(v=>parseInt(v)>=2000,'>=2000'), cycleLength: z.string().min(1,'Required').refine(v=>parseInt(v)>=21&&parseInt(v)<=45,'21-45') }),
  fields: [
    { name:'lmpDay', label:'LMP Day (1-31)', type:'number', min:1, max:31, step:'1' },
    { name:'lmpMonth', label:'LMP Month (1-12)', type:'number', min:1, max:12, step:'1' },
    { name:'lmpYear', label:'LMP Year', type:'number', min:2000, max:2100, step:'1' },
    { name:'cycleLength', label:'Cycle Length (days)', type:'number', min:21, max:45, step:'1' }
  ],
  compute: (v) => { const d=parseInt(v.lmpDay)||1; const m=parseInt(v.lmpMonth)||1; const y=parseInt(v.lmpYear)||2024; const cycle=parseInt(v.cycleLength)||28; const lmpDate=new Date(y,m-1,d); const conceptionDate=new Date(lmpDate.getTime()+(cycle-14)*86400000); const edd=new Date(lmpDate.getTime()+280*86400000); const today=new Date(); const pregDays=Math.round((today.getTime()-lmpDate.getTime())/86400000); const weeks=Math.floor(pregDays/7); const days=pregDays%7; const totalWeeks=weeks+days/7; const trimester=totalWeeks<13?'First':totalWeeks<27?'Second':'Third'; const daysToEdd=Math.round((edd.getTime()-today.getTime())/86400000); return { result:weeks+'+'+days, label:'Gestational Age', steps:[{ label:'Gestational Age', value:weeks+' weeks, '+days+' days' },{ label:'Trimester', value:trimester },{ label:'Estimated Conception', value:conceptionDate.toLocaleDateString() },{ label:'Estimated Due Date (EDD)', value:edd.toLocaleDateString() },{ label:'Days Until EDD', value:daysToEdd+'' }] } },
  description: 'Pregnancy week calculator based on last menstrual period (LMP) and cycle length.',
  formula: 'EDD = LMP + 280 days (40 weeks). Conception ≈ LMP + (cycle-14) days. Gestational age = days from LMP / 7.',
  interpretation: 'Full term: 39-40 weeks. Preterm: <37 weeks. Post-term: >42 weeks. Trimester: 1st <13w, 2nd 13-27w, 3rd >27w.'
}
export default calcDef
