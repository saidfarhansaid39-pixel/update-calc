import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ emf: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), resistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'emf', label: 'Induced EMF', type: 'number', unit: 'V', min: 0.001, step: '0.001' }, { name: 'resistance', label: 'Circuit Resistance', type: 'number', unit: 'ohm', min: 0.01, step: '0.01' }],
  defaults: { fluxChange: '0.01', time: '0.1', turns: '100' },
  presets: [
    { label: 'Magnet approaching coil', values: { fluxChange: '0.01', time: '0.1', turns: '100' } },
    { label: 'Transformer primary', values: { fluxChange: '0.05', time: '0.0167', turns: '200' } },
    { label: 'Induction heating', values: { fluxChange: '0.5', time: '0.001', turns: '10' } },
  ],
  compute: (v) => { const I = v.emf / v.resistance; return { result: I, label: 'Induced Current', unit: 'A', steps: [{ label: 'Formula', value: 'I = eps/R (Ohm\'s Law)' }, { label: 'Substitute', value: `${v.emf} / ${v.resistance}` }, { label: 'Result', value: `${I.toExponential(4)} A` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Lenz\'s law explains eddy current braking, metal detectors, and induction heating. It ensures energy conservation in electromagnetic induction.' },
        { label: 'Common Values', value: 'ε = -NΔΦ/Δt. The negative sign is Lenz\'s law. Eddy current brakes in trains: powerful magnets induce opposing currents.' },
        { label: 'Precision Tip', value: 'The induced current creates a magnetic field that opposes the original change. Direction determined by Lenz\'s law / right-hand rule.' },
        { label: 'Related Formula', value: 'ε = -N dΦ/dt. Lenz\'s law is the negative sign in Faraday\'s law. Eddy currents: I_ind = ε/R. Back EMF in motors.' },
        { label: 'Unit Conversion Note', value: 'Φ in Wb. t in s. ε in V. 1 T·m² = 1 Wb. ΔΦ/Δt in Wb/s = V/turn.' }
      ]} },
  description: 'Lenz\'s Law states that the direction of induced current opposes the change in magnetic flux that produced it.',
  formula: 'eps = -dΦ/dt',
  interpretation: 'The induced current creates a magnetic field opposing the flux change. This is a consequence of energy conservation.'
}

export default calcDef
