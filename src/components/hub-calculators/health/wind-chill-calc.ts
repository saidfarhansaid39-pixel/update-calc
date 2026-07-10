import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ temp: z.string().min(1,'Required').refine(v=>parseFloat(v)>=-50,'≥-50'), wind: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'temp', label:'Air Temperature (°F)', type:'number', min:-50, max:50, step:'1' }, { name:'wind', label:'Wind Speed (mph)', type:'number', min:0, step:'1' }],
  compute: (v) => { const t=parseFloat(v.temp)||32; const w=parseFloat(v.wind)||10; const wci=w<3?t:35.74+0.6215*t-35.75*Math.pow(w,0.16)+0.4275*t*Math.pow(w,0.16); const risk=wci<-50?'Dangerous (30 min frostbite)':wci<-35?'High Risk':wci<-20?'Moderate Risk':'Low Risk'; return { result:wci, label:'Wind Chill Index', unit:'°F', steps:[{ label:'Air Temp', value:t.toFixed(0)+'°F' },{ label:'Wind Speed', value:w.toFixed(0)+' mph' },{ label:'Wind Chill', value:wci.toFixed(1)+'°F' },{ label:'Risk', value:risk }] } },
  description: 'Wind chill index estimates the perceived temperature accounting for wind speed effects on heat loss.',
  formula: 'WCI = 35.74 + 0.6215×T - 35.75×V^0.16 + 0.4275×T×V^0.16. Valid for T ≤50°F and V ≥3 mph.',
  interpretation: 'WCI < -20°F: frostbite risk in 30 min. < -35°F: frostbite in 10 min. Dress in layers and cover exposed skin.'
}
export default calcDef