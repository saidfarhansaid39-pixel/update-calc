import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ hoursSlept: z.string().min(1,'Required').refine(v=>parseFloat(v)>0&&parseFloat(v)<=24,'0-24'), hoursNeeded: z.string().min(1,'Required').refine(v=>parseFloat(v)>0&&parseFloat(v)<=24,'0-24'), days: z.string().min(1,'Required').refine(v=>parseInt(v)>0,'>0') }),
  fields: [{ name:'hoursSlept', label:'Avg Hours Slept per Night', type:'number', min:1, max:24, step:'0.1' }, { name:'hoursNeeded', label:'Hours Needed per Night', type:'number', min:1, max:24, step:'0.1' }, { name:'days', label:'Number of Days', type:'number', min:1, max:365, step:'1' }],
  compute: (v) => { const slept=parseFloat(v.hoursSlept)||6; const need=parseFloat(v.hoursNeeded)||8; const d=parseInt(v.days)||7; const debtPerDay=need-slept; const totalDebt=debtPerDay*d; const recoveryDays=totalDebt>0?Math.ceil(totalDebt/2):0; return { result:totalDebt, label:'Total Sleep Debt', unit:'hours', steps:[{ label:'Daily Deficit', value:debtPerDay.toFixed(1)+' h' },{ label:'Total Debt', value:totalDebt.toFixed(1)+' h' },{ label:'Est. Recovery Time', value:recoveryDays>0?recoveryDays+' days':'None needed' }] } },
  description: 'Calculates accumulated sleep debt over a period.',
  formula: 'Sleep Debt = (Hours Needed - Hours Slept) × Days. Recovery: ~2 hours extra per day.',
  interpretation: 'Sleep debt above 5 hours may impair cognition. Recovery requires consistent extra sleep.'
}
export default calcDef
