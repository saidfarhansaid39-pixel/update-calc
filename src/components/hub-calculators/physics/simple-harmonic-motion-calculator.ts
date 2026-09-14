import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), springConstant: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'springConstant', label: 'Spring Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }],
  defaults: { mass: '1', springConstant: '1' },
  presets: [
    { label: 'Standard example 1', values: { mass: '1', springConstant: '1' } },
    { label: 'Standard example 2', values: { mass: '10', springConstant: '10' } },
    { label: 'Standard example 3', values: { mass: '100', springConstant: '100' } },
  ],
  compute: (v) => { const omega = Math.sqrt(v.springConstant / v.mass); const period = 2 * Math.PI / omega; const freq = 1 / period; return { result: period, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(m/k)' }, { label: 'Angular frequency', value: `${omega.toFixed(3)} rad/s` }, { label: 'Period', value: `${period.toFixed(4)} s` }, { label: 'Frequency', value: `${freq.toFixed(3)} Hz` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Simple harmonic motion describes oscillatory motion where restoring force is proportional to displacement.',
  formula: 'T = 2pisqrt(m/k)',
  interpretation: 'The period depends only on mass and spring constant, not on amplitude. This is characteristic of simple harmonic motion.'
}

export default calcDef
