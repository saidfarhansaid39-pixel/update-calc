import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lInit: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 10 }, '0-10'), lFinal: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 10 }, '0-10') }),
  fields: [{ name: 'lInit', label: 'Initial Orbital l', type: 'number', unit: '', min: 0, max: 10, step: '1' }, { name: 'lFinal', label: 'Final Orbital l\'', type: 'number', unit: '', min: 0, max: 10, step: '1' }],
  compute: (v) => { const dl = Math.abs(v.lInit - v.lFinal); const allowed = dl === 1; return { result: allowed ? 'Allowed' : 'Forbidden', label: 'Transition Status', unit: '', steps: [{ label: 'Selection Rule', value: 'Δl = ±1 (dipole)' }, { label: 'Δl', value: String(dl) }, { label: 'Result', value: allowed ? 'Allowed ✓' : 'Forbidden ✗ (very weak)' }] } },
  description: 'Selection rules determine which quantum transitions are allowed via electric dipole radiation. Δl = ±1 is the primary rule for orbital angular momentum.',
  formula: 'Δl = ±1, Δj = 0, ±1 (but j=0 → j=0 forbidden)',
  interpretation: 'Allowed transitions have a high probability. Forbidden transitions can occur weakly via higher-order processes (quadrupole, etc.). The rules derive from conservation of angular momentum and parity.'
}

export default calcDef
