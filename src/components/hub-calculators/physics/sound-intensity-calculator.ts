import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ intensity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'intensity', label: 'Intensity', type: 'number', unit: 'W/m^2', min: 1e-12, step: '1e-12' }],
  compute: (v) => { const I0 = 1e-12; const dB = 10 * Math.log10(v.intensity / I0); return { result: dB, label: 'Sound Level', unit: 'dB', steps: [{ label: 'Formula', value: 'L = 10·log10(I/I0)' }, { label: 'I0', value: '10⁻¹^2 W/m^2 (reference)' }, { label: 'Result', value: `${dB.toFixed(1)} dB` }] } },
  description: 'Sound intensity level in decibels is a logarithmic measure relative to the threshold of hearing (10⁻¹^2 W/m^2).',
  formula: 'L = 10·log10(I/I0)',
  interpretation: 'Normal conversation ~60 dB, threshold of pain ~120 dB. Every 10 dB increase represents a 10× increase in intensity.'
}

export default calcDef
