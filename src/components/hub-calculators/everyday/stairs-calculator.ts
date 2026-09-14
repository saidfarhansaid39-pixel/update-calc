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
  defaults: { totalRise: '105', risePerStep: '7', runPerStep: '11', treadThickness: '1' },
  presets: [
    { label: 'Standard 9ft Ceiling', values: { totalRise: '109', risePerStep: '7.25', runPerStep: '11', treadThickness: '1' } },
    { label: 'Standard 8ft Ceiling', values: { totalRise: '105', risePerStep: '7', runPerStep: '11', treadThickness: '1' } },
    { label: 'Basement Stairs', values: { totalRise: '96', risePerStep: '7.5', runPerStep: '10', treadThickness: '1' } },
    { label: 'Exterior Deck Steps', values: { totalRise: '42', risePerStep: '7', runPerStep: '11', treadThickness: '1.5' } },
  ],
  compute: (v) => {
    const steps = Math.ceil(v.totalRise / v.risePerStep)
    const actualRise = v.totalRise / steps
    const totalRun = steps * v.runPerStep
    const stringerLength = Math.sqrt(v.totalRise * v.totalRise + totalRun * totalRun)
    return { result: steps, label: 'Number of Steps', unit: '', steps: [{ label: 'Steps Needed', value: `${steps} risers` }, { label: 'Actual Rise', value: `${actualRise.toFixed(2)} in` }, { label: 'Total Run', value: `${totalRun.toFixed(1)} in (${(totalRun / 12).toFixed(1)} ft)` }, { label: 'Stringer Length', value: `${(stringerLength / 12).toFixed(1)} ft` }] ,
    extras: [
      { label: 'IRC Building Code (US)', value: 'Max rise: 7.75 in. Min run: 10 in. Min tread depth: 10 in. Headroom: 6 ft 8 in min. Handrail: 34-38 in above nosing. Required for 4+ risers' },
      { label: 'Comfort Formula', value: 'Rise + Run = 17-18 in (ideal: 17.5). Or 2×Rise + Run = 24-25 in (ideal: 25). A 7" rise + 11" run = 18 (excellent)' },
      { label: 'Total Rise Measurement', value: 'Floor-to-floor height = top of finished lower floor to top of finished upper floor. Include subfloor, underlayment, and flooring thickness' },
      { label: 'Stringer Cutting Notes', value: 'Stringers are 2×12 lumber minimum. Stringer length calculated via Pythagorean theorem: √(TotalRise² + TotalRun²). Use actual rise and run' },
      { label: 'Tread Thickness Factor', value: 'Tread thickness changes the effective rise — subtract tread thickness from rise for the actual step height climbers experience. Thicker treads = smoother climb' },
      { label: 'Stair Width Standards', value: 'Minimum: 36 in (residential), 44 in (commercial). Width measured between handrails. Wider stairs feel more spacious and are safer' },
      { label: 'Landing Requirements', value: 'Maximum 12 ft vertical rise before a landing. Landing must be at least as wide as the stair and 36 in long (min). Doors must swing away from landing' },
    ]}
  },
  description: 'Calculate stair dimensions per IRC building code: number of steps, actual rise per step, total run, and stringer length for safe, comfortable stairs.',
  formula: 'Steps = Ceil(TotalRise ÷ RisePerStep). ActualRise = TotalRise ÷ Steps. TotalRun = Steps × RunPerStep. Stringer = √(TotalRise² + TotalRun²). Comfort check: Rise + Run ≈ 17-18 in.',
  interpretation: 'Standard residential stairs: 7 in rise, 11 in run per step (rise + run = 18 in — ideal comfort ratio). For a 9 ft ceiling (109 in total rise), you need 15 risers at ~7.27 in each with a total run of 165 in (13.75 ft). The stringer length would be ~198 in (16.5 ft). IRC code requires maximum 7.75 in rise, minimum 10 in run, minimum 36 in width, and handrails for any stair with 4+ risers. Always verify local building codes before construction.'
}

export default calcDef
