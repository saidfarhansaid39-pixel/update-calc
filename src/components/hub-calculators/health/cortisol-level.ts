import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cortisol: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), time: z.enum(['am','pm','random','afterStim']) }),
  fields: [{ name:'cortisol', label:'Serum Cortisol (µg/dL)', type:'number', min:0, max:100, step:'0.1' }, { name:'time', label:'Collection Time', type:'select', options:[{ label:'8 AM', value:'am' },{ label:'4 PM', value:'pm' },{ label:'Random', value:'random' },{ label:'Post-ACTH Stimulation', value:'afterStim' }] }],
  compute: (v) => { const c=parseFloat(v.cortisol)||0; const t=v.time||'am'; let range='', interp=''; if(t==='am'){range='6.2-19.4'; interp=c<3?'Adrenal insufficiency suspected':c>25?'Cushing suspected':'Normal AM cortisol';}else if(t==='pm'){range='2.3-11.9'; interp=c>10?'Loss of diurnal rhythm - Cushing possible':'Normal PM cortisol';}else if(t==='afterStim'){range='>18'; interp=c>=18?'Normal adrenal response':c<18&&c>=10?'Borderline response':'Adrenal insufficiency';}else{range='varies'; interp=c<3?'Low':c>25?'High':'Normal';} return { result:c, label:'Cortisol', unit:'µg/dL', steps:[{ label:'Value', value:c.toFixed(1) },{ label:'Expected Range', value:range },{ label:'Interpretation', value:interp }] } },
  description: 'Serum cortisol interpretation with time-specific reference ranges.',
  formula: 'AM normal: 6.2-19.4 µg/dL. PM normal: 2.3-11.9. Post-ACTH: >18 normal response.',
  interpretation: 'Low AM cortisol: adrenal insufficiency. High PM cortisol/Loss of diurnal: Cushing syndrome.'
}

export default calcDef
