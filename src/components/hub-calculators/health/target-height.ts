import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ motherHt: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50,'>=50'), fatherHt: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50,'>=50'), childSex: z.string().min(1) }),
  fields: [
    { name:'motherHt', label:'Mother\'s Height (cm)', type:'number', min:50, max:250, step:'0.1' },
    { name:'fatherHt', label:'Father\'s Height (cm)', type:'number', min:50, max:250, step:'0.1' },
    { name:'childSex', label:'Child\'s Sex', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }
  ],
  compute: (v) => { const mh=parseFloat(v.motherHt)||165; const fh=parseFloat(v.fatherHt)||178; let mid,target; if(v.childSex==='male'){ mid=(mh+fh+13)/2; target=mid }else{ mid=(mh+fh-13)/2; target=mid }; const rangeLow=target-8.5; const rangeHigh=target+8.5; return { result:parseFloat(target.toFixed(1)), label:'Target Height', unit:'cm', steps:[{ label:'Mid-Parental Height', value:mid.toFixed(1)+' cm' },{ label:'Predicted Height', value:target.toFixed(1)+' cm' },{ label:'Range (95% CI)', value:rangeLow.toFixed(1)+' to '+rangeHigh.toFixed(1)+' cm' }] } },
  description: 'Target height prediction using mid-parental height method (Tanner) for children.',
  formula: 'Male: (Mother Ht + Father Ht + 13)/2. Female: (Mother Ht + Father Ht - 13)/2. Range: ±8.5 cm.',
  interpretation: 'Target height ±8.5 cm represents 95% confidence interval. Serial measurements track growth trajectory.'
}
export default calcDef
