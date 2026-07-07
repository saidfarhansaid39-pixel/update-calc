import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ speed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'speed', label: 'Wave Speed', type: 'number', unit: 'm/s', min: 0.001, step: '0.001' }, { name: 'frequency', label: 'Frequency', type: 'number', unit: 'Hz', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.speed / v.frequency, label: 'Wavelength', unit: 'm', steps: [{ label: 'Formula', value: 'λ = v/f' }, { label: 'Substitute', value: `${v.speed} / ${v.frequency}` }, { label: 'Result', value: `${(v.speed / v.frequency).toFixed(4)} m` }] }),
  description: 'Wavelength is the distance between successive wave crests, calculated from wave speed and frequency.',
  formula: 'λ = v / f',
  interpretation: 'Visible light wavelengths range from 400 nm (violet) to 700 nm (red). Sound wavelengths range from ~17 mm to 17 m.'
}

export default calcDef
