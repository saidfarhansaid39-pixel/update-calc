import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sourceFreq: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sourceSpeed: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), obsSpeed: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'sourceFreq', label: 'Source Frequency', type: 'number', unit: 'Hz', min: 1, step: '1' }, { name: 'sourceSpeed', label: 'Source Speed', type: 'number', unit: 'm/s', min: 0, step: '1' }, { name: 'obsSpeed', label: 'Observer Speed', type: 'number', unit: 'm/s', min: 0, step: '1' }],
  compute: (v) => { const vsound = 343; const fObs = v.sourceFreq * (vsound + v.obsSpeed) / (vsound + v.sourceSpeed); return { result: fObs, label: 'Observed Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f\' = f0·(v±v0)/(v±vₛ)' }, { label: 'Speed of sound', value: '343 m/s' }, { label: 'Result', value: `${fObs.toFixed(2)} Hz` }] } },
  description: 'The Doppler effect is the change in observed frequency of a wave due to relative motion between source and observer.',
  formula: 'f\' = f0·(v ± v0)/(v ∓ vₛ)',
  interpretation: 'A source moving toward you produces a higher pitch; moving away produces a lower pitch. Used in radar and astronomy.'
}

export default calcDef
