import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ thrust: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'thrust', label: 'Thrust F', type: 'number', unit: 'N', min: 1, step: '1' }, { name: 'mass', label: 'Vehicle Mass', type: 'number', unit: 'kg', min: 0.1, step: '0.1' }],
  defaults: { thrust: '1', mass: '1' },
  presets: [
    { label: 'Standard example 1', values: { thrust: '1', mass: '1' } },
    { label: 'Standard example 2', values: { thrust: '10', mass: '10' } },
    { label: 'Standard example 3', values: { thrust: '100', mass: '100' } },
  ],
  compute: (v) => { const g0 = 9.81; const TW = v.thrust / (v.mass * g0); return { result: TW, label: 'Thrust-to-Weight Ratio', unit: '', steps: [{ label: 'Formula', value: 'T/W = F/(m·g₀)' }, { label: 'Substitute', value: `${v.thrust} / (${v.mass} × 9.81)` }, { label: 'Result', value: `${TW.toFixed(3)}:1` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Thrust-to-weight ratio determines if a vehicle can lift off. T/W > 1 is required for vertical ascent.',
  formula: 'T/W = F/(m·g₀)',
  interpretation: 'Saturn V first stage had T/W ≈ 1.15. SpaceX Falcon 9 has T/W ≈ 1.3. Higher T/W means more acceleration. T/W < 1 means the vehicle cannot lift off the ground. Aircraft need lower T/W as wings provide lift.'
}

export default calcDef
