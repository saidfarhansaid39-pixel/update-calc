import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), workFunction: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'frequency', label: 'Photon Frequency', type: 'number', unit: 'Hz', min: 1e14, step: '1e14' }, { name: 'workFunction', label: 'Work Function', type: 'number', unit: 'eV', min: 1, step: '0.1' }],
  compute: (v) => { const h = 6.626e-34; const e = 1.602e-19; const E = h * v.frequency; const E_eV = E / e; const K = E_eV - v.workFunction; const f0 = v.workFunction * e / h; return { result: K > 0 ? K : 0, label: 'Max Kinetic Energy', unit: 'eV', steps: [{ label: 'Formula', value: 'K_max = hf - φ' }, { label: 'Photon energy', value: `${E_eV.toExponential(4)} eV` }, { label: 'Kinetic energy', value: K > 0 ? `${K.toExponential(4)} eV` : 'None (below threshold)' }, { label: 'Threshold frequency', value: `${f0.toExponential(4)} Hz` }] } },
  description: 'The photoelectric effect: photons eject electrons from a material if their energy exceeds the work function. Einstein explained this using light quanta.',
  formula: 'K_max = hf - φ',
  interpretation: 'φ is the work function (binding energy). Below threshold frequency f₀ = φ/h, no electrons are emitted. The effect demonstrates the particle nature of light. Used in photodetectors and solar cells.'
}

export default calcDef
