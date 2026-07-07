import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity1: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'area1', label: 'Upstream Area A₁', type: 'number', unit: 'm²', min: 0.0001, step: '0.0001' }, { name: 'area2', label: 'Throat Area A₂', type: 'number', unit: 'm²', min: 0.0001, step: '0.0001' }, { name: 'velocity1', label: 'Upstream Velocity v₁', type: 'number', unit: 'm/s', min: 0, step: '0.1' }],
  compute: (v) => { const v2 = v.area1 * v.velocity1 / v.area2; return { result: v2, label: 'Throat Velocity v₂', unit: 'm/s', steps: [{ label: 'Formula', value: 'A₁v₁ = A₂v₂ (Continuity)' }, { label: 'Substitute', value: `${v.area1} × ${v.velocity1} / ${v.area2}` }, { label: 'Result', value: `${v2.toFixed(3)} m/s` }] } },
  description: 'The Venturi effect: fluid accelerates through a constricted section of pipe. The continuity equation A₁v₁ = A₂v₂ ensures constant mass flow rate.',
  formula: 'A₁v₁ = A₂v₂',
  interpretation: 'As velocity increases in the throat, pressure decreases (Bernoulli). This pressure difference is used to measure flow rate in Venturi meters. It also explains the operation of carburetors and aspirators.'
}

export default calcDef
