import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ daytime: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), nocturnal: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), activity: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), reliever: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), selfRating: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'daytime', label:'Daytime Sx (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'nocturnal', label:'Nighttime (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'activity', label:'Activity Limit (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'reliever', label:'Reliever Use (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'selfRating', label:'Self-Rating (0-5)', type:'number', min:0, max:5, step:'1' }],
  compute: (v) => { const d=parseInt(v.daytime)||0; const n=parseInt(v.nocturnal)||0; const a=parseInt(v.activity)||0; const r=parseInt(v.reliever)||0; const s=parseInt(v.selfRating)||0; const total=d+n+a+r+s; const actTotal=25-total; const level=actTotal>=25?'Well Controlled':actTotal>=20?'Partly Controlled':'Uncontrolled'; return { result:actTotal, label:'ACT Score', unit:'', steps:[{ label:'Daytime', value:d.toString() },{ label:'Nocturnal', value:n.toString() },{ label:'Activity', value:a.toString() },{ label:'Reliever', value:r.toString() },{ label:'Self-Rating', value:s.toString() },{ label:'Score', value:actTotal.toString() }] } },
  description: 'Asthma Control Test (ACT) - 5-question assessment of asthma control over 4 weeks.',
  formula: 'ACT = 25 - Σ(question scores). Each question 0-5. Higher = better control.',
  interpretation: '25: Well controlled; 20-24: Partly controlled; <20: Uncontrolled; 3-point change is clinically significant.'
}

export default calcDef
