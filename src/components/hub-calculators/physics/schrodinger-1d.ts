import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 20 }, '1-20'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'n', label: 'Quantum Number n', type: 'number', unit: '', min: 1, max: 20, step: '1' }, { name: 'width', label: 'Well Width L', type: 'number', unit: 'nm', min: 0.01, step: '0.01' }],
  defaults: { length: '1e-9', n: '1' },
  presets: [
    { label: 'Electron in 1D box (1 nm)', values: { length: '1e-9', n: '1' } },
    { label: 'Electron n=2 (1 nm box)', values: { length: '1e-9', n: '2' } },
    { label: 'Proton in nucleus (1 fm)', values: { length: '1e-15', n: '1' } },
  ],
  compute: (v) => { const h = 6.626e-34; const me = 9.109e-31; const e = 1.602e-19; const L = v.width * 1e-9; const En = (v.n * v.n * h * h) / (8 * me * L * L); const En_eV = En / e; return { result: En_eV, label: 'Energy', unit: 'eV', steps: [{ label: 'Formula', value: 'E_n = n²h²/(8mL²)' }, { label: 'Width', value: `${v.width} nm` }, { label: 'Energy E_n', value: `${En_eV.toExponential(4)} eV` }, { label: 'Energy E₁', value: `${((h * h) / (8 * me * L * L) / e).toExponential(4)} eV` }] ,
    extras: [
        { label: 'Real-World Application', value: 'The Schrödinger equation describes quantum systems — from electron orbitals in atoms to energy levels in quantum dots and semiconductor wells.' },
        { label: 'Common Values', value: 'h = 6.626×10⁻³⁴ J·s. ħ = h/2π = 1.055×10⁻³⁴ J·s. m_e = 9.11×10⁻³¹ kg. 1 nm box: E₁ = 0.376 eV. 1 fm box: E₁ = 376 MeV.' },
        { label: 'Precision Tip', value: 'Infinite square well: E_n = n²h²/(8mL²). Wavefunctions: ψ_n(x) = √(2/L) sin(nπx/L). n = 1 is ground state (lowest energy).' },
        { label: 'Related Formula', value: 'E_n = n²h²/(8mL²). Finite well: fewer bound states. Harmonic oscillator: E_n = (n+½)ħω. Hydrogen atom: E_n = -13.6/n² eV.' },
        { label: 'Unit Conversion Note', value: 'L in m. E in J; divide by 1.602×10⁻¹⁹ for eV. 1 nm = 10⁻⁹ m. 1 fm = 10⁻¹⁵ m. m_e = 9.11×10⁻³¹ kg.' }
      ]} },
  description: 'Particle in a 1D infinite square well: the simplest quantum mechanical bound system with discrete allowed energy levels.',
  formula: 'E_n = n²h²/(8mL²)',
  interpretation: 'Energy is quantized and proportional to n². The ground state (n=1) has non-zero energy (zero-point energy). Decreasing well width increases all energy levels. Wavefunction nodes increase with n.'
}

export default calcDef
