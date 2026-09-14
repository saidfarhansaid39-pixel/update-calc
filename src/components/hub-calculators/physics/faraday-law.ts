import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ turns: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), fluxChange: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), time: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'turns', label: 'Number of Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'fluxChange', label: 'Change in Magnetic Flux', type: 'number', unit: 'Wb', step: '0.001' }, { name: 'time', label: 'Time Interval', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  defaults: { turns: '100', field: '0.1', area: '0.01', frequency: '60' },
  presets: [
    { label: 'Generator coil (100 turns, 0.1 T, 0.01 m², 60 Hz)', values: { turns: '100', field: '0.1', area: '0.01', frequency: '60' } },
    { label: 'Transformer (500 turns, 0.5 T/s)', values: { turns: '500', fluxChange: '0.5' } },
    { label: 'Microphone (50 turns, 0.02 T, 2 cm², 1 kHz)', values: { turns: '50', field: '0.02', area: '0.0002', frequency: '1000' } },
  ],
  compute: (v) => { const emf = -v.turns * v.fluxChange / v.time; return { result: Math.abs(emf), label: 'Induced EMF', unit: 'V', steps: [{ label: 'Formula', value: '|ε| = N|ΔΦ/Δt|' }, { label: 'Result', value: `${Math.abs(emf).toExponential(4)} V` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Faraday\'s law is the principle behind electric generators, transformers, induction cooktops, and RFID tags.' },
        { label: 'Common Values', value: 'ε = -NdΦ/dt. Generator: 60 Hz → ε_max = NBAω. Typical generator: 12 kV. Transformer: V₁/V₂ = N₁/N₂. Induction cooktop: 20-100 kHz.' },
        { label: 'Precision Tip', value: 'Lenz\'s law: induced current opposes the change. ε = -dΦ/dt. For rotating coil: ε = NBAω sin(ωt). RMS voltage: V_rms = NBAω/√2.' },
        { label: 'Related Formula', value: 'ε = -NdΦ/dt. Φ = BAcosθ. Transformer: V_s/V_p = N_s/N_p. Induced EMF = BLv (moving conductor). Self-inductance: ε = -L dI/dt.' },
        { label: 'Unit Conversion Note', value: 'Φ in Wb = T·m². ε in V. 1 V = 1 Wb/s. B in T. A in m². f in Hz. ω = 2πf in rad/s.' }
      ]} },
  description: 'Faraday\'s Law of Induction: a changing magnetic flux through a coil induces an electromotive force proportional to the rate of change of flux.',
  formula: 'ε = -N·dΦ/dt',
  interpretation: 'The negative sign (Lenz\'s Law) indicates induced EMF opposes the flux change. This is the fundamental principle behind electrical generators, transformers, and induction coils.'
}

export default calcDef
