import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    d: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'distance', label: 'Diffusion Distance', type: 'number', unit: 'µm', min: 0.1, step: '0.1' },
    { name: 'd', label: 'Diffusion Coefficient (D)', type: 'number', unit: '×10?? m²/s', min: 0.01, step: '0.01' },
  ],
  compute: (v) => {
    const dM2 = v.d * 1e-9
    const distM = v.distance * 1e-6
    const time = (distM * distM) / (2 * dM2)
    return {
      result: time, label: 'Diffusion Time', unit: 's',
      steps: [
        { label: 'Distance', value: `${v.distance} µm` },
        { label: 'D', value: `${v.d} × 10?? m²/s` },
        { label: 't = x²/2D', value: `${time.toFixed(4)} s` },
        { label: 't (ms)', value: `${(time * 1000).toFixed(2)} ms` },
      ]
}
  },
  description: 'Diffusion is the passive movement of molecules from high to low concentration. The time required scales with the square of distance (Fick\'s second law).',
  formula: 't = x² / 2D | RMS displacement = v(2Dt)',
  interpretation: 'Diffusion is efficient over short distances (µm) but slow over long distances. Cells use active transport and cytoplasmic streaming for long-range transport.'
}

export default calcDef
