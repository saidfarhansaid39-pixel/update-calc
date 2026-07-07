import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ speed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'speed', label: 'Wave Speed', type: 'number', unit: 'm/s', min: 0.001, step: '0.001' }, { name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.speed / v.wavelength, label: 'Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f = v/λ' }, { label: 'Substitute', value: `${v.speed} / ${v.wavelength}` }, { label: 'Result', value: `${(v.speed / v.wavelength).toFixed(4)} Hz` }] }),
  description: 'Frequency is the number of wave cycles per second, calculated from wave speed and wavelength.',
  formula: 'f = v / λ',
  interpretation: 'Human hearing range is 20 Hz to 20,000 Hz. Radio frequencies range from kHz to GHz.'
}

export default calcDef
