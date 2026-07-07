import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ voltage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), phase: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= -90 && n <= 90 }, '-90 to 90') }),
  fields: [{ name: 'voltage', label: 'RMS Voltage', type: 'number', unit: 'V', min: 0.1, step: '0.1' }, { name: 'current', label: 'RMS Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }, { name: 'phase', label: 'Phase Angle', type: 'number', unit: 'degrees', min: -90, max: 90, step: '1' }],
  compute: (v) => { const rad = v.phase * Math.PI / 180; const pf = Math.cos(rad); const P = v.voltage * v.current * pf; const Q = v.voltage * v.current * Math.sin(rad); const S = v.voltage * v.current; return { result: P, label: 'Real Power', unit: 'W', steps: [{ label: 'Formula', value: 'P = VI·cos(φ)' }, { label: 'Apparent power S', value: `${S.toFixed(2)} VA` }, { label: 'Power factor', value: `${pf.toFixed(4)}` }, { label: 'Reactive power Q', value: `${Q.toFixed(2)} VAR` }] } },
  description: 'AC power calculations: real power (W), apparent power (VA), reactive power (VAR), and power factor from RMS voltage, current, and phase angle.',
  formula: 'P = VI·cos(φ), S = VI, Q = VI·sin(φ)',
  interpretation: 'Power factor cos(φ) = 1 for pure resistive loads, 0 for pure reactive. Utilities charge for real power but must supply apparent power. Low PF means higher current for same real power.'
}

export default calcDef
