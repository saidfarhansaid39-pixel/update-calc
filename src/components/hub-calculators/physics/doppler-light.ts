import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'wavelength', label: 'Rest Wavelength', type: 'number', unit: 'nm', min: 1, step: '1' }, { name: 'velocity', label: 'Relative Velocity (receding)', type: 'number', unit: 'm/s', min: 0, step: '1e6' }],
  defaults: { sourceSpeed: '30', frequency: '1000', waveSpeed: '343' },
  presets: [
    { label: 'Ambulance siren (100 m/s)', values: { sourceSpeed: '30', frequency: '1000', waveSpeed: '343' } },
    { label: 'Redshift (0.1c receding)', values: { sourceSpeed: '3e7', frequency: '5e14', waveSpeed: '3e8' } },
    { label: 'Approaching train horn (80 m/s)', values: { sourceSpeed: '40', frequency: '500', waveSpeed: '343' } },
  ],
  compute: (v) => { const c = 299792458; const z = v.velocity / c; const lambdaObs = v.wavelength * Math.sqrt((1 + z) / (1 - z)); const shift = lambdaObs - v.wavelength; return { result: lambdaObs, label: 'Observed Wavelength', unit: 'nm', steps: [{ label: 'Formula', value: 'λ_obs = λ0sqrt(1+β)/(1-β)' }, { label: 'Redshift z', value: `${z.toExponential(4)}` }, { label: 'Observed λ', value: `${lambdaObs.toFixed(2)} nm` }, { label: 'Shift', value: `${shift.toFixed(2)} nm ${shift > 0 ? '(redshift)' : '(blueshift)'}` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Doppler effect is used in radar speed guns, weather radar, medical ultrasound (blood flow), and astronomy (redshift measures cosmic expansion).' },
        { label: 'Common Values', value: 'Sound in air: 343 m/s. Typical ambulance siren: 800-1000 Hz. Police radar: K-band (24 GHz), Ka-band (35 GHz).' },
        { label: 'Precision Tip', value: 'For sound, the observed frequency depends on relative motion. Approaching source: f_obs = f_src/(1 - v_src/v). Receding: f_obs = f_src/(1 + v_src/v).' },
        { label: 'Related Formula', value: 'Doppler shift: f_obs = f_src(v ± v_obs)/(v ∓ v_src). Relativistic Doppler: f_obs = f_src√((1-β)/(1+β)). Hubble\'s law: v = H₀d.' },
        { label: 'Unit Conversion Note', value: 'Speed in same units as wave speed (m/s for sound, m/s or km/s for light). Redshift z = Δλ/λ₀ ≈ v/c for v << c.' }
      ]} },
  description: 'The relativistic Doppler effect for light: wavelength shifts due to relative motion. Redshift indicates recession, blueshift indicates approach.',
  formula: 'λ_obs = λ0sqrt(1+β)/(1-β), β = v/c',
  interpretation: 'Unlike sound, the Doppler effect for light depends only on relative velocity, not on which is moving. Redshifted light from distant galaxies is evidence of universal expansion.'
}

export default calcDef
