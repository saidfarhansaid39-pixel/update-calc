import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }, { name: 'distance', label: 'Distance from Wire', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { current: '10', distance: '0.05' },
  presets: [
    { label: 'Wire 1 cm from 10 A', values: { current: '10', distance: '0.01' } },
    { label: 'Power line 20 m from 100 A', values: { current: '100', distance: '20' } },
    { label: 'Lightning bolt (10 m, 30 kA)', values: { current: '30000', distance: '10' } },
  ],
  compute: (v) => { const mu0 = 4 * Math.PI * 1e-7; const B = mu0 * v.current / (2 * Math.PI * v.distance); return { result: B, label: 'Magnetic Field', unit: 'T', steps: [{ label: 'Formula', value: 'B = u0I/(2pir)' }, { label: 'u0', value: '4pi×10⁻⁷ T·m/A' }, { label: 'Result', value: `${B.toExponential(4)} T` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Magnetic fields from currents power motors, generators, transformers, and wireless charging.' },
        { label: 'Common Values', value: 'μ₀ = 4π×10⁻⁷ T·m/A. Straight wire: B = μ₀I/(2πr). Loop center: B = μ₀I/(2R). Earth\'s field: ~5×10⁻⁵ T.' },
        { label: 'Precision Tip', value: 'Magnetic field direction is given by the right-hand rule. Field from a straight wire decreases as 1/r.' },
        { label: 'Related Formula', value: 'Biot-Savart law: dB = μ₀/4π × Idl×r̂/r². Ampère\'s law: ∮B·dl = μ₀I_enc. Force on a wire: F = ILB.' },
        { label: 'Unit Conversion Note', value: '1 T = 10⁴ Gauss. μ₀ = 4π×10⁻⁷ T·m/A = 1.2566×10⁻⁶ T·m/A.' }
      ]} },
  description: 'The magnetic field around a long straight current-carrying wire is calculated using Ampere\'s Law.',
  formula: 'B = u0·I / (2pi·r)',
  interpretation: 'u0 = 4pi×10⁻⁷ T·m/A. The field encircles the wire with direction given by the right-hand rule. Field strength decreases with distance.'
}

export default calcDef
