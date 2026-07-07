import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bleeding: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), prolapse: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), pain: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), itching: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), hygiene: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'bleeding', label:'Bleeding (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'prolapse', label:'Prolapse (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'pain', label:'Pain (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'itching', label:'Itching (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'hygiene', label:'Hygiene Difficulty (0-10)', type:'number', min:0, max:10, step:'1' }],
  compute: (v) => { const b=parseInt(v.bleeding)||0; const p=parseInt(v.prolapse)||0; const pa=parseInt(v.pain)||0; const i=parseInt(v.itching)||0; const h=parseInt(v.hygiene)||0; const total=b+p+pa+i+h; const grade=total<=10?'Grade I-VI (mild)':total<=20?'Grade II (moderate) - conservative':total<=30?'Grade III (severe) - banding/surgery':total<=40?'Grade IV (advanced) - surgical':'Grade IV (complicated) - surgical'; return { result:total, label:'Hemorrhoid Severity', unit:'', steps:[{ label:'Bleeding', value:b.toString() },{ label:'Prolapse', value:p.toString() },{ label:'Pain', value:pa.toString() },{ label:'Itching', value:i.toString() },{ label:'Hygiene', value:h.toString() },{ label:'Total (0-50)', value:total.toString() },{ label:'Grade', value:grade }] } },
  description: 'Hemorrhoid severity index for clinical grading and treatment guidance.',
  formula: 'Score = Bleeding+Prolapse+Pain+Itching+Hygiene (each 0-10). Grade I-VI correlates with Goligher classification.',
  interpretation: 'Grade I-II: fiber, fluids, topical; Grade III: rubber band ligation; Grade IV: hemorrhoidectomy.'
}

export default calcDef
