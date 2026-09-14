import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), slitWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 1e-9, step: '1e-9' }, { name: 'slitWidth', label: 'Slit Width', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }],
  defaults: { wavelength: '1', slitWidth: '1' },
  presets: [
    { label: 'Standard example 1', values: { wavelength: '1', slitWidth: '1' } },
    { label: 'Standard example 2', values: { wavelength: '10', slitWidth: '10' } },
    { label: 'Standard example 3', values: { wavelength: '100', slitWidth: '100' } },
  ],
  compute: (v) => { const theta = Math.asin(v.wavelength / v.slitWidth); const thetaDeg = theta * 180 / Math.PI; return { result: thetaDeg, label: 'First Minimum Angle', unit: 'degrees', steps: [{ label: 'Formula', value: 'a·sinθ = λ' }, { label: 'Result', value: `θ = ${thetaDeg.toFixed(3)}°` }, { label: 'Angular width', value: `2θ = ${(2 * thetaDeg).toFixed(3)}°` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Single-slit diffraction produces a central bright maximum twice as wide as the side maxima. The first minimum occurs at a·sinθ = λ.',
  formula: 'a·sin(θ) = mλ (m = 1 for first minimum)',
  interpretation: 'Narrower slits produce wider diffraction patterns. The central maximum width is 2λ/a. Diffraction limits the resolution of all optical instruments.'
}

export default calcDef
