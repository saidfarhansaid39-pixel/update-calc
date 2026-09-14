import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ load: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ropes: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10') }),
  fields: [{ name: 'load', label: 'Load Weight', type: 'number', unit: 'N', min: 1, step: '1' }, { name: 'ropes', label: 'Number of Ropes', type: 'number', unit: '', min: 1, max: 10, step: '1' }],
  defaults: { load: '1', ropes: '1' },
  presets: [
    { label: 'Standard example 1', values: { load: '1', ropes: '1' } },
    { label: 'Standard example 2', values: { load: '10', ropes: '10' } },
    { label: 'Standard example 3', values: { load: '100', ropes: '100' } },
  ],
  compute: (v) => ({ result: v.load / v.ropes, label: 'Required Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = Load/MA' }, { label: 'Ropes', value: `${v.ropes} (mechanical advantage = ${v.ropes})` }, { label: 'Result', value: `${(v.load / v.ropes).toFixed(1)} N` }],
      extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ] }),
  description: 'A pulley system provides mechanical advantage equal to the number of supporting rope segments.',
  formula: 'MA = n, F = Load / n',
  interpretation: 'Each supporting rope reduces the required force by a factor equal to the number of ropes. Friction reduces actual mechanical advantage.'
}

export default calcDef
