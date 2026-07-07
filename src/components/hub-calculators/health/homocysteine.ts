import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ homocysteine: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), age: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'≥0'), gender: z.string().min(1,'Required'), folate: z.string().min(1,'Required'), b12: z.string().min(1,'Required') }),
  fields: [{ name:'homocysteine', label:'Homocysteine (µmol/L)', type:'number', min:0, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:0, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }, { name:'folate', label:'Folate (ng/mL)', type:'number', min:0, step:'0.1' }, { name:'b12', label:'Vitamin B12 (pg/mL)', type:'number', min:0, step:'1' }],
  compute: (v) => { const hcy=parseFloat(v.homocysteine)||10; const a=parseInt(v.age)||40; const norm=v.gender==='female'?6.5:8.5; const aAdj=norm+a*0.05; const sev=hcy<=norm?'Normal':hcy<=aAdj?'Borderline (age-adjusted)':hcy<=30?'Moderate':hcy<=100?'Intermediate':'Severe hyperhomocysteinemia'; const def=hcy>12&&parseFloat(v.folate)<3?'Folate deficiency':hcy>12&&parseFloat(v.b12)<200?'B12 deficiency':'No deficiency'; return { result:hcy, label:'Homocysteine', unit:'µmol/L', steps:[{ label:'Level', value:hcy.toFixed(1) },{ label:'Normal', value:norm.toFixed(1) },{ label:'Age-Adj Limit', value:aAdj.toFixed(1) },{ label:'Severity', value:sev },{ label:'Nutritional', value:def }] } },
  description: 'Homocysteine level assessment for cardiovascular and nutritional risk evaluation.',
  formula: 'Normal: 5-15 µmol/L (by lab). Age-adjusted: normal + 0.05×age. >12 suggests B12/folate/B6 deficiency.',
  interpretation: 'Elevated homocysteine is an independent CV risk factor. Causes: B12/folate/B6 deficiency, renal impairment, MTHFR mutation. Treat with B12+folate+B6.'
}

export default calcDef
