import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), m: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'T', label: 'Temperature T', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'm', label: 'Molecular Mass m', type: 'number', unit: 'kg', min: 1e-27, step: '1e-27' }],
  compute: (v) => { const k = 1.380649e-23; const vp = Math.sqrt(2 * k * v.T / v.m); const vavg = Math.sqrt(8 * k * v.T / (Math.PI * v.m)); const vrms = Math.sqrt(3 * k * v.T / v.m); return { result: vp, label: 'Most Probable Speed v_p', unit: 'm/s', steps: [{ label: 'Formula', value: 'v_p = √(2kT/m)' }, { label: 'v_avg', value: `${vavg.toFixed(1)} m/s` }, { label: 'v_rms', value: `${vrms.toFixed(1)} m/s` }, { label: 'v_p', value: `${vp.toFixed(1)} m/s` }] } },
  description: 'The most probable speed from the Maxwell-Boltzmann distribution. v_p = √(2kT/m). Also calculates v_avg and v_rms for comparison.',
  formula: 'v_p = √(2kT/m)',
  interpretation: 'For the Maxwell-Boltzmann distribution: v_p : v_avg : v_rms = 1 : 1.128 : 1.225. At 300 K for N₂: v_p ≈ 422 m/s, v_avg ≈ 476 m/s, v_rms ≈ 517 m/s.'
}

export default calcDef
