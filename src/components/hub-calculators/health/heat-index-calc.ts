import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ temperature: z.string().min(1,'Required').refine(v=>parseFloat(v)>=70,'≥70'), humidity: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'temperature', label:'Temperature (°F)', type:'number', min:70, max:130, step:'1' }, { name:'humidity', label:'Relative Humidity (%)', type:'number', min:0, max:100, step:'1' }],
  compute: (v) => { const t=parseFloat(v.temperature)||80; const h=parseFloat(v.humidity)||50; let hi=t>79?-42.379+2.04901523*t+10.14333127*h-0.22475541*t*h-0.00683783*t*t-0.05481717*h*h+0.00122874*t*t*h+0.00085282*t*h*h-0.00000199*t*t*h*h:t; const hiC=(hi-32)*5/9; let cat=''; if(hi>=126) cat='Extreme Danger - heat stroke imminent'; else if(hi>=103) cat='Danger - heat cramps/heat exhaustion likely'; else if(hi>=91) cat='Extreme Caution - heat cramps possible'; else cat='Caution - fatigue possible'; return { result:hi, label:'Heat Index', unit:'°F', steps:[{ label:'Temperature', value:t.toString()+'°F' },{ label:'Humidity', value:h.toString()+'%' },{ label:'Heat Index', value:hi.toFixed(0)+'°F ('+hiC.toFixed(0)+'°C)' },{ label:'Category', value:cat }] } },
  description: 'Heat index (apparent temperature) incorporating humidity from the Rothfusz regression.',
  formula: 'HI = -42.379 + 2.049T + 10.143H - 0.225TH - 0.00684T² - 0.05482H² + 0.00123T²H + 0.000853TH² - 0.000002T²H².',
  interpretation: '91-103°F: Caution. 103-125°F: Danger. >125°F: Extreme danger, heat stroke risk.'
}

export default calcDef
