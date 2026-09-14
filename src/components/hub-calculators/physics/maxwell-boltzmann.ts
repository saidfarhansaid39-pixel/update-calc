import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), m: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'T', label: 'Temperature T', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'm', label: 'Molecular Mass m', type: 'number', unit: 'kg', min: 1e-27, step: '1e-27' }],
  defaults: { T: '1', m: '1' },
  presets: [
    { label: 'Standard example 1', values: { T: '1', m: '1' } },
    { label: 'Standard example 2', values: { T: '10', m: '10' } },
    { label: 'Standard example 3', values: { T: '100', m: '100' } },
  ],
  compute: (v) => { const k = 1.380649e-23; const vp = Math.sqrt(2 * k * v.T / v.m); const vavg = Math.sqrt(8 * k * v.T / (Math.PI * v.m)); const vrms = Math.sqrt(3 * k * v.T / v.m); return { result: vp, label: 'Most Probable Speed v_p', unit: 'm/s', steps: [{ label: 'Formula', value: 'v_p = √(2kT/m)' }, { label: 'v_avg', value: `${vavg.toFixed(1)} m/s` }, { label: 'v_rms', value: `${vrms.toFixed(1)} m/s` }, { label: 'v_p', value: `${vp.toFixed(1)} m/s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The most probable speed from the Maxwell-Boltzmann distribution. v_p = √(2kT/m). Also calculates v_avg and v_rms for comparison.',
  formula: 'v_p = √(2kT/m)',
  interpretation: 'For the Maxwell-Boltzmann distribution: v_p : v_avg : v_rms = 1 : 1.128 : 1.225. At 300 K for N₂: v_p ≈ 422 m/s, v_avg ≈ 476 m/s, v_rms ≈ 517 m/s.'
}

export default calcDef
