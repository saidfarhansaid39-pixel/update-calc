import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ spacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), order: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10') }),
  fields: [{ name: 'spacing', label: 'Crystal Lattice Spacing', type: 'number', unit: 'nm', min: 0.01, step: '0.01' }, { name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'nm', min: 0.001, step: '0.001' }, { name: 'order', label: 'Order n', type: 'number', unit: '', min: 1, max: 10, step: '1' }],
  defaults: { spacing: '1', wavelength: '1', order: '1' },
  presets: [
    { label: 'Standard example 1', values: { spacing: '1', wavelength: '1', order: '1' } },
    { label: 'Standard example 2', values: { spacing: '10', wavelength: '10', order: '10' } },
    { label: 'Standard example 3', values: { spacing: '100', wavelength: '100', order: '100' } },
  ],
  compute: (v) => { const nm = 1e-9; const sinTheta = v.order * v.wavelength * nm / (2 * v.spacing * nm); const theta = sinTheta <= 1 ? Math.asin(sinTheta) * 180 / Math.PI : 90; return { result: theta, label: 'Bragg Angle', unit: 'degrees', steps: [{ label: 'Formula', value: '2d·sinθ = nλ' }, { label: 'Result', value: `θ = ${theta.toFixed(2)}°` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Bragg\'s Law describes X-ray diffraction from crystal lattice planes. Constructive interference occurs when 2d·sinθ = nλ.',
  formula: '2d·sin(θ) = nλ',
  interpretation: 'X-ray crystallography uses Bragg diffraction to determine atomic structures. The diffraction pattern reveals the crystal\'s 3D atomic arrangement. DNA structure was discovered this way.'
}

export default calcDef
