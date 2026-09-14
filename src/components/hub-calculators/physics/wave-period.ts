import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'frequency', label: 'Frequency', type: 'number', unit: 'Hz', min: 1e-6, step: '0.001' }],
  defaults: { frequency: '1' },
  presets: [
    { label: 'Standard example 1', values: { frequency: '1' } },
    { label: 'Standard example 2', values: { frequency: '10' } },
    { label: 'Standard example 3', values: { frequency: '100' } },
  ],
  compute: (v) => ({ result: 1 / v.frequency, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 1/f' }, { label: 'Substitute', value: `1 / ${v.frequency}` }, { label: 'Result', value: `${(1 / v.frequency).toFixed(6)} s` }],
      extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ] }),
  description: 'The period is the time required for one complete wave cycle. It is the reciprocal of frequency.',
  formula: 'T = 1 / f',
  interpretation: 'A wave with frequency 100 Hz has a period of 0.01 s. Period and frequency are inversely related.'
}

export default calcDef
