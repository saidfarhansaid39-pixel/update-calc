import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'wavelength', label: 'Rest Wavelength', type: 'number', unit: 'nm', min: 1, step: '1' }, { name: 'velocity', label: 'Relative Velocity (receding)', type: 'number', unit: 'm/s', min: 0, step: '1e6' }],
  compute: (v) => { const c = 299792458; const z = v.velocity / c; const lambdaObs = v.wavelength * Math.sqrt((1 + z) / (1 - z)); const shift = lambdaObs - v.wavelength; return { result: lambdaObs, label: 'Observed Wavelength', unit: 'nm', steps: [{ label: 'Formula', value: 'λ_obs = λ0sqrt(1+β)/(1-β)' }, { label: 'Redshift z', value: `${z.toExponential(4)}` }, { label: 'Observed λ', value: `${lambdaObs.toFixed(2)} nm` }, { label: 'Shift', value: `${shift.toFixed(2)} nm ${shift > 0 ? '(redshift)' : '(blueshift)'}` }] } },
  description: 'The relativistic Doppler effect for light: wavelength shifts due to relative motion. Redshift indicates recession, blueshift indicates approach.',
  formula: 'λ_obs = λ0sqrt(1+β)/(1-β), β = v/c',
  interpretation: 'Unlike sound, the Doppler effect for light depends only on relative velocity, not on which is moving. Redshifted light from distant galaxies is evidence of universal expansion.'
}

export default calcDef
