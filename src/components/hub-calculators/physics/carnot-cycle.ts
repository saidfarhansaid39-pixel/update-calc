import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ Th: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), Tc: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'Th', label: 'Hot Reservoir T_h', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'Tc', label: 'Cold Reservoir T_c', type: 'number', unit: 'K', min: 1, step: '1' }],
  compute: (v) => { const eff = 1 - v.Tc / v.Th; const copR = v.Tc / (v.Th - v.Tc); const copHP = v.Th / (v.Th - v.Tc); return { result: eff, label: 'Carnot Efficiency η_carnot', unit: '', steps: [{ label: 'Formula', value: 'η_carnot = 1 - T_c/T_h' }, { label: 'Efficiency', value: `${(eff * 100).toFixed(1)}%` }, { label: 'COP (refrigerator)', value: `${copR.toFixed(2)}` }, { label: 'COP (heat pump)', value: `${copHP.toFixed(2)}` }] } },
  description: 'The Carnot cycle is the most efficient heat engine cycle possible between two temperatures. No real engine can exceed η_carnot = 1 - T_c/T_h (Carnot\'s theorem).',
  formula: 'η_carnot = 1 - T_c / T_h',
  interpretation: 'For T_h = 500 K, T_c = 300 K, η_max = 40%. To increase efficiency, raise T_h or lower T_c. Real engines achieve ~50-80% of Carnot efficiency due to irreversibilities.'
}

export default calcDef
