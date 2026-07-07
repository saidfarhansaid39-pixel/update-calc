import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lmp: z.string().min(1,'Required'), cycleLength: z.string().min(1,'Required').refine(v=>parseFloat(v)>=21,'≥21') }),
  fields: [{ name:'lmp', label:'LMP Day of Year (1-365)', type:'number', min:1, max:365, step:'1' }, { name:'cycleLength', label:'Cycle Length (days)', type:'number', min:21, max:45, step:'1' }],
  compute: (v) => { const lmp=parseInt(v.lmp)||1; const cycle=parseFloat(v.cycleLength)||28; const today=new Date(); const doy=Math.floor((today.getTime()-new Date(today.getFullYear(),0,0).getTime())/86400000); let gaDays=doy-lmp-14; const adjCycle=cycle-28; gaDays-=adjCycle; const gaWeeks=Math.max(0,Math.floor(gaDays/7)); const gaDaysRem=gaDays%7; return { result:gaWeeks+gaDaysRem/7, label:'Gestational Age', unit:'weeks', steps:[{ label:'GA Days = Today-LMP-14+(C-28)', value:gaDays.toString()+' days' },{ label:'GA in Weeks', value:gaWeeks.toString()+'+'+gaDaysRem.toString() }] } },
  description: 'Gestational age calculation from LMP with cycle length adjustment.',
  formula: 'GA = (current date - LMP - 14 days + (cycle-28)) / 7 weeks.',
  interpretation: 'Accuracy depends on regular cycles. Dating US in first trimester is gold standard.'
}

export default calcDef
