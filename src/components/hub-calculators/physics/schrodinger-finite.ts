import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'width', label: 'Well Width', type: 'number', unit: 'nm', min: 0.01, step: '0.01' }, { name: 'depth', label: 'Well Depth V₀', type: 'number', unit: 'eV', min: 0.1, step: '0.1' }],
  compute: (v) => { const me = 9.109e-31; const e = 1.602e-19; const hbar = 1.055e-34; const L = v.width * 1e-9; const V0 = v.depth * e; const N = Math.floor(Math.sqrt(2 * me * V0) * L / (Math.PI * hbar)) + 1; return { result: N, label: 'Estimated Number of Bound States', unit: '', steps: [{ label: 'Formula', value: 'N ≈ floor(√(2mV₀)L/(πħ)) + 1' }, { label: 'Result', value: `~${N} bound states` }, { label: 'Note', value: 'Finite well has fewer states than infinite well of same width' }] } },
  description: 'A finite potential well has a limited number of bound states. Unlike the infinite well, the wavefunction penetrates into the barrier regions.',
  formula: 'N ≈ floor(√(2mV₀)L/(πħ)) + 1',
  interpretation: 'A finite well always has at least one bound state. Deeper and wider wells support more bound states. Above V₀, particles are unbound (continuous energy spectrum).'
}

export default calcDef
