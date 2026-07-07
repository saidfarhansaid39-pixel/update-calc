import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ initialLambda: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), angle: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n <= 180 }, '0-180') }),
  fields: [{ name: 'initialLambda', label: 'Initial Wavelength', type: 'number', unit: 'pm', min: 0.1, step: '0.1' }, { name: 'angle', label: 'Scattering Angle', type: 'number', unit: 'degrees', min: 0, max: 180, step: '1' }],
  compute: (v) => { const h = 6.626e-34; const me = 9.109e-31; const c = 299792458; const pm = 1e-12; const lambdaC = h / (me * c); const rad = v.angle * Math.PI / 180; const shift = lambdaC * (1 - Math.cos(rad)); const finalLambda = v.initialLambda * pm + shift; return { result: shift, label: 'Compton Shift', unit: 'm', steps: [{ label: 'Formula', value: 'Δλ = h/(mₑc)(1 - cosθ)' }, { label: 'Compton wavelength', value: `${(lambdaC * 1e12).toFixed(2)} pm` }, { label: 'Shift Δλ', value: `${shift.toExponential(4)} m` }, { label: 'Final λ', value: `${(finalLambda * 1e12).toFixed(2)} pm` }] } },
  description: 'Compton scattering: X-ray photons scatter off electrons, increasing wavelength. The wavelength shift depends only on the scattering angle.',
  formula: 'Δλ = h/(mₑc) · (1 - cosθ)',
  interpretation: 'Compton wavelength of electron = h/(mₑc) = 2.426 pm. The maximum shift (180° backscatter) is 2λ_C = 4.852 pm. This effect confirmed the particle nature of photons.'
}

export default calcDef
