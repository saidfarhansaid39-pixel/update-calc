import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalMin: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [ { name: 'totalMin', label: '70.3 Goal Time', type: 'number', unit: 'min', min: 240, max: 540, step: '10' } ],
  compute: (v) => {
    const swimPace = v.totalMin * 60 / (1900 / 100); const rPace = v.totalMin * 60 / 21100 * 1000
    const sMin = Math.floor(swimPace/60); const sSec = Math.round(swimPace%60)
    const rMin = Math.floor(rPace/60); const rSec = Math.round(rPace%60)
    return { result: swimPace, label: 'Swim Pace (1.9km)', unit: 'min/100m', steps: [
      { label: 'Total goal time', value: Math.floor(v.totalMin/60)+'h '+(v.totalMin%60).toFixed(0)+'m' },
      { label: 'Swim pace (1.9km)', value: sMin+':'+sSec.toString().padStart(2,'0')+' /100m' },
      { label: 'Bike speed (90km)', value: (90/(v.totalMin/60*0.47)).toFixed(1)+' km/h' },
      { label: 'Run pace (21.1km)', value: rMin+':'+rSec.toString().padStart(2,'0')+' /km' },
    ]}
  }, description: 'Plan Half Ironman (70.3) pacing for 1.9km swim, 90km bike, 21.1km run.', formula: 'Time: ~12% swim, ~48% bike, ~40% run', interpretation: '70.3 requires sustained threshold effort. Pacing discipline determines success.'
}

export default calcDef
