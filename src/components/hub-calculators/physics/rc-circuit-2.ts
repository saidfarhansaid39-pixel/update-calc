import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ R: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), C: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'R', label: 'Resistance R', type: 'number', unit: 'Ω', min: 0.1, step: '0.1' }, { name: 'C', label: 'Capacitance C', type: 'number', unit: 'F', min: 1e-12, step: '1e-12' }, { name: 'T', label: 'Time t', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  compute: (v) => { const tau = v.R * v.C; const qfrac = 1 - Math.exp(-v.T / tau); return { result: tau, label: 'Time Constant τ = RC', unit: 's', steps: [{ label: 'Formula', value: 'τ = RC' }, { label: 'τ', value: `${tau.toExponential(4)} s` }, { label: 'Charge % (charging)', value: `${(qfrac * 100).toFixed(1)}%` }] } },
  description: 'RC circuit time constant and transient response. τ = RC is the time for voltage/charge to reach ~63.2% of its final value (charging) or drop to ~36.8% (discharging).',
  formula: 'τ = RC, V(t) = V₀(1 − e^(−t/τ))',
  interpretation: 'After 5τ ≈ 5RC, the capacitor is considered fully charged (99.3%). RC circuits are fundamental to timing circuits, filters, power supplies, and signal processing.'
}

export default calcDef
