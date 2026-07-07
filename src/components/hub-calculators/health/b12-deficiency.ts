import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ b12: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), mma: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), homocysteine: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'b12', label:'Vitamin B12 (pg/mL)', type:'number', min:50, max:2000, step:'1' }, { name:'mma', label:'MMA (nmol/L)', type:'number', min:0, max:1000, step:'1' }, { name:'homocysteine', label:'Homocysteine (µmol/L)', type:'number', min:0, max:100, step:'1' }],
  compute: (v) => { const b=parseFloat(v.b12)||0; const m=parseFloat(v.mma)||0; const h=parseFloat(v.homocysteine)||0; let status=''; if(b<200&&m>271) status='Deficient - treat'; else if(b<350||m>271||h>15) status='Subclinical deficiency - check MMA/Hcy'; else status='Normal'; return { result:b, label:'B12 Level', unit:'pg/mL', steps:[{ label:'B12', value:b.toFixed(0) },{ label:'MMA', value:m.toFixed(1) },{ label:'Homocysteine', value:h.toFixed(1) },{ label:'Assessment', value:status }] } },
  description: 'Vitamin B12 deficiency assessment with MMA and homocysteine biomarkers.',
  formula: 'Deficient: B12<200 pg/mL; Borderline: 200-350; MMA>271/Hcy>15 suggests functional deficiency.',
  interpretation: 'Low B12 + elevated MMA = definite deficiency. Pernicious anemia, vegan diet, malabsorption common causes.'
}

export default calcDef
