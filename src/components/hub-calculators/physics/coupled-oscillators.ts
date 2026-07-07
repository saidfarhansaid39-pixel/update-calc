import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ m: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), k: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), kc: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'm', label: 'Mass (each)', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'k', label: 'Spring Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }, { name: 'kc', label: 'Coupling Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }],
  compute: (v) => { const omega1 = Math.sqrt(v.k / v.m); const omega2 = Math.sqrt((v.k + 2 * v.kc) / v.m); return { result: omega1, label: 'Mode 1 Frequency (in-phase)', unit: 'rad/s', steps: [{ label: 'Formula', value: 'ω1^2 = k/m, ω2^2 = (k+2k_c)/m' }, { label: 'In-phase ω1', value: `${omega1.toFixed(3)} rad/s` }, { label: 'Out-of-phase ω2', value: `${omega2.toFixed(3)} rad/s` }, { label: 'Frequency split', value: `${(omega2 - omega1).toFixed(3)} rad/s` }] } },
  description: 'Coupled oscillators consist of two or more oscillators connected by springs. Energy transfers between them, producing normal modes of vibration.',
  formula: 'ω1 = sqrt(k/m), ω2 = sqrt((k+2k_c)/m)',
  interpretation: 'Two normal modes exist: in-phase (lower frequency) and out-of-phase (higher frequency). The frequency split depends on coupling strength. Beating occurs when both modes are excited.'
}

export default calcDef
