import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ inductance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), capacitance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'inductance', label: 'Inductance', type: 'number', unit: 'H', min: 1e-6, step: '1e-6' }, { name: 'capacitance', label: 'Capacitance', type: 'number', unit: 'F', min: 1e-12, step: '1e-12' }],
  compute: (v) => { const omega = 1 / Math.sqrt(v.inductance * v.capacitance); const f = omega / (2 * Math.PI); const T = 1 / f; return { result: f, label: 'Resonant Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f = 1/(2pisqrt(LC))' }, { label: 'Angular frequency', value: `${omega.toExponential(4)} rad/s` }, { label: 'Frequency', value: `${f.toExponential(4)} Hz` }, { label: 'Period', value: `${T.toExponential(4)} s` }] } },
  description: 'An LC circuit oscillates with energy alternating between the inductor\'s magnetic field and the capacitor\'s electric field at the resonant frequency.',
  formula: 'f = 1 / (2pisqrt(LC))',
  interpretation: 'Energy in an ideal LC circuit oscillates forever without damping. The resonant frequency is the natural frequency at which the circuit oscillates. Used in radio tuners and oscillators.'
}

export default calcDef
