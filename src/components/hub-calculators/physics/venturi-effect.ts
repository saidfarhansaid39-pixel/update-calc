import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity1: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'area1', label: 'Upstream Area A₁', type: 'number', unit: 'm²', min: 0.0001, step: '0.0001' }, { name: 'area2', label: 'Throat Area A₂', type: 'number', unit: 'm²', min: 0.0001, step: '0.0001' }, { name: 'velocity1', label: 'Upstream Velocity v₁', type: 'number', unit: 'm/s', min: 0, step: '0.1' }],
  defaults: { area1: '1', area2: '1', velocity1: '1' },
  presets: [
    { label: 'Standard example 1', values: { area1: '1', area2: '1', velocity1: '1' } },
    { label: 'Standard example 2', values: { area1: '10', area2: '10', velocity1: '10' } },
    { label: 'Standard example 3', values: { area1: '100', area2: '100', velocity1: '100' } },
  ],
  compute: (v) => { const v2 = v.area1 * v.velocity1 / v.area2; return { result: v2, label: 'Throat Velocity v₂', unit: 'm/s', steps: [{ label: 'Formula', value: 'A₁v₁ = A₂v₂ (Continuity)' }, { label: 'Substitute', value: `${v.area1} × ${v.velocity1} / ${v.area2}` }, { label: 'Result', value: `${v2.toFixed(3)} m/s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The Venturi effect: fluid accelerates through a constricted section of pipe. The continuity equation A₁v₁ = A₂v₂ ensures constant mass flow rate.',
  formula: 'A₁v₁ = A₂v₂',
  interpretation: 'As velocity increases in the throat, pressure decreases (Bernoulli). This pressure difference is used to measure flow rate in Venturi meters. It also explains the operation of carburetors and aspirators.'
}

export default calcDef
