import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ transferType: z.string().min(1,'Required'), transferDate: z.string().min(1,'Required'), embryoAge: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'≥0'), hcgLevel: z.string().min(1,'Required') }),
  fields: [{ name:'transferType', label:'Transfer Type', type:'select', options:[{value:'fresh',label:'Fresh Embryo Transfer'},{value:'frozen',label:'Frozen Embryo Transfer'},{value:'day3',label:'Day 3 Transfer'},{value:'day5',label:'Day 5 Blastocyst'}] }, { name:'transferDate', label:'Transfer Date', type:'select', options:[{value:'today',label:'Today'},{value:'yesterday',label:'Yesterday'},{value:'2days',label:'2 Days Ago'},{value:'3days',label:'3 Days Ago'},{value:'5days',label:'5 Days Ago'}] }, { name:'embryoAge', label:'Embryo Age (days)', type:'number', min:0, max:6, step:'1' }, { name:'hcgLevel', label:'hCG Level (mIU/mL)', type:'number', min:0, step:'1' }],
  compute: (v) => { const offset=({today:0,yesterday:1,'2days':2,'3days':3,'5days':5} as Record<string, number>)[v.transferDate]||0; const emb=parseInt(v.embryoAge)||5; const dpo=emb===5?offset+9:emb===3?offset+11:offset+9; const hcg=parseFloat(v.hcgLevel)||0; const hcgN=hcg<5?'Negative':hcg<25?'Indeterminate':hcg<50?'Early positive':hcg<200?'Positive':'Strong positive'; return { result:dpo, label:'Days Post Ovulation', unit:'dpo', steps:[{ label:'Transfer', value:v.transferType },{ label:'Days Since Transfer', value:offset.toString() },{ label:'Implantation Day', value:'~'+dpo+' dpo' },{ label:'hCG Result', value:hcgN }] } },
  description: 'Implantation date estimation from embryo transfer details and hCG levels for IVF monitoring.',
  formula: 'DPO = days since transfer + embryo age correction (blastocyst=9, day3=11). hCG >25 mIU/mL = positive. Doubling every 48h in early pregnancy.',
  interpretation: 'hCG >25 at 9dpo suggests implantation. hCG <5: no implantation. Serial hCG q48h should rise >53% for viable intrauterine pregnancy.'
}

export default calcDef
