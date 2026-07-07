import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ colonization: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), extinction: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), patches: z.string().optional() }),
  fields: [
    { name: 'colonization', label: 'Colonization rate (c)', type: 'number', min: 0.001, step: '0.001' },
    { name: 'extinction', label: 'Extinction rate (e)', type: 'number', min: 0.001, step: '0.001' },
    { name: 'patches', label: 'Total patches (optional)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const c = parseFloat(v.colonization); const e = parseFloat(v.extinction); const p_eq = c>e ? 1 - e/c : 0; const totalPatches = parseInt(v.patches)||100; const occupied = Math.round(p_eq * totalPatches); return { result: p_eq, label: 'Equilibrium Occupancy (p*)', unit: '', steps: [{ label: 'Colonization rate (c)', value: `${c}` }, { label: 'Extinction rate (e)', value: `${e}` }, { label: 'p* = 1 - e/c', value: p_eq.toFixed(4) }, { label: 'Occupied patches', value: `${occupied}/${totalPatches}` }, { label: 'Status', value: p_eq<=0?'Metapopulation cannot persist':p_eq<0.5?'Unstable':p_eq<0.8?'Moderate':'Stable persistence' }] } },
  description: 'Levins metapopulation model calculates the equilibrium fraction of occupied habitat patches based on colonization and extinction rates.',
  formula: 'p* = 1 - e/c | Requires c > e for persistence',
  interpretation: 'When c > e, a fraction of patches remains occupied at equilibrium. If c ≤ e, the metapopulation cannot persist and goes extinct.'
}

export default calcDef
