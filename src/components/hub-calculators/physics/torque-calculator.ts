import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'distance', label: 'Lever Arm', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { force: '1', distance: '1' },
  presets: [
    { label: 'Standard example 1', values: { force: '1', distance: '1' } },
    { label: 'Standard example 2', values: { force: '10', distance: '10' } },
    { label: 'Standard example 3', values: { force: '100', distance: '100' } },
  ],
  compute: (v) => ({ result: v.force * v.distance, label: 'Torque', unit: 'N·m', steps: [{ label: 'Formula', value: 'τ = rF (θ = 90°)' }, { label: 'Substitute', value: `${v.distance} × ${v.force}` }, { label: 'Result', value: `${(v.force * v.distance).toFixed(2)} N·m` }],
      extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ] }),
  description: 'Torque is the rotational equivalent of force. It equals force times lever arm length at perpendicular application.',
  formula: 'τ = r × F',
  interpretation: 'Torque produces angular acceleration. A longer lever arm increases torque for the same applied force.'
}

export default calcDef
