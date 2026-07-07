import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ voltage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), impedance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), phase: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= -90 && n <= 90 }, '-90 to 90') }),
  fields: [{ name: 'voltage', label: 'RMS Voltage', type: 'number', unit: 'V', min: 0.1, step: '0.1' }, { name: 'impedance', label: 'Impedance |Z|', type: 'number', unit: 'ohm', min: 0.1, step: '0.1' }, { name: 'phase', label: 'Phase Angle', type: 'number', unit: 'degrees', min: -90, max: 90, step: '1' }],
  compute: (v) => { const I = v.voltage / v.impedance; const rad = v.phase * Math.PI / 180; const P = v.voltage * I * Math.cos(rad); return { result: I, label: 'RMS Current', unit: 'A', steps: [{ label: 'I = V/Z', value: `${v.voltage} / ${v.impedance} = ${I.toFixed(3)} A` }, { label: 'Power factor', value: `cos(φ) = ${Math.cos(rad).toFixed(4)}` }, { label: 'Real power', value: `${P.toFixed(2)} W` }] } },
  description: 'AC circuit analysis: current, power factor, and real power from RMS voltage, impedance magnitude, and phase angle.',
  formula: 'I = V/Z, P = VI·cos(φ)',
  interpretation: 'The power factor cos(φ) ranges from 0 (pure reactive) to 1 (pure resistive). A low power factor means more reactive power and less useful work.'
}

export default calcDef
