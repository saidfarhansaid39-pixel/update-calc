import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lvidd: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), lvids: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'lvidd', label:'LV Internal Diameter Diastole (cm)', type:'number', min:2, max:8, step:'0.1' }, { name:'lvids', label:'LV Internal Diameter Systole (cm)', type:'number', min:1, max:7, step:'0.1' }],
  compute: (v) => { const dd=parseFloat(v.lvidd)||4.5; const ds=parseFloat(v.lvids)||3; const fs=(dd-ds)/dd*100; const status=fs>=28?'Normal':fs>=20?'Mildly Reduced':'Significantly Reduced'; return { result:fs, label:'Fractional Shortening', unit:'%', steps:[{ label:'FS = (LVEDD-LVESD)/LVEDD×100', value:fs.toFixed(1) },{ label:'Normal ≥28%', value:status }] } },
  description: 'LV fractional shortening for systolic function assessment (M-mode echo).',
  formula: 'FS = (LVEDD - LVESD)/LVEDD × 100%. Normal ≥28%. Simplified alternative to EF.',
  interpretation: 'FS correlates with EF (roughly 2× FS ≈ EF). FS <28% suggests systolic dysfunction.'
}

export default calcDef
