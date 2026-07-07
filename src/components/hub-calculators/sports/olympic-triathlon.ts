import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalMin: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [ { name: 'totalMin', label: 'Olympic Goal Time', type: 'number', unit: 'min', min: 100, max: 240, step: '5' } ],
  compute: (v) => {
    const rPace = v.totalMin * 60 / 10000 * 1000
    const rMin = Math.floor(rPace/60); const rSec = Math.round(rPace%60)
    return { result: rPace, label: 'Run Pace (10km)', unit: 'min/km', steps: [
      { label: 'Total goal time', value: Math.floor(v.totalMin/60)+'h '+(v.totalMin%60).toFixed(0)+'m' },
      { label: 'Bike speed (40km)', value: (40/(v.totalMin/60*0.5)).toFixed(1)+' km/h' },
      { label: 'Run pace (10km)', value: rMin+':'+rSec.toString().padStart(2,'0')+' /km' },
    ]}
  }, description: 'Plan Olympic distance triathlon pacing (1.5km swim, 40km bike, 10km run).', formula: 'Time: ~15% swim, ~50% bike, ~35% run', interpretation: 'Olympic distance is high intensity. Strong bike pacing sets up a fast run split.'
}

export default calcDef
