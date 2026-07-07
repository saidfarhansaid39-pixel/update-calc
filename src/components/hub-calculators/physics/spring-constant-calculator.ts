import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), stretch: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Applied Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'stretch', label: 'Displacement', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.force / v.stretch, label: 'Spring Constant', unit: 'N/m', steps: [{ label: 'Formula', value: 'k = F/x (Hooke\'s Law)' }, { label: 'Substitute', value: `${v.force} / ${v.stretch}` }, { label: 'Result', value: `${(v.force / v.stretch).toFixed(2)} N/m` }] }),
  description: 'Hooke\'s Law: the force required to stretch a spring is proportional to the displacement. k = F/x.',
  formula: 'F = kx',
  interpretation: 'The spring constant k measures stiffness. Higher k means a stiffer spring requiring more force per unit displacement.'
}

export default calcDef
