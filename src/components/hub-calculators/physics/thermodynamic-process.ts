import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), V1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), V2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'n', label: 'Number of Moles n', type: 'number', unit: 'mol', min: 0.01, step: '0.01' }, { name: 'T', label: 'Temperature T', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'V1', label: 'Initial Volume V₁', type: 'number', unit: 'm³', min: 0.001, step: '0.001' }, { name: 'V2', label: 'Final Volume V₂', type: 'number', unit: 'm³', min: 0.001, step: '0.001' }],
  defaults: { n: '1', T: '1', V1: '1', V2: '1' },
  presets: [
    { label: 'Standard example 1', values: { n: '1', T: '1', V1: '1', V2: '1' } },
    { label: 'Standard example 2', values: { n: '10', T: '10', V1: '10', V2: '10' } },
    { label: 'Standard example 3', values: { n: '100', T: '100', V1: '100', V2: '100' } },
  ],
  compute: (v) => { const R = 8.314; const W = v.n * R * v.T * Math.log(v.V2 / v.V1); return { result: W, label: 'Isothermal Work W', unit: 'J', steps: [{ label: 'Formula', value: 'W = nRT·ln(V₂/V₁)' }, { label: 'Substitute', value: `${v.n} × 8.314 × ${v.T} × ln(${v.V2}/${v.V1})` }, { label: 'Result', value: `${W.toFixed(2)} J` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Work done by an ideal gas during an isothermal (constant temperature) thermodynamic process. For adiabatic, isobaric, or isochoric processes, different formulas apply.',
  formula: 'W = nRT·ln(V₂/V₁) [isothermal]',
  interpretation: 'Positive W means work done by the gas (expansion). For isothermal compression, work is done on the gas (negative). The gas must exchange heat with a reservoir to stay at constant T.'
}

export default calcDef
