import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0), time: z.string().min(1).refine(v => parseFloat(v) > 0), weight: z.string().optional().refine(v => !v || parseFloat(v) > 0) }),
  fields: [
    { name: 'distance', label: 'Rowing Distance', type: 'number', unit: 'm', min: 500, step: '100' },
    { name: 'time', label: 'Time', type: 'number', unit: 's', min: 60, step: '1' },
    { name: 'weight', label: 'Body Weight (optional)', type: 'number', unit: 'kg', min: 20, step: '0.5' },
  ],
  compute: (v) => {
    const pace500 = v.time / (v.distance / 500); const watts = (500/pace500)**3 * 2.8
    const paceMin = Math.floor(pace500/60); const paceSec = Math.round(pace500%60)
    const wkg = v.weight ? watts / v.weight : 0
    return { result: watts, label: 'Estimated Power', unit: 'W', steps: [
      { label: 'Distance', value: v.distance+' m in '+(v.time/60).toFixed(1)+' min' },
      { label: 'Pace/500m', value: paceMin+':'+paceSec.toString().padStart(2,'0') },
      { label: 'Power', value: watts.toFixed(0)+' W' }, ...(v.weight ? [{ label: 'W/kg', value: wkg.toFixed(2)+' W/kg' }] : []),
    ]}
  }, description: 'Calculate rowing power from distance and time on ergometer. Based on Concept2 drag factor model.', formula: 'P = 2.8 / (pace/500)³', interpretation: 'Higher power and lower split = better rowing. Elite rowers exceed 400W for 2000m.'
}

export default calcDef
