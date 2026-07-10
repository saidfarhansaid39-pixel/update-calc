import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=18,'>=18'), gender: z.string().min(1), neckLump: z.string().min(1), swallowingDifficulty: z.string().min(1), voiceChange: z.string().min(1), familyThyroid: z.string().min(1), radiationExposure: z.string().min(1), thyroidFunction: z.string().min(1), noduleSize: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:18, max:100, step:'1' },
    { name:'gender', label:'Gender', type:'select', options:[{ label:'Female', value:'female' },{ label:'Male', value:'male' }] },
    { name:'neckLump', label:'Neck lump or fullness?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'2' }] },
    { name:'swallowingDifficulty', label:'Difficulty swallowing or breathing?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'3' }] },
    { name:'voiceChange', label:'Hoarseness or voice change?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'2' }] },
    { name:'familyThyroid', label:'Family history of thyroid cancer?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'2' }] },
    { name:'radiationExposure', label:'History of neck radiation?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'3' }] },
    { name:'thyroidFunction', label:'Thyroid function', type:'select', options:[{ label:'Normal', value:'normal' },{ label:'Hypothyroid', value:'hypo' },{ label:'Hyperthyroid', value:'hyper' }] },
    { name:'noduleSize', label:'Thyroid Nodule Size (cm, 0 if none)', type:'number', min:0, max:10, step:'0.1' }
  ],
  compute: (v) => { let score=0; const age=parseInt(v.age)||45; if(age>=65) score+=2; else if(age>=45) score+=1; if(v.gender==='male') score+=1; score+=parseInt(v.neckLump||'0'); score+=parseInt(v.swallowingDifficulty||'0'); score+=parseInt(v.voiceChange||'0'); score+=parseInt(v.familyThyroid||'0'); score+=parseInt(v.radiationExposure||'0'); const nodule=parseFloat(v.noduleSize)||0; if(nodule>=4) score+=3; else if(nodule>=2) score+=2; else if(nodule>0) score+=1; let risk='Low'; if(score>=8) risk='High'; else if(score>=4) risk='Moderate'; let rec='Routine monitoring'; if(risk==='High') rec='Endocrinology referral, consider FNA'; else if(risk==='Moderate'&&nodule>=1.5) rec='Consider ultrasound follow-up'; return { result:score, label:'Thyroid Cancer Risk Score', unit:'/17', steps:[{ label:'Demographic Score', value:(age>=65?2:age>=45?1:0)+(v.gender==='male'?1:0)+'/3' },{ label:'Clinical Score', value:parseInt(v.neckLump||'0')+parseInt(v.swallowingDifficulty||'0')+parseInt(v.voiceChange||'0')+'/7' },{ label:'Risk Factor Score', value:parseInt(v.familyThyroid||'0')+parseInt(v.radiationExposure||'0')+'/5' },{ label:'Nodule Score', value:(nodule>=4?3:nodule>=2?2:nodule>0?1:0)+'/3' },{ label:'Total Score', value:score+'/17' },{ label:'Risk Level', value:risk },{ label:'Recommendation', value:rec }] } },
  description: 'Thyroid cancer risk assessment based on clinical presentation and risk factors.',
  formula: 'Weighted score: age, male gender, neck mass, compressive symptoms, family history, radiation, nodule size.',
  interpretation: '0-3 Low risk, 4-7 Moderate risk, ≥8 High risk. Nodules ≥1.5cm with moderate-high risk warrant FNA per guidelines.'
}
export default calcDef
