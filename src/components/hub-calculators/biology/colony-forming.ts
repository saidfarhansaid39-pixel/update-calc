import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    colonies: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    dilutionFactor: z.string().refine(v => parseFloat(v) > 0, '>0'),
    volumePlated: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'colonies', label: 'Colonies Counted', type: 'number', min: 0, step: '1' },
    { name: 'dilutionFactor', label: 'Dilution Factor', type: 'number', min: 1, step: '1' },
    { name: 'volumePlated', label: 'Volume Plated (mL)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => {
    const cfuPerMl = v.volumePlated > 0 ? (v.colonies * v.dilutionFactor) / v.volumePlated : 0
    return {
      result: cfuPerMl, label: 'CFU/mL', unit: 'CFU/mL',
      steps: [
        { label: 'Colonies counted', value: `${v.colonies}` },
        { label: 'Dilution factor', value: `${v.dilutionFactor}` },
        { label: 'Volume plated', value: `${v.volumePlated} mL` },
        { label: 'CFU/mL = colonies × dilution / volume', value: `${cfuPerMl.toExponential(4)}` },
        { label: 'Quantification range', value: cfuPerMl < 30 ? 'Below countable range (<30)' : cfuPerMl > 300 ? 'Above countable range (>300)' : 'Within countable range (30-300)' },
      ]
}
  },
  description: 'Colony-forming units (CFU) per mL quantifies viable bacteria in a sample. Each colony arises from a single viable bacterial cell.',
  formula: 'CFU/mL = (number of colonies × dilution factor) / volume plated (mL)',
  interpretation: 'Statistically reliable counts: 30-300 colonies per plate. Below 30: sampling error too large. Above 300: colonies overlap and counting is inaccurate. Express results in scientific notation.'
}

export default calcDef
