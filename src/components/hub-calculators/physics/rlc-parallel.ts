import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ resistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), inductance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), capacitance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'resistance', label: 'Resistance', type: 'number', unit: 'ohm', min: 0.01, step: '0.01' }, { name: 'inductance', label: 'Inductance', type: 'number', unit: 'H', min: 1e-6, step: '1e-6' }, { name: 'capacitance', label: 'Capacitance', type: 'number', unit: 'F', min: 1e-12, step: '1e-12' }],
  compute: (v) => { const omega0 = 1 / Math.sqrt(v.inductance * v.capacitance); const f0 = omega0 / (2 * Math.PI); const Zmax = v.resistance; const Q = v.resistance * Math.sqrt(v.capacitance / v.inductance); return { result: f0, label: 'Resonant Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f0 = 1/(2π√(LC))' }, { label: 'Resonant f0', value: `${f0.toExponential(4)} Hz` }, { label: 'Quality factor Q', value: `${Q.toFixed(2)}` }, { label: 'Impedance at f0', value: `${Zmax.toFixed(2)} ohm (maximum)` }] } },
  description: 'A parallel RLC circuit has maximum impedance at resonance. Current is minimized at the resonant frequency.',
  formula: 'f0 = 1/(2π√(LC)), Q = R√(C/L)',
  interpretation: 'At resonance, impedance is purely resistive and maximized. Parallel resonance is used in trap circuits and band-stop filters. Higher Q means sharper notch.'
}

export default calcDef
