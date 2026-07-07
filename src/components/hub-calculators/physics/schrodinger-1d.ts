import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 20 }, '1-20'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'n', label: 'Quantum Number n', type: 'number', unit: '', min: 1, max: 20, step: '1' }, { name: 'width', label: 'Well Width L', type: 'number', unit: 'nm', min: 0.01, step: '0.01' }],
  compute: (v) => { const h = 6.626e-34; const me = 9.109e-31; const e = 1.602e-19; const L = v.width * 1e-9; const En = (v.n * v.n * h * h) / (8 * me * L * L); const En_eV = En / e; return { result: En_eV, label: 'Energy', unit: 'eV', steps: [{ label: 'Formula', value: 'E_n = n²h²/(8mL²)' }, { label: 'Width', value: `${v.width} nm` }, { label: 'Energy E_n', value: `${En_eV.toExponential(4)} eV` }, { label: 'Energy E₁', value: `${((h * h) / (8 * me * L * L) / e).toExponential(4)} eV` }] } },
  description: 'Particle in a 1D infinite square well: the simplest quantum mechanical bound system with discrete allowed energy levels.',
  formula: 'E_n = n²h²/(8mL²)',
  interpretation: 'Energy is quantized and proportional to n². The ground state (n=1) has non-zero energy (zero-point energy). Decreasing well width increases all energy levels. Wavefunction nodes increase with n.'
}

export default calcDef
