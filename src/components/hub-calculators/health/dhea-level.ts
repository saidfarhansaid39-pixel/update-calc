import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dhea: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), gender: z.enum(['male','female']) }),
  fields: [{ name:'dhea', label:'DHEA-S (µg/dL)', type:'number', min:0, max:1000, step:'1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const d=parseFloat(v.dhea)||0; const a=parseFloat(v.age)||40; const g=v.gender||'female'; let low=0, high=0; if(g==='female'){if(a<30){low=45;high=430;}else if(a<40){low=25;high=245;}else if(a<50){low=12;high=130;}else{low=5;high=80;}}else{if(a<30){low=160;high=790;}else if(a<40){low=80;high=510;}else if(a<50){low=35;high=280;}else{low=10;high=140;}} const status=d<low?'Low - adrenal insufficiency possible':d>high?'High - adrenal hyperfunction':'Normal range'; return { result:d, label:'DHEA-S', unit:'µg/dL', steps:[{ label:'DHEA-S Level', value:d.toFixed(0) },{ label:'Age/Gender Range', value:low+'-'+high },{ label:'Status', value:status }] } },
  description: 'DHEA-S level interpretation with age and gender-specific reference ranges.',
  formula: 'DHEA-S declines with age. Female ranges younger to older: 45-430, 25-245, 12-130, 5-80 µg/dL.',
  interpretation: 'Low: adrenal insufficiency, hypopituitarism. High: adrenal hyperplasia, adrenal tumor. Declines naturally with age.'
}

export default calcDef
