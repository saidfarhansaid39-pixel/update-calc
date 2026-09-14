import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), stretch: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Applied Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'stretch', label: 'Displacement', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { springConstant: '100', displacement: '0.1' },
  presets: [
    { label: 'Stretch 0.1 m (k=100 N/m)', values: { springConstant: '100', displacement: '0.1' } },
    { label: 'Car suspension (k=20000, 0.05 m)', values: { springConstant: '20000', displacement: '0.05' } },
    { label: 'Trampoline (k=5000, 0.3 m)', values: { springConstant: '5000', displacement: '0.3' } },
  ],
  compute: (v) => ({ result: v.force / v.stretch, label: 'Spring Constant', unit: 'N/m', steps: [{ label: 'Formula', value: 'k = F/x (Hooke\'s Law)' }, { label: 'Substitute', value: `${v.force} / ${v.stretch}` }, { label: 'Result', value: `${(v.force / v.stretch).toFixed(2)} N/m` }],
      extras: [
        { label: 'Real-World Application', value: 'Hooke\'s law applies to car suspensions, mattresses, trampolines, and seismic sensors. Springs store elastic potential energy for mechanical systems.' },
        { label: 'Common Values', value: 'Pen spring: ~10 N/m. Mouse trap: ~50 N/m. Car suspension: ~20,000 N/m. Crane cable: ~10⁶ N/m. Human hair: ~10⁻³ N/m.' },
        { label: 'Precision Tip', value: 'Hooke\'s law F = -kx assumes small displacements within elastic limit. Beyond yield point, permanent deformation occurs.' },
        { label: 'Related Formula', value: 'F = -kx. Elastic PE: PE = ½kx². Spring-mass period: T = 2π√(m/k). Series springs: 1/k_eq = 1/k₁+1/k₂. Parallel: k_eq = k₁+k₂.' },
        { label: 'Unit Conversion Note', value: 'k in N/m. x in m. Convert cm to m: divide by 100. 1 N/m = 1 kg/s². lbf/in to N/m: multiply by 175.1.' }
      ] }),
  description: 'Hooke\'s Law: the force required to stretch a spring is proportional to the displacement. k = F/x.',
  formula: 'F = kx',
  interpretation: 'The spring constant k measures stiffness. Higher k means a stiffer spring requiring more force per unit displacement.'
}

export default calcDef
