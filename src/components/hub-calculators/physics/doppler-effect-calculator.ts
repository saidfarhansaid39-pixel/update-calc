import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sourceFreq: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sourceSpeed: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), obsSpeed: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'sourceFreq', label: 'Source Frequency', type: 'number', unit: 'Hz', min: 1, step: '1' }, { name: 'sourceSpeed', label: 'Source Speed', type: 'number', unit: 'm/s', min: 0, step: '1' }, { name: 'obsSpeed', label: 'Observer Speed', type: 'number', unit: 'm/s', min: 0, step: '1' }],
  defaults: { sourceSpeed: '30', frequency: '1000', waveSpeed: '343' },
  presets: [
    { label: 'Ambulance siren (100 m/s)', values: { sourceSpeed: '30', frequency: '1000', waveSpeed: '343' } },
    { label: 'Redshift (0.1c receding)', values: { sourceSpeed: '3e7', frequency: '5e14', waveSpeed: '3e8' } },
    { label: 'Approaching train horn (80 m/s)', values: { sourceSpeed: '40', frequency: '500', waveSpeed: '343' } },
  ],
  compute: (v) => { const vsound = 343; const fObs = v.sourceFreq * (vsound + v.obsSpeed) / (vsound + v.sourceSpeed); return { result: fObs, label: 'Observed Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f\' = f0·(v±v0)/(v±vₛ)' }, { label: 'Speed of sound', value: '343 m/s' }, { label: 'Result', value: `${fObs.toFixed(2)} Hz` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Doppler effect is used in radar speed guns, weather radar, medical ultrasound (blood flow), and astronomy (redshift measures cosmic expansion).' },
        { label: 'Common Values', value: 'Sound in air: 343 m/s. Typical ambulance siren: 800-1000 Hz. Police radar: K-band (24 GHz), Ka-band (35 GHz).' },
        { label: 'Precision Tip', value: 'For sound, the observed frequency depends on relative motion. Approaching source: f_obs = f_src/(1 - v_src/v). Receding: f_obs = f_src/(1 + v_src/v).' },
        { label: 'Related Formula', value: 'Doppler shift: f_obs = f_src(v ± v_obs)/(v ∓ v_src). Relativistic Doppler: f_obs = f_src√((1-β)/(1+β)). Hubble\'s law: v = H₀d.' },
        { label: 'Unit Conversion Note', value: 'Speed in same units as wave speed (m/s for sound, m/s or km/s for light). Redshift z = Δλ/λ₀ ≈ v/c for v << c.' }
      ]} },
  description: 'The Doppler effect is the change in observed frequency of a wave due to relative motion between source and observer.',
  formula: 'f\' = f0·(v ± v0)/(v ∓ vₛ)',
  interpretation: 'A source moving toward you produces a higher pitch; moving away produces a lower pitch. Used in radar and astronomy.'
}

export default calcDef
