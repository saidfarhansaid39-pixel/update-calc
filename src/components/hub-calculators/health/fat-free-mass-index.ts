import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bodyFatPct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'bodyFatPct', label:'Body Fat %', type:'number', min:2, max:60, step:'0.1' }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const bf=parseFloat(v.bodyFatPct)||15; const ffm=w*(1-bf/100); const ffmi=ffm/((h/100)**2); return { result:ffmi, label:'Fat-Free Mass Index', unit:'kg/m²', steps:[{ label:'FFM = W×(1-BF%)', value:ffm.toFixed(1) },{ label:'FFMI = FFM/H²', value:ffmi.toFixed(2) }] } },
  description: 'Fat-Free Mass Index (FFMI) for body composition assessment, normalizing FFM to height.',
  formula: 'FFMI = fat-free mass(kg)/height(m)². Normal: 18-21 (male), 14-17 (female). >25: likely steroid use.',
  interpretation: 'Low FFMI suggests sarcopenia. High FFMI (>25 male, >21 female) indicates high muscularity.'
}

export default calcDef
