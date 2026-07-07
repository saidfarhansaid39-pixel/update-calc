import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ turns: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), fluxChange: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), time: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'turns', label: 'Number of Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'fluxChange', label: 'Change in Magnetic Flux', type: 'number', unit: 'Wb', step: '0.001' }, { name: 'time', label: 'Time Interval', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  compute: (v) => { const emf = -v.turns * v.fluxChange / v.time; return { result: Math.abs(emf), label: 'Induced EMF', unit: 'V', steps: [{ label: 'Formula', value: '|ε| = N|ΔΦ/Δt|' }, { label: 'Result', value: `${Math.abs(emf).toExponential(4)} V` }] } },
  description: 'Faraday\'s Law of Induction: a changing magnetic flux through a coil induces an electromotive force proportional to the rate of change of flux.',
  formula: 'ε = -N·dΦ/dt',
  interpretation: 'The negative sign (Lenz\'s Law) indicates induced EMF opposes the flux change. This is the fundamental principle behind electrical generators, transformers, and induction coils.'
}

export default calcDef
