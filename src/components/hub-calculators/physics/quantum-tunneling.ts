import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ energy: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), barrierHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), barrierWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'energy', label: 'Particle Energy', type: 'number', unit: 'eV', min: 0.01, step: '0.01' }, { name: 'barrierHeight', label: 'Barrier Height V₀', type: 'number', unit: 'eV', min: 0.01, step: '0.01' }, { name: 'barrierWidth', label: 'Barrier Width', type: 'number', unit: 'nm', min: 0.01, step: '0.01' }, { name: 'mass', label: 'Particle Mass (×mₑ)', type: 'number', unit: 'mₑ', min: 0.01, step: '0.01' }],
  defaults: { energy: '1', barrierHeight: '5', barrierWidth: '1e-9', mass: '9.11e-31' },
  presets: [
    { label: 'Electron through 1 nm barrier (1 eV)', values: { energy: '1', barrierHeight: '5', barrierWidth: '1e-9', mass: '9.11e-31' } },
    { label: 'Alpha decay (8 MeV, 20 fm)', values: { energy: '8e6', barrierHeight: '30e6', barrierWidth: '2e-14', mass: '6.64e-27' } },
    { label: 'STM tip (2 eV, 0.5 nm)', values: { energy: '2', barrierHeight: '4', barrierWidth: '5e-10', mass: '9.11e-31' } },
  ],
  compute: (v) => { const me = 9.109e-31; const e = 1.602e-19; const hbar = 1.055e-34; const m = v.mass * me; const E_J = v.energy * e; const V0_J = v.barrierHeight * e; const kappa = Math.sqrt(2 * m * (V0_J - E_J)) / hbar; const T = E_J < V0_J ? Math.exp(-2 * kappa * v.barrierWidth * 1e-9) : 1; const Tnum = typeof T === 'number' ? T : 0; return { result: Tnum, label: 'Transmission Probability', unit: '', steps: [{ label: 'Formula', value: 'T ≈ exp(-2κa), κ = √(2m(V₀-E))/ħ' }, { label: 'Barrier penetration', value: E_J < V0_J ? `κ = ${kappa.toExponential(4)} m^-1` : 'Above barrier' }, { label: 'Probability', value: Tnum < 1e-10 ? `${Tnum.toExponential(2)}` : `${Tnum.toFixed(6)}` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Quantum tunneling enables Scanning Tunneling Microscopy (STM) which images individual atoms, flash memory (Fowler-Nordheim tunneling), and alpha decay.' },
        { label: 'Common Values', value: 'Transmission probability T ≈ 16E(V₀-E)/V₀² × e^(-2κa). κ = √(2m(V₀-E))/ħ. STM: exponential sensitivity to distance — Å resolution.' },
        { label: 'Precision Tip', value: 'Tunneling probability drops exponentially with barrier width and mass. Heavy particles (α) need very narrow barriers. Electrons tunnel easily at nm scales.' },
        { label: 'Related Formula', value: 'Transmission: T ≈ 16E(V₀-E)/V₀² × e^(-2κa). κ = √(2m(V₀-E))/ħ. WKB approximation for non-rectangular barriers.' },
        { label: 'Unit Conversion Note', value: 'E in eV. 1 eV = 1.602×10⁻¹⁹ J. Width in m. ħ = 1.055×10⁻³⁴ J·s. m_e = 9.11×10⁻³¹ kg. ħc = 197 eV·nm.' }
      ]} },
  description: 'Quantum tunneling allows particles to pass through barriers that would be classically impenetrable. The probability decreases exponentially with barrier width and height.',
  formula: 'T ≈ exp(-2κa), κ = √(2m(V₀-E))/ħ',
  interpretation: 'Tunneling is purely quantum mechanical with no classical analog. Used in scanning tunneling microscopes (STM), tunnel diodes, and nuclear fusion in stars. Alpha decay is a tunneling process.'
}

export default calcDef
