import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ p1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), v1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), t1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), p2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), t2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'p1', label: 'Initial Pressure', type: 'number', unit: 'Pa', min: 100, step: '100' }, { name: 'v1', label: 'Initial Volume', type: 'number', unit: 'm^3', min: 0.0001, step: '0.0001' }, { name: 't1', label: 'Initial Temperature', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'p2', label: 'Final Pressure', type: 'number', unit: 'Pa', min: 100, step: '100' }, { name: 't2', label: 'Final Temperature', type: 'number', unit: 'K', min: 1, step: '1' }],
  compute: (v) => { const v2 = v.p1 * v.v1 * v.t2 / (v.p2 * v.t1); return { result: v2, label: 'Final Volume', unit: 'm^3', steps: [{ label: 'Formula', value: 'P1V1/T1 = P2V2/T2' }, { label: 'Substitute', value: `${v.p1}×${v.v1}/${v.t1} = ${v.p2}×V2/${v.t2}` }, { label: 'Result', value: `${v2.toFixed(6)} m^3` }] } },
  description: 'The combined gas law relates pressure, volume, and temperature for a fixed amount of gas: P1V1/T1 = P2V2/T2.',
  formula: 'P1V1/T1 = P2V2/T2',
  interpretation: 'Temperature must be in Kelvin. This law combines Boyle\'s Law, Charles\'s Law, and Gay-Lussac\'s Law into one equation.'
}

export default calcDef
