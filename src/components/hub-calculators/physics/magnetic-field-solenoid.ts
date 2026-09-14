import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), turns: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }, { name: 'turns', label: 'Number of Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'length', label: 'Solenoid Length', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { turns: '100', length: '0.1', current: '2' },
  presets: [
    { label: 'Solenoid (100 turns, 10 cm, 2 A)', values: { turns: '100', length: '0.1', current: '2' } },
    { label: 'MRI magnet (2000 turns, 1.5 m, 200 A)', values: { turns: '2000', length: '1.5', current: '200' } },
    { label: 'Electromagnet (500 turns, 0.2 m, 5 A)', values: { turns: '500', length: '0.2', current: '5' } },
  ],
  compute: (v) => { const mu0 = 4 * Math.PI * 1e-7; const n = v.turns / v.length; const B = mu0 * n * v.current; return { result: B, label: 'Magnetic Field Inside', unit: 'T', steps: [{ label: 'Formula', value: 'B = μ0nI' }, { label: 'Turns per meter', value: `${n.toFixed(1)} turns/m` }, { label: 'Result', value: `${B.toExponential(4)} T` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Solenoids are used in MRI machines (1.5-3 T), particle accelerators, and electromagnetic door locks.' },
        { label: 'Common Values', value: 'Earth\'s magnetic field: ~5×10⁻⁵ T. Fridge magnet: ~5×10⁻³ T. MRI: 1.5-3 T. Strongest lab magnets: up to 45 T. μ₀ = 4π×10⁻⁷ T·m/A.' },
        { label: 'Precision Tip', value: 'Solenoid field B = μ₀nI (n = turns/m). Field is uniform inside an ideal solenoid. Edge effects reduce field near ends.' },
        { label: 'Related Formula', value: 'B = μ₀nI. Magnetic flux: Φ = BA. Self-inductance: L = NΦ/I. Energy stored: U = ½LI².' },
        { label: 'Unit Conversion Note', value: '1 T = 1 N/(A·m). 1 Gauss = 10⁻⁴ T. Earth\'s field ≈ 0.5 Gauss = 5×10⁻⁵ T.' }
      ]} },
  description: 'The magnetic field inside an ideal solenoid is uniform and depends on current density (turns per meter).',
  formula: 'B = μ0·n·I, n = N/L',
  interpretation: 'The field is nearly uniform inside and much weaker outside. A longer solenoid with more turns produces a stronger field. Ferromagnetic cores can amplify B by factors of 10^3-10^5.'
}

export default calcDef
