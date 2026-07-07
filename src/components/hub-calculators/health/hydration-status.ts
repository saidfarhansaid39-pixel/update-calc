import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), serumSodium: z.string().min(1,'Required').refine(v=>parseFloat(v)>=100,'≥100'), currentStatus: z.string().min(1,'Required'), urineColor: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.1' }, { name:'serumSodium', label:'Serum Sodium (mEq/L)', type:'number', min:100, max:180, step:'1' }, { name:'currentStatus', label:'Clinical Status', type:'select', options:[{value:'euvolemic',label:'Euvolemic'},{value:'dehydrated',label:'Dehydrated'},{value:'overhydrated',label:'Overhydrated'}] }, { name:'urineColor', label:'Urine Color', type:'select', options:[{value:'pale',label:'Pale Yellow (1-3)'},{value:'yellow',label:'Yellow (4-6)'},{value:'dark',label:'Dark (7-8)'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const na=parseFloat(v.serumSodium)||140; const def=0.6*w*(1-140/na); const tbw=0.6*w; const hyd=na<135?'Hyponatremia':na>145?'Hypernatremia':'Normal sodium'; return { result:def>0?def:0, label:'Water Deficit', unit:'L', steps:[{ label:'TBW', value:tbw.toFixed(1)+' L' },{ label:'Na', value:na.toString()+' mEq/L' },{ label:'Status', value:hyd },{ label:'Water Deficit', value:def>0?def.toFixed(2)+' L':'None' }] } },
  description: 'Hydration status assessment using serum sodium and body weight for clinical fluid management.',
  formula: 'Water deficit = 0.6 × W × (1 - 140/Na). TBW = 0.6 × W. Hypernatremia deficit: (Na-140)/140 × 100% TBW.',
  interpretation: 'Deficit >1 L: replace over 24-48h with D5W or 0.45% NaCl. Correct Na at ≤10-12 mEq/L/day to prevent osmotic demyelination.'
}

export default calcDef
