import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ m1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), m2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'm1', label: 'Mass 1', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'm2', label: 'Mass 2', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }],
  defaults: { m1: '1', m2: '1' },
  presets: [
    { label: 'Standard example 1', values: { m1: '1', m2: '1' } },
    { label: 'Standard example 2', values: { m1: '10', m2: '10' } },
    { label: 'Standard example 3', values: { m1: '100', m2: '100' } },
  ],
  compute: (v) => { const a = (Math.abs(v.m1 - v.m2) * 9.81) / (v.m1 + v.m2); const T = (2 * v.m1 * v.m2 * 9.81) / (v.m1 + v.m2); return { result: a, label: 'Acceleration', unit: 'm/s^2', steps: [{ label: 'Formula', value: 'a = |m1-m2|g/(m1+m2)' }, { label: 'Net force', value: `${Math.abs(v.m1 - v.m2) * 9.81} N` }, { label: 'Acceleration', value: `${a.toFixed(3)} m/s^2` }, { label: 'Tension', value: `${T.toFixed(3)} N` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Atwood\'s machine demonstrates Newton\'s laws using two masses connected by a string over a pulley. The acceleration depends on the mass difference.',
  formula: 'a = |m1 - m2|·g / (m1 + m2)',
  interpretation: 'If masses are equal, acceleration is zero. As mass difference increases, acceleration approaches g. Tension in the string is constant throughout.'
}

export default calcDef
