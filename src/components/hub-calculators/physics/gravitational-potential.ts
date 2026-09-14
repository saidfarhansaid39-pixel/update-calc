import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Central Mass M', type: 'number', unit: 'kg', min: 1e20, step: '1e20' }, { name: 'distance', label: 'Distance r', type: 'number', unit: 'm', min: 1e6, step: '1e6' }],
  defaults: { mass: '1', distance: '1' },
  presets: [
    { label: 'Standard example 1', values: { mass: '1', distance: '1' } },
    { label: 'Standard example 2', values: { mass: '10', distance: '10' } },
    { label: 'Standard example 3', values: { mass: '100', distance: '100' } },
  ],
  compute: (v) => { const G = 6.674e-11; const V = -G * v.mass / v.distance; return { result: V, label: 'Gravitational Potential', unit: 'J/kg', steps: [{ label: 'Formula', value: 'V = -GM/r' }, { label: 'G', value: '6.674×10⁻¹¹' }, { label: 'Result', value: `${V.toExponential(4)} J/kg` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Gravitational potential is the gravitational potential energy per unit mass at a point in a gravitational field.',
  formula: 'V = -G·M / r',
  interpretation: 'Potential is negative and approaches zero at infinity. The difference in potential determines the work needed to move a mass between two points. Earth\'s surface potential is about -62.5 MJ/kg.'
}

export default calcDef
