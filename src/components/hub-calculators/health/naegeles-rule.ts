import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lmpYear: z.string().min(1,'Required').refine(v=>parseInt(v)>=1900,'>=1900'), lmpMonth: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=12,'1-12'), lmpDay: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=31,'1-31') }),
  fields: [{ name:'lmpYear', label:'LMP Year', type:'number', min:1900, max:2100, step:'1' }, { name:'lmpMonth', label:'LMP Month (1-12)', type:'number', min:1, max:12, step:'1' }, { name:'lmpDay', label:'LMP Day (1-31)', type:'number', min:1, max:31, step:'1' }],
  compute: (v) => { let y=parseInt(v.lmpYear)||2024; let m=parseInt(v.lmpMonth)||1; let d=parseInt(v.lmpDay)||1; d+=7; m-=3; if(m<=0){m+=12;y-=1} if(d>new Date(y,m,0).getDate()){d-=new Date(y,m,0).getDate();m+=1} if(m>12){m-=12;y+=1} const edd=`${m.toString().padStart(2,'0')}/${d.toString().padStart(2,'0')}/${y}`; const now=new Date(); const eddDate=new Date(y,m-1,d); const diffMs=eddDate.getTime()-now.getTime(); const weeksLeft=Math.max(0,Math.floor(diffMs/(7*86400000))); return { result:edd, label:'Estimated Due Date', unit:'', steps:[{ label:'LMP', value:`${v.lmpMonth}/${v.lmpDay}/${v.lmpYear}` },{ label:'EDD (Naegele)', value:edd },{ label:'Weeks Remaining', value:weeksLeft.toFixed(0)+' weeks' }] } },
  description: 'Naegele\'s rule estimates the expected delivery date from the first day of the last menstrual period.',
  formula: 'EDD = LMP + 7 days - 3 months + 1 year. Based on 280-day (40-week) gestational duration.',
  interpretation: 'EDD is an estimate; only ~5% deliver exactly on EDD. Normal delivery range: 37-42 weeks gestation.'
}

export default calcDef
