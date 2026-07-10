import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ map: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), rap: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), cardiacOutput: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'map', label:'Mean Arterial Pressure (mmHg)', type:'number', min:30, max:200, step:'1' }, { name:'rap', label:'Right Atrial Pressure (mmHg)', type:'number', min:0, max:30, step:'1' }, { name:'cardiacOutput', label:'Cardiac Output (L/min)', type:'number', min:1, step:'0.1' }],
  compute: (v) => { const map=parseFloat(v.map)||85; const rap=parseFloat(v.rap)||5; const co=parseFloat(v.cardiacOutput)||5; const svr=(map-rap)/co*80; return { result:svr, label:'Systemic Vascular Resistance', unit:'dyn·s/cm⁵', steps:[{ label:'MAP', value:map.toFixed(0)+' mmHg' },{ label:'RAP', value:rap.toFixed(0)+' mmHg' },{ label:'SVR', value:svr.toFixed(0)+' dyn·s/cm⁵' }] } },
  description: 'Systemic vascular resistance measures left ventricular afterload in the systemic circulation.',
  formula: 'SVR = (MAP - RAP) / CO × 80',
  interpretation: 'Normal SVR: 800-1200 dyn·s/cm⁵. High SVR (>1200) indicates vasoconstriction/hypertension. Low SVR (<800) indicates vasodilation (sepsis, cirrhosis, vasodilatory shock).'
}
export default calcDef
