import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ intensity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'intensity', label: 'Intensity', type: 'number', unit: 'W/m^2', min: 1e-12, step: '1e-12' }],
  defaults: { intensity: '1' },
  presets: [
    { label: 'Standard example 1', values: { intensity: '1' } },
    { label: 'Standard example 2', values: { intensity: '10' } },
    { label: 'Standard example 3', values: { intensity: '100' } },
  ],
  compute: (v) => { const I0 = 1e-12; const dB = 10 * Math.log10(v.intensity / I0); return { result: dB, label: 'Sound Level', unit: 'dB', steps: [{ label: 'Formula', value: 'L = 10·log10(I/I0)' }, { label: 'I0', value: '10⁻¹^2 W/m^2 (reference)' }, { label: 'Result', value: `${dB.toFixed(1)} dB` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Sound intensity level in decibels is a logarithmic measure relative to the threshold of hearing (10⁻¹^2 W/m^2).',
  formula: 'L = 10·log10(I/I0)',
  interpretation: 'Normal conversation ~60 dB, threshold of pain ~120 dB. Every 10 dB increase represents a 10× increase in intensity.'
}

export default calcDef
