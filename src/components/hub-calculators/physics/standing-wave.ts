import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), harmonic: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10') }),
  fields: [{ name: 'length', label: 'String Length', type: 'number', unit: 'm', min: 0.01, step: '0.01' }, { name: 'harmonic', label: 'Harmonic Number', type: 'number', unit: '', min: 1, max: 10, step: '1' }],
  compute: (v) => { const lambda = 2 * v.length / v.harmonic; return { result: lambda, label: 'Wavelength', unit: 'm', steps: [{ label: 'Formula', value: 'λ_n = 2L/n' }, { label: 'Substitute', value: `2 × ${v.length} / ${v.harmonic}` }, { label: 'Wavelength', value: `${lambda.toFixed(4)} m` }, { label: 'Nodes', value: `${v.harmonic + 1}` }] } },
  description: 'Standing waves form when waves of equal amplitude and frequency travel in opposite directions, producing nodes and antinodes at fixed positions.',
  formula: 'λ_n = 2L/n, f_n = nv/(2L)',
  interpretation: 'The fundamental (n = 1) has the longest wavelength. Higher harmonics have shorter wavelengths and more nodes. Standing waves are the basis of musical instrument string vibrations.'
}

export default calcDef
