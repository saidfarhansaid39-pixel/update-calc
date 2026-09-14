import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'width', label: 'Well Width', type: 'number', unit: 'nm', min: 0.01, step: '0.01' }, { name: 'depth', label: 'Well Depth V₀', type: 'number', unit: 'eV', min: 0.1, step: '0.1' }],
  defaults: { length: '1e-9', n: '1' },
  presets: [
    { label: 'Electron in 1D box (1 nm)', values: { length: '1e-9', n: '1' } },
    { label: 'Electron n=2 (1 nm box)', values: { length: '1e-9', n: '2' } },
    { label: 'Proton in nucleus (1 fm)', values: { length: '1e-15', n: '1' } },
  ],
  compute: (v) => { const me = 9.109e-31; const e = 1.602e-19; const hbar = 1.055e-34; const L = v.width * 1e-9; const V0 = v.depth * e; const N = Math.floor(Math.sqrt(2 * me * V0) * L / (Math.PI * hbar)) + 1; return { result: N, label: 'Estimated Number of Bound States', unit: '', steps: [{ label: 'Formula', value: 'N ≈ floor(√(2mV₀)L/(πħ)) + 1' }, { label: 'Result', value: `~${N} bound states` }, { label: 'Note', value: 'Finite well has fewer states than infinite well of same width' }] ,
    extras: [
        { label: 'Real-World Application', value: 'The Schrödinger equation describes quantum systems — from electron orbitals in atoms to energy levels in quantum dots and semiconductor wells.' },
        { label: 'Common Values', value: 'h = 6.626×10⁻³⁴ J·s. ħ = h/2π = 1.055×10⁻³⁴ J·s. m_e = 9.11×10⁻³¹ kg. 1 nm box: E₁ = 0.376 eV. 1 fm box: E₁ = 376 MeV.' },
        { label: 'Precision Tip', value: 'Infinite square well: E_n = n²h²/(8mL²). Wavefunctions: ψ_n(x) = √(2/L) sin(nπx/L). n = 1 is ground state (lowest energy).' },
        { label: 'Related Formula', value: 'E_n = n²h²/(8mL²). Finite well: fewer bound states. Harmonic oscillator: E_n = (n+½)ħω. Hydrogen atom: E_n = -13.6/n² eV.' },
        { label: 'Unit Conversion Note', value: 'L in m. E in J; divide by 1.602×10⁻¹⁹ for eV. 1 nm = 10⁻⁹ m. 1 fm = 10⁻¹⁵ m. m_e = 9.11×10⁻³¹ kg.' }
      ]} },
  description: 'A finite potential well has a limited number of bound states. Unlike the infinite well, the wavefunction penetrates into the barrier regions.',
  formula: 'N ≈ floor(√(2mV₀)L/(πħ)) + 1',
  interpretation: 'A finite well always has at least one bound state. Deeper and wider wells support more bound states. Above V₀, particles are unbound (continuous energy spectrum).'
}

export default calcDef
