import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ period: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'period', label: 'Period', type: 'number', unit: 's', min: 1e-6, step: '0.001' }],
  defaults: { period: '1' },
  presets: [
    { label: 'Standard example 1', values: { period: '1' } },
    { label: 'Standard example 2', values: { period: '10' } },
    { label: 'Standard example 3', values: { period: '100' } },
  ],
  compute: (v) => ({ result: 1 / v.period, label: 'Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f = 1/T' }, { label: 'Substitute', value: `1 / ${v.period}` }, { label: 'Result', value: `${(1 / v.period).toFixed(4)} Hz` }],
      extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ] }),
  description: 'Frequency is the reciprocal of the period. It is the number of wave cycles per second.',
  formula: 'f = 1 / T',
  interpretation: '1 Hz = 1 cycle per second. Visible light has frequencies of 4×10¹^4 to 8×10¹^4 Hz.'
}

export default calcDef
