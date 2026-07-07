import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hip: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'hip', label:'Hip Circumference (cm)', type:'number', min:40, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const hip=parseFloat(v.hip)||90; const h=parseFloat(v.height)||170; const g=v.gender||'male'; const bai=(hip/(h**1.5)-18); const adj=g==='female'?bai:bai-5; return { result:adj, label:'Body Adiposity Index', unit:'%', steps:[{ label:'BAI = (Hip/H^1.5)-18', value:bai.toFixed(1) },{ label:'Gender-Adj', value:adj.toFixed(1) }] } },
  description: 'Body adiposity index using hip circumference and height as a DXA-correlated measure.',
  formula: 'BAI = (hip(cm)/height(m)^1.5)-18. Reference: 21-33% female, 8-21% male.',
  interpretation: 'Higher BAI indicates greater adiposity. Correlates with DXA body fat % but less accurate in athletes.'
}

export default calcDef
