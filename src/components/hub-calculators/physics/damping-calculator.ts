import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), springConstant: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), damping: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'springConstant', label: 'Spring Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }, { name: 'damping', label: 'Damping Coefficient', type: 'number', unit: 'N·s/m', min: 0, step: '0.1' }],
  defaults: { mass: '1', springConstant: '1', damping: '1' },
  presets: [
    { label: 'Standard example 1', values: { mass: '1', springConstant: '1', damping: '1' } },
    { label: 'Standard example 2', values: { mass: '10', springConstant: '10', damping: '10' } },
    { label: 'Standard example 3', values: { mass: '100', springConstant: '100', damping: '100' } },
  ],
  compute: (v) => { const omega0 = Math.sqrt(v.springConstant / v.mass); const gamma = v.damping / v.mass; const crit = 2 * omega0; const ratio = gamma / crit; return { result: ratio, label: 'Damping Ratio', unit: '', steps: [{ label: 'Natural frequency', value: `ω0 = ${omega0.toFixed(3)} rad/s` }, { label: 'Critical damping', value: `${crit.toFixed(3)} /s` }, { label: 'Damping ratio', value: `ζ = ${ratio.toFixed(4)}` }, { label: 'Regime', value: ratio < 1 ? 'Underdamped' : ratio > 1 ? 'Overdamped' : 'Critically damped' }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Damping describes how oscillations decay over time due to dissipative forces like friction or air resistance.',
  formula: 'ζ = b / (2sqrt(mk))',
  interpretation: 'ζ < 1: underdamped (oscillates with decaying amplitude), ζ = 1: critically damped (fastest return to equilibrium), ζ > 1: overdamped (no oscillation).'
}

export default calcDef
