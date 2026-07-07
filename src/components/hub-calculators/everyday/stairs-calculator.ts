import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalRise: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), risePerStep: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), runPerStep: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), treadThickness: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'totalRise', label: 'Total Rise (in)', type: 'number', min: 6, step: '3' },
    { name: 'risePerStep', label: 'Rise per Step (in)', type: 'number', min: 4, max: 8, step: '0.25' },
    { name: 'runPerStep', label: 'Run per Step (in)', type: 'number', min: 8, max: 14, step: '0.25' },
    { name: 'treadThickness', label: 'Tread Thickness (in)', type: 'number', min: 0, step: '0.25' },
  ],
  compute: (v) => {
    const steps = Math.ceil(v.totalRise / v.risePerStep)
    const actualRise = v.totalRise / steps
    const totalRun = steps * v.runPerStep
    const stringerLength = Math.sqrt(v.totalRise * v.totalRise + totalRun * totalRun)
    return { result: steps, label: 'Number of Steps', unit: '', steps: [{ label: 'Steps Needed', value: `${steps} risers` }, { label: 'Actual Rise', value: `${actualRise.toFixed(2)} in` }, { label: 'Total Run', value: `${totalRun.toFixed(1)} in (${(totalRun / 12).toFixed(1)} ft)` }, { label: 'Stringer Length', value: `${(stringerLength / 12).toFixed(1)} ft` }] }
  },
  description: 'Calculate stair dimensions including number of steps, rise, run, and stringer length for building code compliant stairs.',
  formula: 'Steps = Ceil(TotalRise / RisePerStep) | Stringer = √(Rise² + Run²) | Building code: rise ≤7.75 in, run ≥10 in',
  interpretation: 'Standard stair: 7 in rise, 11 in run. Total rise = floor-to-floor height. Ideal ratio: rise + run = 17-18 in (2×rise + run = 24-25 in for optimal comfort). Handrail required for 4+ risers.'
}

export default calcDef
