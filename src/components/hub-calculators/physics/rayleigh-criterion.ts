import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aperture: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 1e-9, step: '1e-9' }, { name: 'aperture', label: 'Aperture Diameter', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { wavelength: '1', aperture: '1' },
  presets: [
    { label: 'Standard example 1', values: { wavelength: '1', aperture: '1' } },
    { label: 'Standard example 2', values: { wavelength: '10', aperture: '10' } },
    { label: 'Standard example 3', values: { wavelength: '100', aperture: '100' } },
  ],
  compute: (v) => { const theta = 1.22 * v.wavelength / v.aperture; const thetaDeg = theta * 180 / Math.PI; return { result: theta, label: 'Minimum Angular Resolution', unit: 'rad', steps: [{ label: 'Formula', value: 'θ_min = 1.22λ/D' }, { label: 'Result', value: `${theta.toExponential(4)} rad (${thetaDeg.toExponential(4)}°)` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The Rayleigh criterion defines the diffraction-limited resolution of an optical system. Two points are resolved when the central maximum of one falls on the first minimum of the other.',
  formula: 'θ_min = 1.22·λ / D',
  interpretation: 'Larger aperture D gives better resolution. The Hubble telescope (D = 2.4 m) has angular resolution ~0.05 arcseconds for visible light. The eye has resolution ~0.02° (1 arcminute).'
}

export default calcDef
