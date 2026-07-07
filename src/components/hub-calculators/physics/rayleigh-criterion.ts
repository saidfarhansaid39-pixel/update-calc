import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aperture: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 1e-9, step: '1e-9' }, { name: 'aperture', label: 'Aperture Diameter', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const theta = 1.22 * v.wavelength / v.aperture; const thetaDeg = theta * 180 / Math.PI; return { result: theta, label: 'Minimum Angular Resolution', unit: 'rad', steps: [{ label: 'Formula', value: 'θ_min = 1.22λ/D' }, { label: 'Result', value: `${theta.toExponential(4)} rad (${thetaDeg.toExponential(4)}°)` }] } },
  description: 'The Rayleigh criterion defines the diffraction-limited resolution of an optical system. Two points are resolved when the central maximum of one falls on the first minimum of the other.',
  formula: 'θ_min = 1.22·λ / D',
  interpretation: 'Larger aperture D gives better resolution. The Hubble telescope (D = 2.4 m) has angular resolution ~0.05 arcseconds for visible light. The eye has resolution ~0.02° (1 arcminute).'
}

export default calcDef
