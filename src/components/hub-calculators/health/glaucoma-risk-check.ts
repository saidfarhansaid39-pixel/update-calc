import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), iop: z.string().min(1,'Required').refine(v=>parseFloat(v)>=5,'≥5'), familyHx: z.enum(['yes','no']), myopia: z.enum(['yes','no']), race: z.enum(['black','white','asian','hispanic']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'iop', label:'IOP (mmHg)', type:'number', min:5, max:60, step:'0.5' }, { name:'familyHx', label:'Family History of Glaucoma', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'myopia', label:'High Myopia', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'race', label:'Race', type:'select', options:[{ label:'Black', value:'black' },{ label:'White', value:'white' },{ label:'Asian', value:'asian' },{ label:'Hispanic', value:'hispanic' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const iop=parseFloat(v.iop)||15; const f=v.familyHx||'no'; const my=v.myopia||'no'; const r=v.race||'white'; const score=(a>60?3:a>40?1:0)+(iop>21?3:iop>18?2:0)+(f==='yes'?3:0)+(my==='yes'?1:0)+(r==='black'?2:0); const risk=score>=8?'High - comprehensive eye exam urgently':score>=4?'Moderate - annual eye exam with OCT':'Low - routine screening'; return { result:score, label:'Glaucoma Risk Score', unit:'', steps:[{ label:'Age', value:(a>60?3:a>40?1:0).toString() },{ label:'IOP', value:(iop>21?3:iop>18?2:0).toString() },{ label:'Family Hx', value:(f==='yes'?3:0).toString() },{ label:'Myopia', value:(my==='yes'?1:0).toString() },{ label:'Race (Black:2)', value:r==='black'?'2':'0' },{ label:'Total', value:score.toString() }] } },
  description: 'Primary open-angle glaucoma risk screening using major risk factors.',
  formula: 'Score = Age+IOP+FamilyHx+Myopia+Race. High IOP>21 is strongest single risk factor.',
  interpretation: '<4: Low, q2yr screening. 4-7: Moderate, annual exam. ≥8: High, urgent comprehensive eye exam.'
}

export default calcDef
