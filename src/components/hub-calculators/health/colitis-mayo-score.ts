import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ stoolFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=3,'0-3'), rectalBleeding: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=3,'0-3'), mucosalAppearance: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=3,'0-3'), physicianGlobal: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=3,'0-3') }),
  fields: [
    { name:'stoolFreq', label:'Stool Frequency (0=normal, 1=1-2/day >normal, 2=3-4/day, 3=>4/day)', type:'number', min:0, max:3, step:'1' },
    { name:'rectalBleeding', label:'Rectal Bleeding (0=none, 1=streaks, 2=obvious, 3=mostly blood)', type:'number', min:0, max:3, step:'1' },
    { name:'mucosalAppearance', label:'Mucosal Appearance at Endoscopy (0=normal, 1=mild, 2=moderate, 3=severe)', type:'number', min:0, max:3, step:'1' },
    { name:'physicianGlobal', label:'Physician Global Assessment (0=normal, 1=mild, 2=moderate, 3=severe)', type:'number', min:0, max:3, step:'1' }
  ],
  compute: (v) => { const s=parseInt(v.stoolFreq)||0; const b=parseInt(v.rectalBleeding)||0; const m=parseInt(v.mucosalAppearance)||0; const p=parseInt(v.physicianGlobal)||0; const score=s+b+m+p; let activity='Remission'; if(score>=10) activity='Severe'; else if(score>=6) activity='Moderate'; else if(score>=3) activity='Mild'; return { result:score, label:'Mayo Score', unit:'/12', steps:[{ label:'Stool Frequency', value:s+'/3' },{ label:'Rectal Bleeding', value:b+'/3' },{ label:'Mucosal Appearance', value:m+'/3' },{ label:'Physician Global', value:p+'/3' },{ label:'Disease Activity', value:activity }] } },
  description: 'Mayo Score (Disease Activity Index) for ulcerative colitis assessment.',
  formula: 'Sum of 4 subscores (0-3 each). Range 0-12.',
  interpretation: '0-2 Remission, 3-5 Mild, 6-9 Moderate, 10-12 Severe UC activity.'
}
export default calcDef
