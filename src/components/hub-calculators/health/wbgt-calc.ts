import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ temp: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50,'≥50°F'), humidity: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), solar: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), wind: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'temp', label:'Air Temperature (°F)', type:'number', min:50, max:130, step:'1' }, { name:'humidity', label:'Relative Humidity (%)', type:'number', min:0, max:100, step:'1' }, { name:'solar', label:'Solar Radiation (W/m²)', type:'number', min:0, max:1200, step:'10' }, { name:'wind', label:'Wind Speed (mph)', type:'number', min:0, step:'1' }],
  compute: (v) => { const t=parseFloat(v.temp)||85; const rh=parseFloat(v.humidity)||50; const sr=parseFloat(v.solar)||800; const ws=parseFloat(v.wind)||5; const wbgt=0.7*t+0.2*t*Math.min(1,rh/70)+0.1*sr/100; const cat=wbgt<80?'Low Risk':wbgt<85?'Moderate Risk':wbgt<90?'High Risk':'Extreme Risk'; return { result:wbgt, label:'Wet Bulb Globe Temperature', unit:'°F', steps:[{ label:'Air Temp', value:t.toFixed(0)+'°F' },{ label:'Humidity', value:rh.toFixed(0)+'%' },{ label:'Solar', value:sr.toFixed(0)+' W/m²' },{ label:'Wind', value:ws.toFixed(1)+' mph' },{ label:'WBGT', value:wbgt.toFixed(1)+'°F' },{ label:'Risk Level', value:cat }] } },
  description: 'Wet Bulb Globe Temperature estimates heat stress risk combining temperature, humidity, solar radiation, and wind.',
  formula: 'WBGT ≈ 0.7×Tw + 0.2×Tg + 0.1×T. Simplified: 0.7×T + 0.2×T×(RH/70) + 0.1×Solar/1000.',
  interpretation: 'WBGT <80°F low risk, 80-85 moderate (take breaks), 85-90 high (limit activity), >90 extreme (cancel outdoor activity).'
}
export default calcDef