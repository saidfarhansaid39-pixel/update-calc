import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    swimMin: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    bikeMin: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    runMin: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    t1Min: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    t2Min: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'swimMin', label: 'Swim Time', type: 'number', unit: 'min', min: 0, step: '1' },
    { name: 't1Min', label: 'T1 (optional)', type: 'number', unit: 'min', min: 0, step: '0.5' },
    { name: 'bikeMin', label: 'Bike Time', type: 'number', unit: 'min', min: 0, step: '1' },
    { name: 't2Min', label: 'T2 (optional)', type: 'number', unit: 'min', min: 0, step: '0.5' },
    { name: 'runMin', label: 'Run Time', type: 'number', unit: 'min', min: 0, step: '1' },
  ],
  compute: (v) => {
    const t1 = v.t1Min || 0
    const t2 = v.t2Min || 0
    const total = v.swimMin + t1 + v.bikeMin + t2 + v.runMin
    const swimPct = total > 0 ? v.swimMin / total * 100 : 0
    const bikePct = total > 0 ? v.bikeMin / total * 100 : 0
    const runPct = total > 0 ? v.runMin / total * 100 : 0
    return {
      result: total, label: 'Total Race Time', unit: 'min',
      steps: [
        { label: 'Swim', value: `${v.swimMin} min (${swimPct.toFixed(1)}%)` },
        ...(t1 > 0 ? [{ label: 'T1', value: `${t1} min` }] : []),
        { label: 'Bike', value: `${v.bikeMin} min (${bikePct.toFixed(1)}%)` },
        ...(t2 > 0 ? [{ label: 'T2', value: `${t2} min` }] : []),
        { label: 'Run', value: `${v.runMin} min (${runPct.toFixed(1)}%)` },
        { label: 'Total', value: `${Math.floor(total / 60)}h ${(total % 60).toFixed(0)}m (${total.toFixed(0)} min)` },
      ]
}
  },
  description: 'Calculate total triathlon race time from individual swim, bike, run, and transition splits. Transition times (T1 and T2) are often overlooked but can significantly impact overall race performance.'
}

export default calcDef
