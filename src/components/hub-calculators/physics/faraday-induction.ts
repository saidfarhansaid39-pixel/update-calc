import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ turns: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), fluxChange: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), time: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'turns', label: 'Number of Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'fluxChange', label: 'Magnetic Flux Change', type: 'number', unit: 'Wb', step: '0.001' }, { name: 'time', label: 'Time Interval', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  compute: (v) => { const emf = -v.turns * v.fluxChange / v.time; return { result: emf, label: 'Induced EMF', unit: 'V', steps: [{ label: 'Formula', value: 'eps = -N·ΔΦ/Δt' }, { label: 'Substitute', value: `-${v.turns} × ${v.fluxChange} / ${v.time}` }, { label: 'Result', value: `${emf.toExponential(4)} V` }] } },
  description: 'Faraday\'s Law: a changing magnetic flux induces an electromotive force (EMF) proportional to the rate of change of flux.',
  formula: 'eps = -N·ΔΦ / Δt',
  interpretation: 'The negative sign is Lenz\'s Law. Induced EMF opposes the change in flux. This principle underlies generators and transformers.'
}

export default calcDef
