import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'area', label: 'Area', type: 'number', unit: 'm^2', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.force / v.area, label: 'Pressure', unit: 'Pa', steps: [{ label: 'Formula', value: 'P = F/A' }, { label: 'Substitute', value: `${v.force} / ${v.area}` }, { label: 'Result', value: `${(v.force / v.area).toFixed(2)} Pa` }] }),
  description: 'Pressure is force per unit area. It describes how concentrated a force is over a surface.',
  formula: 'P = F / A',
  interpretation: '1 Pa = 1 N/m^2. Standard atmospheric pressure is 101,325 Pa. A sharp knife concentrates force for easier cutting.'
}

export default calcDef
