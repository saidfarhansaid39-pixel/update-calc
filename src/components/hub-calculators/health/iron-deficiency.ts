import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hemoglobin: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), mcv: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), ferritin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), tsat: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), tibc: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), anemiaSeverity: z.string().min(1,'Required') }),
  fields: [{ name:'hemoglobin', label:'Hemoglobin (g/dL)', type:'number', min:0, step:'0.1' }, { name:'mcv', label:'MCV (fL)', type:'number', min:0, step:'1' }, { name:'ferritin', label:'Ferritin (ng/mL)', type:'number', min:0, step:'1' }, { name:'tsat', label:'Transferrin Saturation (%)', type:'number', min:0, max:100, step:'1' }, { name:'tibc', label:'TIBC (µg/dL)', type:'number', min:0, step:'1' }, { name:'anemiaSeverity', label:'Anemia Severity', type:'select', options:[{value:'mild',label:'Mild (10-12 g/dL)'},{value:'moderate',label:'Moderate (8-10 g/dL)'},{value:'severe',label:'Severe (<8 g/dL)'},{value:'not-anemic',label:'Not Anemic (≥12)'}] }],
  compute: (v) => { const hb=parseFloat(v.hemoglobin)||12; const mcv=parseFloat(v.mcv)||90; const fer=parseFloat(v.ferritin)||50; const ts=parseFloat(v.tsat)||25; const tibc=parseFloat(v.tibc)||250; const ironDef=fer<30||ts<20; const aci=mcv<80&&!ironDef?'Anemia of chronic disease suspected':mcv<80&&ironDef?'Iron deficiency anemia (microcytic)':mcv>100?'Macrocytic anemia (B12/folate suspected)':'Normocytic investigations'; return { result:ironDef?1:0, label:'Iron Deficiency', unit:'', steps:[{ label:'Hb', value:hb.toFixed(1)+' g/dL' },{ label:'MCV', value:mcv.toString()+' fL' },{ label:'Ferritin', value:fer.toString()+' ng/mL' },{ label:'TSAT', value:ts.toString()+'%' },{ label:'TIBC', value:tibc.toString()+' µg/dL' },{ label:'Assessment', value:aci }] } },
  description: 'Iron deficiency anemia diagnostic workup using Hb, MCV, ferritin, TSAT, and TIBC with differential diagnosis.',
  formula: 'Iron deficiency if ferritin <30 (absolute) or TSAT <20% (functional). Anemia of chronic disease: ferritin >100, TSAT <20%. MCV <80 = microcytic.',
  interpretation: 'Ferritin <30 + TSAT <20%: absolute iron deficiency. Ferritin 30-100 + TSAT <20%: functional deficiency. MCV <80 + elevated RDW: classic IDA. Low retic count: hypoproliferative.'
}

export default calcDef
