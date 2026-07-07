import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10'), j: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0.5 && n <= 9.5 }, '0.5-9.5') }),
  fields: [{ name: 'n', label: 'Principal Quantum Number n', type: 'number', unit: '', min: 1, max: 10, step: '1' }, { name: 'j', label: 'Total Angular Momentum j', type: 'number', unit: '', min: 0.5, max: 9.5, step: '0.5' }],
  compute: (v) => { const alpha = 7.297e-3; const En = -13.6 / (v.n * v.n); const dE = alpha * alpha * En * (1 / (v.j + 0.5) - 3 / (4 * v.n)) / v.n; return { result: dE, label: 'Fine Structure Correction', unit: 'eV', steps: [{ label: 'Formula', value: 'ΔE = α²E_n(1/(j+½) - 3/(4n))/n' }, { label: 'Fine-structure constant α', value: '7.297×10^-3 ≈ 1/137' }, { label: 'Correction', value: `${dE.toExponential(4)} eV` }] } },
  description: 'Fine structure arises from relativistic and spin-orbit corrections to atomic energy levels, splitting spectral lines beyond the Bohr model.',
  formula: 'ΔE = α²·E_n·(1/(j+½) - 3/(4n))/n',
  interpretation: 'α ≈ 1/137 is the fine-structure constant. The correction is proportional to α² ≈ 5.3×10^-5 relative to the Bohr energy. Fine structure splitting is much smaller than the Bohr level spacing and requires spectroscopy to observe.'
}

export default calcDef
