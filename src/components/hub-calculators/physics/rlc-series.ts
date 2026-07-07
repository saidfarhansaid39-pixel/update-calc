import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ resistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), inductance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), capacitance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'resistance', label: 'Resistance', type: 'number', unit: 'ohm', min: 0.01, step: '0.01' }, { name: 'inductance', label: 'Inductance', type: 'number', unit: 'H', min: 1e-6, step: '1e-6' }, { name: 'capacitance', label: 'Capacitance', type: 'number', unit: 'F', min: 1e-12, step: '1e-12' }],
  compute: (v) => { const omega0 = 1 / Math.sqrt(v.inductance * v.capacitance); const f0 = omega0 / (2 * Math.PI); const Zmin = v.resistance; const Q = (1 / v.resistance) * Math.sqrt(v.inductance / v.capacitance); return { result: f0, label: 'Resonant Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f0 = 1/(2pisqrt(LC))' }, { label: 'Resonant f0', value: `${f0.toExponential(4)} Hz` }, { label: 'Quality factor Q', value: `${Q.toFixed(2)}` },         { label: 'Impedance at f0', value: `${Zmin.toFixed(2)} ohm (minimum)` }] } },
  description: 'A series RLC circuit has minimum impedance at resonance. The quality factor Q determines the sharpness of the resonance peak.',
  formula: 'f0 = 1/(2pisqrt(LC)), Q = (1/R)sqrt(L/C)',
  interpretation: 'At resonance, impedance is purely resistive and minimized. Higher Q means sharper resonance and better frequency selectivity. Bandwidth Δf = f0/Q.'
}

export default calcDef
