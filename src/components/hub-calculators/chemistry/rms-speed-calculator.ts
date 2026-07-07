import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    t: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    m: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 't', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '1' },
    { name: 'm', label: 'Molar Mass of Gas', type: 'number', unit: 'kg/mol', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const R = 8.314
    const vRMS = Math.sqrt(3 * R * v.t / v.m)
    return {
      result: vRMS, label: 'RMS Speed', unit: 'm/s',
      steps: [
        { label: 'T', value: `${v.t} K` },
        { label: 'Molar mass', value: `${v.m} kg/mol` },
        { label: 'v_rms = √(3RT/M)', value: `${vRMS.toFixed(1)} m/s` },
      ]
}
  },
  description: 'Root-mean-square (RMS) speed is the measure of the average speed of gas molecules in an ideal gas, derived from kinetic molecular theory.',
  formula: 'v_rms = √(3RT/M)',
  interpretation: 'RMS speed increases with temperature and decreases with molar mass. Lighter gases (H₂, He) move faster than heavier gases (O₂, CO₂) at the same temperature.'
}

export default calcDef
