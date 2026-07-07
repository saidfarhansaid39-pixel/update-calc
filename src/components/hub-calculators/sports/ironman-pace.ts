import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalMin: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [ { name: 'totalMin', label: 'Ironman Goal Time', type: 'number', unit: 'min', min: 480, max: 960, step: '10' } ],
  compute: (v) => {
    const swimPace = v.totalMin * 60 / (3800 / 100); const bikePace = v.totalMin * 60 / 180000 * 1000; const runPace = v.totalMin * 60 / 42195 * 1000
    const sMin = Math.floor(swimPace/60); const sSec = Math.round(swimPace%60)
    const rMin = Math.floor(runPace/60); const rSec = Math.round(runPace%60)
    return { result: swimPace, label: 'Swim Pace (per 100m)', unit: 'min/100m', steps: [
      { label: 'Total goal time', value: Math.floor(v.totalMin/60)+'h '+(v.totalMin%60).toFixed(0)+'m' },
      { label: 'Swim pace (3.8km)', value: sMin+':'+sSec.toString().padStart(2,'0')+' /100m' },
      { label: 'Bike speed (180km)', value: (180/(v.totalMin/60*0.45)).toFixed(1)+' km/h' },
      { label: 'Run pace (42.2km)', value: rMin+':'+rSec.toString().padStart(2,'0')+' /km' },
    ]}
  }, description: 'Plan Ironman pacing for 3.8km swim, 180km bike, and 42.2km run. Total distance is 226km.', formula: 'Time allocation: ~10% swim, ~50% bike, ~40% run (plus transitions)', interpretation: 'Ironman pacing is critical. Most athletes aim for even effort distribution rather than even pace.'
}

export default calcDef
