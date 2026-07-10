import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'weight', label:'Weight (kg)', type:'number', min:1, step:'0.1' }],
  compute: (v) => { const h=parseFloat(v.height)||170; const w=parseFloat(v.weight)||70; const pi=Math.pow(h/100,3)/w; return { result:pi, label:'Ponderal Index', unit:'kg/m³', steps:[{ label:'Height (m)', value:(h/100).toFixed(2) },{ label:'Weight', value:w.toFixed(1)+' kg' },{ label:'PI', value:pi.toFixed(2)+' kg/m³' }] } },
  description: 'Ponderal Index is a body adiposity measure using cubic height-weight relationship, better for tall individuals.',
  formula: 'PI = Height(m)³ / Weight(kg). PI 11-14 is normal, <11 underweight, >14 overweight.',
  interpretation: 'Normal PI: 11-14 kg/m³ for adults. Used in pediatrics and for tall individuals where BMI may overestimate fatness.'
}
export default calcDef