import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ m: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), k: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), kc: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'm', label: 'Mass (each)', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'k', label: 'Spring Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }, { name: 'kc', label: 'Coupling Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }],
  defaults: { m: '1', k: '1', kc: '1' },
  presets: [
    { label: 'Standard example 1', values: { m: '1', k: '1', kc: '1' } },
    { label: 'Standard example 2', values: { m: '10', k: '10', kc: '10' } },
    { label: 'Standard example 3', values: { m: '100', k: '100', kc: '100' } },
  ],
  compute: (v) => { const omega1 = Math.sqrt(v.k / v.m); const omega2 = Math.sqrt((v.k + 2 * v.kc) / v.m); return { result: omega1, label: 'Mode 1 Frequency (in-phase)', unit: 'rad/s', steps: [{ label: 'Formula', value: 'ω1^2 = k/m, ω2^2 = (k+2k_c)/m' }, { label: 'In-phase ω1', value: `${omega1.toFixed(3)} rad/s` }, { label: 'Out-of-phase ω2', value: `${omega2.toFixed(3)} rad/s` }, { label: 'Frequency split', value: `${(omega2 - omega1).toFixed(3)} rad/s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Coupled oscillators consist of two or more oscillators connected by springs. Energy transfers between them, producing normal modes of vibration.',
  formula: 'ω1 = sqrt(k/m), ω2 = sqrt((k+2k_c)/m)',
  interpretation: 'Two normal modes exist: in-phase (lower frequency) and out-of-phase (higher frequency). The frequency split depends on coupling strength. Beating occurs when both modes are excited.'
}

export default calcDef
