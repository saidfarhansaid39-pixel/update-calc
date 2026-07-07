import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:1, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:20, step:'0.1' }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const mosteller=Math.sqrt(w*h/3600); const dubois=0.007184*Math.pow(w,0.425)*Math.pow(h,0.725); const haycock=0.024265*Math.pow(w,0.5378)*Math.pow(h,0.3964); return { result:mosteller, label:'BSA (Mosteller)', unit:'m²', steps:[{ label:'Mosteller: √(W×H/3600)', value:mosteller.toFixed(3) },{ label:'Du Bois', value:dubois.toFixed(3) },{ label:'Haycock', value:haycock.toFixed(3) }] } },
  description: 'Body surface area via Mosteller, Du Bois, and Haycock formulas.',
  formula: 'Mosteller: √(W×H/3600). Du Bois: 0.007184×W^0.425×H^0.725.',
  interpretation: 'Average adult BSA 1.6-1.9 m². Used for chemo dosing, cardiac index, burn assessment.'
}

export default calcDef
