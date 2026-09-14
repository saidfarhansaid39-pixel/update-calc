import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ q1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), q2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), r: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'q1', label: 'Charge 1', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'q2', label: 'Charge 2', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'r', label: 'Separation Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { charge1: '1.6e-19', charge2: '1.6e-19', distance: '5.29e-11' },
  presets: [
    { label: 'Electron-proton (H atom)', values: { charge1: '1.6e-19', charge2: '1.6e-19', distance: '5.29e-11' } },
    { label: 'Two protons in nucleus (1 fm)', values: { charge1: '1.6e-19', charge2: '1.6e-19', distance: '1e-15' } },
    { label: 'Static charges (1 μC, 1 cm)', values: { charge1: '1e-6', charge2: '1e-6', distance: '0.01' } },
  ],
  compute: (v) => { const k = 8.988e9; const F = k * v.q1 * v.q2 / (v.r * v.r); return { result: F, label: 'Electrostatic Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = k·q1q2/r^2' }, { label: 'k = 8.988×10⁹', value: '' }, { label: 'Result', value: `${F.toExponential(4)} N` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Coulomb\'s law explains chemical bonding, static electricity, and particle interactions. The hydrogen atom is held together by 8.2×10⁻⁸ N of electrostatic force.' },
        { label: 'Common Values', value: 'k_e = 1/(4πε₀) = 8.99×10⁹ N·m²/C². ε₀ = 8.854×10⁻¹² F/m. e = 1.602×10⁻¹⁹ C. 1 μC = 10⁻⁶ C. Typical static: nC-μC range.' },
        { label: 'Precision Tip', value: 'F = k_e|q₁q₂|/r². Force is attractive for opposite charges, repulsive for like charges. Coulomb\'s law is an inverse-square law like gravity.' },
        { label: 'Related Formula', value: 'F = k_e q₁q₂/r². Electric field: E = k_e q/r². Potential: V = k_e q/r. Gauss\'s law: ∮E·dA = Q/ε₀.' },
        { label: 'Unit Conversion Note', value: 'k_e = 8.99×10⁹ N·m²/C². ε₀ = 8.854×10⁻¹² F/m. 1 C = charge of 6.24×10¹⁸ electrons. 1 μC = 10⁻⁶ C.' }
      ]} },
  description: 'Coulomb\'s Law gives the electrostatic force between two point charges. Like charges repel, opposite charges attract.',
  formula: 'F = k·|q1q2| / r^2',
  interpretation: 'k = 8.988×10⁹ N·m^2/C^2. The force is inversely proportional to the square of distance. This is analogous to Newton\'s law of gravitation but for electric charges.'
}

export default calcDef
