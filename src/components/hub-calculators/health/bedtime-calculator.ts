import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wakeTime: z.string().min(1,'Required'), cycles: z.string().min(1,'Required').refine(v=>parseInt(v)>=1,'≥1') }),
  fields: [{ name:'wakeTime', label:'Wake Time (24h)', type:'number', min:0, max:24, step:'0.25' }, { name:'cycles', label:'Sleep Cycles (1-8)', type:'number', min:1, max:8, step:'1' }],
  compute: (v) => { const wt=parseFloat(v.wakeTime)||7; const c=parseInt(v.cycles)||5; const hrs=c*1.5; let bt=wt-hrs; if(bt<0) bt+=24; const bth=Math.floor(bt); const btm=Math.round((bt-bth)*60); return { result:bt, label:'Bedtime', unit:':00', steps:[{ label:'Cycles × 90min', value:hrs.toFixed(1)+'h' },{ label:'Bedtime', value:bth+':'+btm.toString().padStart(2,'0') }] } },
  description: 'Optimal bedtime based on wake time and 90-minute sleep cycles.',
  formula: 'Bedtime = WakeTime - (Cycles × 90min). Each sleep cycle ~90 minutes.',
  interpretation: 'Aim for 5-6 cycles (7.5-9h). Waking mid-cycle causes grogginess. Complete cycles improve alertness.'
}

export default calcDef
