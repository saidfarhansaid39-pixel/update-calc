import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), field: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge', label: 'Particle Charge', type: 'number', unit: 'C', min: 1.602e-19, step: '1.602e-19' }, { name: 'mass', label: 'Particle Mass', type: 'number', unit: 'kg', min: 1e-31, step: '1e-31' }, { name: 'field', label: 'Magnetic Field', type: 'number', unit: 'T', min: 0.001, step: '0.001' }],
  compute: (v) => { const fc = v.charge * v.field / (2 * Math.PI * v.mass); return { result: fc, label: 'Cyclotron Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f_c = qB/(2πm)' }, { label: 'Result', value: `${fc.toExponential(4)} Hz` }] } },
  description: 'Cyclotron frequency is the frequency at which a charged particle orbits in a uniform magnetic field. It is independent of particle speed.',
  formula: 'f_c = qB / (2πm)',
  interpretation: 'Cyclotrons accelerate charged particles using this resonance. The frequency is constant allowing continuous acceleration. Protons in a 1 T field have f_c ≈ 15.2 MHz.'
}

export default calcDef
