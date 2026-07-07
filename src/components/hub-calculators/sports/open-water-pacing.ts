import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0), timeMin: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'distance', label: 'Open Water Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'timeMin', label: 'Goal Time', type: 'number', unit: 'min', min: 1, step: '1' },
  ],
  compute: (v) => {
    const pace100 = v.timeMin * 60 / (v.distance * 1000 / 100); const pMin = Math.floor(pace100/60); const pSec = Math.round(pace100%60)
    return { result: pace100, label: 'Pace per 100m', unit: 'min/100m', steps: [
      { label: 'Distance', value: v.distance+' km' }, { label: 'Goal time', value: v.timeMin+' min' },
      { label: 'Pace per 100m', value: pMin+':'+pSec.toString().padStart(2,'0')+' min/100m' },
      { label: 'Sighting note', value: 'Add 3-5 sec/100m for sighting and navigation in open water' },
    ]}
  }, description: 'Plan open water swim pacing accounting for sighting and navigation. OWS is typically 3-10% slower than pool swimming.', formula: 'Pace/100m = total time / (distance × 10)', interpretation: 'Open water pace is slower than pool due to sighting, currents, and wave conditions.'
}

export default calcDef
