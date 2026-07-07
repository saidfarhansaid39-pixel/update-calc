import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'frequency', label: 'Frequency', type: 'number', unit: 'Hz', min: 0.001, step: '0.001' }, { name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.frequency * v.wavelength, label: 'Wave Speed', unit: 'm/s', steps: [{ label: 'Formula', value: 'v = fλ' }, { label: 'Substitute', value: `${v.frequency} × ${v.wavelength}` }, { label: 'Result', value: `${(v.frequency * v.wavelength).toFixed(3)} m/s` }] }),
  description: 'Wave speed equals frequency times wavelength. This fundamental wave equation applies to all types of waves.',
  formula: 'v = f × λ',
  interpretation: 'For a given medium, wave speed is constant. Increasing frequency decreases wavelength and vice versa.'
}

export default calcDef
