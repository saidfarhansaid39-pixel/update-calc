import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ power: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'power', label: 'Sound Power', type: 'number', unit: 'W', min: 1e-6, step: '1e-6' }, { name: 'distance', label: 'Distance from Source', type: 'number', unit: 'm', min: 0.01, step: '0.01' }],
  defaults: { power: '1', distance: '1' },
  presets: [
    { label: 'Standard example 1', values: { power: '1', distance: '1' } },
    { label: 'Standard example 2', values: { power: '10', distance: '10' } },
    { label: 'Standard example 3', values: { power: '100', distance: '100' } },
  ],
  compute: (v) => { const I = v.power / (4 * Math.PI * v.distance * v.distance); const dB = 10 * Math.log10(I / 1e-12); return { result: I, label: 'Intensity', unit: 'W/m^2', steps: [{ label: 'Formula', value: 'I = P/(4πr^2)' }, { label: 'Intensity', value: `${I.toExponential(4)} W/m^2` }, { label: 'Sound Level', value: `${dB.toFixed(1)} dB` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Sound intensity decreases with the square of distance from a point source. The inverse square law governs spherical wave propagation.',
  formula: 'I = P/(4πr^2)',
  interpretation: 'Doubling distance reduces intensity by a factor of 4 (-6 dB). Normal conversation is ~60 dB at 1 m. Threshold of hearing is 10^-12 W/m^2.'
}

export default calcDef
