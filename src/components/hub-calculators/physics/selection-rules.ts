import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lInit: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 10 }, '0-10'), lFinal: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 10 }, '0-10') }),
  fields: [{ name: 'lInit', label: 'Initial Orbital l', type: 'number', unit: '', min: 0, max: 10, step: '1' }, { name: 'lFinal', label: 'Final Orbital l\'', type: 'number', unit: '', min: 0, max: 10, step: '1' }],
  defaults: { lInit: '1', lFinal: '1' },
  presets: [
    { label: 'Standard example 1', values: { lInit: '1', lFinal: '1' } },
    { label: 'Standard example 2', values: { lInit: '10', lFinal: '10' } },
    { label: 'Standard example 3', values: { lInit: '100', lFinal: '100' } },
  ],
  compute: (v) => { const dl = Math.abs(v.lInit - v.lFinal); const allowed = dl === 1; return { result: allowed ? 'Allowed' : 'Forbidden', label: 'Transition Status', unit: '', steps: [{ label: 'Selection Rule', value: 'Δl = ±1 (dipole)' }, { label: 'Δl', value: String(dl) }, { label: 'Result', value: allowed ? 'Allowed ✓' : 'Forbidden ✗ (very weak)' }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Selection rules determine which quantum transitions are allowed via electric dipole radiation. Δl = ±1 is the primary rule for orbital angular momentum.',
  formula: 'Δl = ±1, Δj = 0, ±1 (but j=0 → j=0 forbidden)',
  interpretation: 'Allowed transitions have a high probability. Forbidden transitions can occur weakly via higher-order processes (quadrupole, etc.). The rules derive from conservation of angular momentum and parity.'
}

export default calcDef
