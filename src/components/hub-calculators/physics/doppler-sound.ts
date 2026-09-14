import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sourceFreq: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sourceSpeed: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), observerSpeed: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), movingToward: z.string().min(1) }),
  fields: [{ name: 'sourceFreq', label: 'Source Frequency', type: 'number', unit: 'Hz', min: 1, step: '1' }, { name: 'sourceSpeed', label: 'Source Speed', type: 'number', unit: 'm/s', min: 0, step: '1' }, { name: 'observerSpeed', label: 'Observer Speed', type: 'number', unit: 'm/s', min: 0, step: '1' }, { name: 'movingToward', label: 'Direction', type: 'select', options: [{ label: 'Toward each other', value: 'toward' }, { label: 'Away from each other', value: 'away' }] }],
  compute: (v) => { const vsound = 343; const fObs = v.movingToward === 'toward' ? v.sourceFreq * (vsound + v.observerSpeed) / (vsound - v.sourceSpeed) : v.sourceFreq * (vsound - v.observerSpeed) / (vsound + v.sourceSpeed); return { result: fObs, label: 'Observed Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f\' = f0(v±vₒ)/(v∓vₛ)' }, { label: 'Speed of sound', value: '343 m/s' }, { label: 'Observed', value: `${fObs.toFixed(2)} Hz` }, { label: 'Shift', value: `${(fObs - v.sourceFreq).toFixed(2)} Hz` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Doppler effect is used in radar speed guns, weather radar, medical ultrasound (blood flow), and astronomy (redshift measures cosmic expansion).' },
        { label: 'Common Values', value: 'Sound in air: 343 m/s. Typical ambulance siren: 800-1000 Hz. Police radar: K-band (24 GHz), Ka-band (35 GHz).' },
        { label: 'Precision Tip', value: 'For sound, the observed frequency depends on relative motion. Approaching source: f_obs = f_src/(1 - v_src/v). Receding: f_obs = f_src/(1 + v_src/v).' },
        { label: 'Related Formula', value: 'Doppler shift: f_obs = f_src(v ± v_obs)/(v ∓ v_src). Relativistic Doppler: f_obs = f_src√((1-β)/(1+β)). Hubble\'s law: v = H₀d.' },
        { label: 'Unit Conversion Note', value: 'Speed in same units as wave speed (m/s for sound, m/s or km/s for light). Redshift z = Δλ/λ₀ ≈ v/c for v << c.' }
      ]} },
  description: 'The Doppler effect for sound: observed frequency changes when source and/or observer move relative to each other through the medium.',
  formula: 'f\' = f0(v ± vₒ) / (v ∓ vₛ)',
  interpretation: 'Moving toward each other increases frequency (higher pitch). Moving apart decreases frequency (lower pitch). Breaking the sound barrier occurs when source speed exceeds 343 m/s.'
}

export default calcDef
