import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ drinks: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hours: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'drinks', label:'Standard Drinks', type:'number', min:0, step:'0.5' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'hours', label:'Hours Drinking', type:'number', min:0, step:'0.5' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const d=parseFloat(v.drinks)||0; const w=parseFloat(v.weight)||70; const h=parseFloat(v.hours)||0; const g=v.gender||'male'; const r=g==='male'?0.68:0.55; const bac=Math.max(0,(d*14)/(r*w*1000)*100-h*0.015); let level='Sober'; if(bac>=0.4) level='Life-threatening'; else if(bac>=0.3) level='Severe'; else if(bac>=0.15) level='Significant impairment'; else if(bac>=0.08) level='Legally impaired'; else if(bac>=0.04) level='Mild impairment'; return { result:bac, label:'BAC', unit:'%', steps:[{ label:'BAC (Widmark)', value:bac.toFixed(3) },{ label:'Status', value:level }] } },
  description: 'Blood alcohol content via Widmark formula with metabolism adjustment.',
  formula: 'BAC = (drinks×14g)/(weight×1000×r)×100 - 0.015×hours. r=0.68 male, 0.55 female.',
  interpretation: '0.02-0.04: Mild relaxation; 0.05-0.07: Euphoria; 0.08: Legal limit; 0.15-0.30: Confusion; >0.30: Coma risk.'
}

export default calcDef
