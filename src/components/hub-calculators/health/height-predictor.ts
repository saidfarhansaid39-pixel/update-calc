import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ motherHeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), fatherHeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']), childAge: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), childHeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'motherHeight', label:"Mother's Height (cm)", type:'number', min:100, step:'0.5' }, { name:'fatherHeight', label:"Father's Height (cm)", type:'number', min:100, step:'0.5' }, { name:'gender', label:'Child Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }, { name:'childAge', label:"Child's Age (years)", type:'number', min:1, max:18, step:'0.5' }, { name:'childHeight', label:"Child's Height (cm)", type:'number', min:30, step:'0.5' }],
  compute: (v) => { const mh=parseFloat(v.motherHeight)||165; const fh=parseFloat(v.fatherHeight)||178; const g=v.gender||'male'; const ca=parseFloat(v.childAge)||8; const ch=parseFloat(v.childHeight)||120; const midParent=(mh+fh)/2; const predicted=g==='male'?(fh+mh+13)/2:(fh+mh-13)/2; const pct50=g==='male'?midParent+6:midParent-6; return { result:predicted, label:'Predicted Adult Height', unit:'cm', steps:[{ label:'Mid-Parental Height', value:midParent.toFixed(1) },{ label:'Sex-Adjusted Target', value:predicted.toFixed(1)+' cm' }] } },
  description: 'Child adult height prediction using mid-parental height method (Tanner).',
  formula: 'Male: (father+mom+13)/2 cm. Female: (father+mom-13)/2 cm. Accuracy ±8 cm. Khamis-Roche for prepubertal.',
  interpretation: 'Growth potential: bone age X-ray more accurate. Predictor best for ages 2-9 before puberty. Stunted growth: investigate GH, nutrition.'
}

export default calcDef
